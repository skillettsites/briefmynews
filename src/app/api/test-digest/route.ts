import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, getUserById } from "@/lib/admin";
import { sendDigestToUser, Frequency } from "@/lib/digest";
import { authorizeCron } from "@/lib/cron-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Admin-only: force-send a digest to one user immediately. Used for live QA.
//   /api/test-digest?secret=...&email=you@example.com
//   /api/test-digest?secret=...&userId=<uuid>&frequency=daily
export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const email = req.nextUrl.searchParams.get("email");
  const userId = req.nextUrl.searchParams.get("userId");
  const frequency = (req.nextUrl.searchParams.get("frequency") as Frequency) || undefined;

  const user = userId ? await getUserById(userId) : email ? await findUserByEmail(email) : null;
  if (!user) {
    return NextResponse.json({ error: "user not found", email, userId }, { status: 404 });
  }

  const result = await sendDigestToUser(user, { force: true, frequency });
  return NextResponse.json({ to: user.email, tier: user.tier, ...result });
}
