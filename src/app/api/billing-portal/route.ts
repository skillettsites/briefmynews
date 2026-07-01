import { NextRequest, NextResponse } from "next/server";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { getUserById } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Opens the Stripe Billing Portal so a Pro / free-trial user can cancel or
// update their subscription in one click (essential for the free-trial model).
//   POST { userId }
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });
  }
  let body: { userId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const user = await getUserById(body.userId);
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found for this account." }, { status: 404 });
  }

  try {
    const stripe = getStripe();
    const origin = req.nextUrl.origin;

    // The portal needs a configuration to exist on the account. Create a
    // sensible default once if the account has none (idempotent-ish: only when
    // the list is empty), with cancel-at-period-end so a trial cancel keeps
    // access until the free month ends but never charges.
    const configs = await stripe.billingPortal.configurations.list({ limit: 1 });
    if (configs.data.length === 0) {
      await stripe.billingPortal.configurations.create({
        business_profile: {
          privacy_policy_url: "https://briefmynews.com/privacy",
          terms_of_service_url: "https://briefmynews.com/terms",
        },
        features: {
          customer_update: { enabled: true, allowed_updates: ["email"] },
          invoice_history: { enabled: true },
          payment_method_update: { enabled: true },
          subscription_cancel: { enabled: true, mode: "at_period_end" },
        },
      });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (e) {
    console.error("billing-portal error:", (e as Error).message);
    return NextResponse.json({ error: "Could not open the billing portal." }, { status: 500 });
  }
}
