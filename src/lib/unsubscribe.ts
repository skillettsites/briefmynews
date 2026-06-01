import crypto from "crypto";

// Stateless one-click unsubscribe tokens: HMAC(user_id) so we can verify a
// link without storing a token (keeps us free of a schema migration). The
// secret is CRON_SECRET (already set) which never leaves the server.

function secret(): string {
  return process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-secret";
}

export function makeUnsubToken(userId: string): string {
  const sig = crypto.createHmac("sha256", secret()).update(userId).digest("hex").slice(0, 32);
  return `${userId}.${sig}`;
}

export function verifyUnsubToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const userId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret()).update(userId).digest("hex").slice(0, 32);
  // Constant-time compare.
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return userId;
}

export function unsubUrl(userId: string): string {
  const base = "https://briefmynews.com";
  return `${base}/api/unsubscribe?token=${encodeURIComponent(makeUnsubToken(userId))}`;
}
