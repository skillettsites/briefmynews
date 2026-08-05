import { NextRequest, NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { getBriefCandidates } from "@/lib/homepage-brief";
import { ensurePublicSummaries, ArticleRow } from "@/lib/summarise";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Pre-brief a small, diverse set of recent articles so the public homepage can
// render real AI-written summaries without ever summarising at request time.
//
// Runs between fetch-articles (05:00) and send-digests (06:00). Summaries are
// cached on bmn_articles.summary, which is the SAME field the digest builder
// reads, so anything briefed here is free for the digests half an hour later.
// Cost is bounded: at most BRIEF_BUDGET articles per day on Claude Haiku.
const BRIEF_BUDGET = 24;

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // getBriefCandidates already returns only articles missing a summary, filtered
  // to publishable sources and diversified. Take a WIDE pool and apply the budget
  // last: narrowing to BRIEF_BUDGET up front would waste the day's allowance
  // whenever the newest articles happened to be summarised already.
  const candidates = await getBriefCandidates(200);
  const needing = candidates.slice(0, BRIEF_BUDGET);

  if (needing.length === 0) {
    return NextResponse.json({ ok: true, candidates: candidates.length, summarised: 0, note: "all already briefed" });
  }

  const rows: ArticleRow[] = needing.map((c) => ({
    id: c.id,
    title: c.title,
    description: (c as unknown as { description?: string | null }).description ?? null,
    full_text: (c as unknown as { full_text?: string | null }).full_text ?? null,
    summary: c.summary,
  }));

  const written = await ensurePublicSummaries(rows);

  return NextResponse.json({
    ok: true,
    candidates: candidates.length,
    needed: needing.length,
    summarised: written,
    skipped: needing.length - written,
  });
}
