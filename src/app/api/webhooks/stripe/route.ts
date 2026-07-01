import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getStripe } from "@/lib/stripe";
import { findUserByEmail, getUserById, setUserMeta } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reminder sent ~3 days before a free trial converts to a paid subscription, so
// no one is ever charged by surprise (best practice + reduces chargebacks).
async function sendTrialEndingEmail(email: string, trialEnd: number | null) {
  const key = (process.env.RESEND_API_KEY || "").replace(/\\n$/, "").trim();
  if (!key) return;
  const from = process.env.DIGEST_FROM || "BriefMyNews <digest@briefmynews.com>";
  const dateStr = trialEnd
    ? new Date(trialEnd * 1000).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "in a few days";
  try {
    await new Resend(key).emails.send({
      from,
      to: email,
      subject: "Your free month of BriefMyNews Pro is ending soon",
      html: `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:28px 20px;">
    <div style="font-size:20px;font-weight:800;color:#1a1a2e;margin-bottom:16px;">Brief<span style="color:#60a5fa;">My</span>News</div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px;">
      <h1 style="font-size:19px;margin:0 0 10px;color:#1a1a2e;">Your free month is ending</h1>
      <p style="color:#4b5563;margin:0 0 14px;line-height:1.55;">Your free month of BriefMyNews Pro ends on <b>${dateStr}</b>. After that your card will be charged <b>£4.99/month</b> and your Pro features continue.</p>
      <p style="color:#4b5563;margin:0 0 18px;line-height:1.55;">Happy to keep it? Great, there's nothing to do. If not, you can cancel in one click before then and you won't be charged.</p>
      <a href="https://briefmynews.com/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;padding:11px 20px;border-radius:999px;">Manage or cancel</a>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin-top:16px;">BriefMyNews, London, United Kingdom.</p>
  </div></body></html>`,
    });
  } catch (e) {
    console.error("trial-ending email failed:", (e as Error).message);
  }
}

// Resolve the BriefMyNews user a Stripe event belongs to, by metadata.userId
// first, then by customer email.
async function resolveUserId(
  stripe: Stripe,
  metadataUserId: string | undefined,
  customerId: string | null,
  email: string | null
): Promise<string | null> {
  if (metadataUserId) {
    const u = await getUserById(metadataUserId);
    if (u) return u.id;
  }
  let resolvedEmail = email;
  if (!resolvedEmail && customerId) {
    try {
      const cust = await stripe.customers.retrieve(customerId);
      if (cust && !cust.deleted) resolvedEmail = (cust as Stripe.Customer).email || null;
    } catch {
      /* ignore */
    }
  }
  if (resolvedEmail) {
    const u = await findUserByEmail(resolvedEmail);
    if (u) return u.id;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const raw = await req.text();
  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("Stripe signature verification failed:", (err as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = await resolveUserId(
          stripe,
          s.metadata?.userId,
          typeof s.customer === "string" ? s.customer : s.customer?.id || null,
          s.customer_details?.email || s.customer_email || null
        );
        if (userId) {
          await setUserMeta(userId, {
            tier: "pro",
            stripe_customer_id: typeof s.customer === "string" ? s.customer : s.customer?.id,
            stripe_subscription_id: typeof s.subscription === "string" ? s.subscription : s.subscription?.id,
            unsubscribed: false,
          });
        }
        break;
      }
      case "customer.subscription.trial_will_end": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(
          stripe,
          sub.metadata?.userId,
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id || null,
          null
        );
        if (userId) {
          const u = await getUserById(userId);
          if (u?.email) await sendTrialEndingEmail(u.email, sub.trial_end ?? null);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const active = sub.status === "active" || sub.status === "trialing";
        const userId = await resolveUserId(
          stripe,
          sub.metadata?.userId,
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id || null,
          null
        );
        if (userId) {
          await setUserMeta(userId, {
            tier: active ? "pro" : "free",
            stripe_subscription_id: sub.id,
          });
        }
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("webhook processing error:", (e as Error).message);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
