import { NextRequest, NextResponse } from "next/server";
import { getAdmin, listAllUsers } from "@/lib/admin";
import { sendDigestToUser, Frequency } from "@/lib/digest";
import { authorizeCron } from "@/lib/cron-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function windowMs(freq: Frequency): number {
  return (freq === "daily" ? 1 : freq === "monthly" ? 30 : 7) * 864e5;
}

// A user's effective cadence = their most frequent topic (free users are
// always weekly). Pro users with a daily topic get a daily send.
function effectiveFrequency(tier: "free" | "pro", freqs: string[]): Frequency {
  if (tier !== "pro") return "weekly";
  if (freqs.includes("daily")) return "daily";
  if (freqs.includes("weekly")) return "weekly";
  if (freqs.includes("monthly")) return "monthly";
  return "weekly";
}

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const admin = getAdmin();
  const users = await listAllUsers();

  // Last-sent map (derived from bmn_digests; avoids a schema column).
  const { data: lastRows } = await admin
    .from("bmn_digests")
    .select("user_id, sent_at")
    .order("sent_at", { ascending: false });
  const lastSent = new Map<string, number>();
  for (const r of lastRows || []) {
    if (!lastSent.has(r.user_id)) lastSent.set(r.user_id, new Date(r.sent_at).getTime());
  }

  const results: Record<string, number> = { sent: 0, skipped: 0, error: 0, notDue: 0 };
  const errors: string[] = [];
  const now = Date.now();

  for (const user of users) {
    if (user.unsubscribed) { results.skipped++; continue; }

    const { data: topicRows } = await admin
      .from("bmn_user_topics")
      .select("frequency")
      .eq("user_id", user.id);
    if (!topicRows || topicRows.length === 0) { results.skipped++; continue; }

    const freq = effectiveFrequency(user.tier, topicRows.map((t) => t.frequency as string));
    const last = lastSent.get(user.id);
    if (last && now - last < windowMs(freq) * 0.95) { results.notDue++; continue; }

    try {
      const r = await sendDigestToUser(user, { frequency: freq });
      results[r.status === "sent" ? "sent" : r.status === "error" ? "error" : "skipped"]++;
      if (r.status === "error") errors.push(`${user.email}: ${r.reason}`);
    } catch (e) {
      results.error++;
      errors.push(`${user.email}: ${(e as Error).message}`);
    }
  }

  return NextResponse.json({ ok: true, users: users.length, ...results, errors: errors.slice(0, 15) });
}
