import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { fetchRSSFeed } from "@/lib/rss";
import { authorizeCron } from "@/lib/cron-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function safeDate(input: string | null): string | null {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// Fetch every active source's RSS feed and upsert new articles into
// bmn_articles (dedup on url). Designed to be cheap and resilient: one bad
// feed never fails the run.
export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const admin = getAdmin();
  const { data: sources, error } = await admin
    .from("bmn_sources")
    .select("id, name, rss_url");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let fetched = 0;
  let inserted = 0;
  const failures: string[] = [];

  // Modest concurrency to stay within the function time budget.
  const pool = 6;
  const queue = [...(sources || [])];
  async function worker() {
    for (;;) {
      const src = queue.shift();
      if (!src) return;
      try {
        const items = await fetchRSSFeed(src.rss_url);
        fetched += items.length;
        const rows = items
          .filter((a) => a.url && a.title)
          .slice(0, 40)
          .map((a) => ({
            source_id: src.id,
            title: a.title.slice(0, 500),
            url: a.url,
            description: (a.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1000),
            published_at: safeDate(a.published_at),
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
    sources: sources?.length || 0,
    itemsSeen: fetched,
    inserted,
    failures: failures.slice(0, 20),
  });
}
