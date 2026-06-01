import { NextRequest } from "next/server";

// Cron + admin endpoints are gated by CRON_SECRET. Vercel Cron sends it as a
// Bearer token; manual calls may pass ?secret= for convenience.
export function authorizeCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;
  const q = req.nextUrl.searchParams.get("secret");
  return q === secret;
}
