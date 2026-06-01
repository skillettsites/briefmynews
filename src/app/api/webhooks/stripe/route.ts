import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { findUserByEmail, getUserById, setUserMeta } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
