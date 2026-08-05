import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { fetchRSSFeed, parseFeedDate } from "@/lib/rss";
import { authorizeCron } from "@/lib/cron-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// The digest builder filters on published_at, so a NULL there makes an article
// permanently invisible to every user. Rather than store NULL when a feed's
// date is missing or unparseable, fall back to fetch time so it can never
// silently disappear from digests again. parseFeedDate already handles named
// timezones like BST that JavaScript's Date rejects outright.
//
// The fallback is backdated by INFERRED_DATE_PENALTY. digest.ts scores
// recency as `1 - ageDays / (lookback * 2)`, so stamping an inferred date as
// "now" would hand it the maximum possible recency and let articles with broken
// dates outrank genuinely fresh ones that carry a real timestamp. Backdating a
// few hours keeps them eligible without letting a guess beat a fact.
const INFERRED_DATE_PENALTY_MS = 6 * 3600_000;

function safeDate(input: string | null, seenAtMs: number): string {
  const parsed = parseFeedDate(input);
  if (parsed) return parsed;
  return new Date(seenAtMs - INFERRED_DATE_PENALTY_MS).toISOString();
}

// Fetch every active source's RSS feed and upsert new articles into
// bmn_articles (dedup on url). Designed to be cheap and resilient: one bad
// feed never fails the run.
export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const admin = getAdmin();
  const { data: allSources, error } = await admin
    .from("bmn_sources")
    .select("id, name, rss_url")
    .order("id", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Optional batching so a single invocation always finishes inside the
  // function time budget regardless of Vercel plan limits.
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10) || 0;
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 0;
  const sources = limit > 0 ? (allSources || []).slice(offset, offset + limit) : allSources || [];

  let fetched = 0;
  let inserted = 0;
  const failures: string[] = [];

  // Per-feed fetches are AbortController-capped at 4s, so high concurrency is
  // safe and the run is time-bounded.
  const pool = 12;
  const queue = [...sources];
  async function worker() {
    for (;;) {
      const src = queue.shift();
      if (!src) return;
      try {
        const items = await fetchRSSFeed(src.rss_url);
        fetched += items.length;
        const seenAtMs = Date.now();
        const rows = items
          .filter((a) => a.url && a.title)
          .slice(0, 40)
          .map((a) => ({
            source_id: src.id,
            title: a.title.slice(0, 500),
            url: a.url,
            description: (a.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1000),
            published_at: safeDate(a.published_at, seenAtMs),
          }));
        if (rows.length > 0) {
          const { error: upErr, count } = await admin
            .from("bmn_articles")
            .upsert(rows, { onConflict: "url", ignoreDuplicates: true, count: "exact" });
          if (upErr) failures.push(`${src.name}: ${upErr.message}`);
          else inserted += count || 0;
        }
      } catch (e) {
        failures.push(`${src.name}: ${(e as Error).message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: pool }, () => worker()));

  return NextResponse.json({
    ok: true,
    totalSources: allSources?.length || 0,
    processed: sources.length,
    offset,
    itemsSeen: fetched,
    inserted,
    failures: failures.slice(0, 20),
  });
}
