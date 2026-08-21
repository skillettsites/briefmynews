import { NextRequest, NextResponse } from "next/server";
import { verifyUnsubToken } from "@/lib/unsubscribe";
import { getUserById, setUserMeta } from "@/lib/admin";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Gmail/Yahoo one-click unsubscribe POSTs and shows the user nothing, so a
// silent cancellation would leave a paying customer wondering where their
// subscription went. Confirm it by email (transactional, not marketing).
async function sendCancellationEmail(email: string) {
  const key = (process.env.RESEND_API_KEY || "").replace(/\\n$/, "").trim();
  if (!key) return;
  const from = process.env.DIGEST_FROM || "BriefMyNews <digest@briefmynews.com>";
  try {
    await new Resend(key).emails.send({
      from,
      to: email,
      subject: "Your BriefMyNews subscription has been cancelled",
      html: `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:28px 20px;">
    <div style="font-size:20px;font-weight:800;color:#1a1a2e;margin-bottom:16px;">Brief<span style="color:#60a5fa;">My</span>News</div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;">
      <h1 style="font-size:19px;margin:0 0 10px;color:#1a1a2e;">You're unsubscribed</h1>
      <p style="color:#4b5563;margin:0 0 14px;line-height:1.55;">You asked to stop receiving BriefMyNews digests, so we've also cancelled your Pro subscription. <b>You won't be charged again.</b></p>
      <p style="color:#4b5563;margin:0 0 18px;line-height:1.55;">If that wasn't what you wanted, you can start again any time.</p>
      <a href="https://briefmynews.com/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;padding:11px 20px;border-radius:999px;">Back to BriefMyNews</a>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin-top:16px;">This is a one-off billing confirmation, not a newsletter.</p>
  </div></body></html>`,
    });
  } catch (e) {
    console.error("cancellation email failed:", (e as Error).message);
  }
}

// Unsubscribing has to stop the billing as well as the email. The digest cron
// skips anyone with unsubscribed = true, so leaving a trial or a paid
// subscription running would charge someone for a product we have already
// stopped sending them. Returns true if we cancelled something, so the
// confirmation page can say so.
async function cancelSubscriptions(userId: string): Promise<boolean> {
  if (!stripeConfigured()) return false;
  const user = await getUserById(userId);
  if (!user) return false;

  const stripe = getStripe();
  const ids = new Set<string>();
  if (user.stripeSubscriptionId) ids.add(user.stripeSubscriptionId);
  // The stored id can be stale (resubscribe, or a webhook we missed), so also
  // sweep whatever the customer actually has open right now.
  if (user.stripeCustomerId) {
    try {
      const subs = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "all",
        limit: 100,
      });
      for (const s of subs.data) {
        if (s.status === "trialing" || s.status === "active" || s.status === "past_due") {
          ids.add(s.id);
        }
      }
    } catch (e) {
      console.error("unsubscribe: listing subscriptions failed:", (e as Error).message);
    }
  }

  let cancelled = false;
  for (const id of ids) {
    try {
      const sub = await stripe.subscriptions.retrieve(id);
      if (sub.status === "canceled" || sub.status === "incomplete_expired") continue;
      await stripe.subscriptions.cancel(id);
      cancelled = true;
    } catch (e) {
      console.error(`unsubscribe: cancelling ${id} failed:`, (e as Error).message);
    }
  }
  if (cancelled) {
    await setUserMeta(userId, { tier: "free" });
    if (user.email) await sendCancellationEmail(user.email);
  }
  return cancelled;
}

// One-click unsubscribe (RFC 8058). Gmail/Yahoo POST here; humans clicking the
// footer link hit GET. Both flip app_metadata.unsubscribed = true and cancel
// any live subscription.
async function unsubscribe(
  token: string | null
): Promise<{ ok: boolean; cancelled: boolean }> {
  if (!token) return { ok: false, cancelled: false };
  const userId = verifyUnsubToken(token);
  if (!userId) return { ok: false, cancelled: false };
  try {
    await setUserMeta(userId, { unsubscribed: true });
  } catch {
    return { ok: false, cancelled: false };
  }
  // Never fail the unsubscribe itself because billing cleanup threw.
  let cancelled = false;
  try {
    cancelled = await cancelSubscriptions(userId);
  } catch (e) {
    console.error("unsubscribe: billing cleanup failed:", (e as Error).message);
  }
  return { ok: true, cancelled };
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const { ok, cancelled } = await unsubscribe(token);
  return NextResponse.json({ ok, cancelled }, { status: ok ? 200 : 400 });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const { ok, cancelled } = await unsubscribe(token);
  const body = ok
    ? `<h1 style="font-size:20px;">You're unsubscribed</h1><p style="color:#4b5563;">You won't receive any more digest emails.</p>${
        cancelled
          ? `<p style="color:#4b5563;">We've also cancelled your BriefMyNews Pro subscription, so <b>you won't be charged again</b>. Nothing further to do.</p>`
          : ""
      }<p style="color:#4b5563;">Changed your mind? <a href="https://briefmynews.com/dashboard" style="color:#2563eb;">Start again in your dashboard</a>.</p>`
    : `<h1 style="font-size:20px;">Link not valid</h1><p style="color:#4b5563;">This unsubscribe link is invalid or expired. You can manage email preferences in your <a href="https://briefmynews.com/dashboard" style="color:#2563eb;">dashboard</a>.</p>`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title></head>
  <body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f3f4f6;margin:0;padding:48px 20px;text-align:center;color:#1a1a2e;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;">
      <div style="font-size:22px;font-weight:800;margin-bottom:16px;">Brief<span style="color:#60a5fa;">My</span>News</div>
      ${body}
    </div>
  </body></html>`;
  return new NextResponse(html, { status: ok ? 200 : 400, headers: { "Content-Type": "text/html" } });
}
