import { NextRequest, NextResponse } from "next/server";
import { getStripe, stripeConfigured, PLANS, PlanKey } from "@/lib/stripe";
import { getUserById } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Create a Stripe Checkout session for BriefMyNews Pro. Called from the
// dashboard / pricing upgrade buttons.
//   POST { userId, plan: "annual" | "monthly" }
export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 });
  }
  let body: { userId?: string; plan?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const planKey = (body.plan as PlanKey) || "annual";
  const plan = PLANS[planKey];
  if (!plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const user = body.userId ? await getUserById(body.userId) : null;
  const email = user?.email || body.email;
  if (!user && !email) {
    return NextResponse.json({ error: "userId or email required" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const origin = req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: plan.label },
            unit_amount: plan.amount,
            recurring: { interval: plan.interval },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard?upgraded=1`,
      cancel_url: `${origin}/pricing?cancelled=1`,
      metadata: { userId: user?.id || "", plan: planKey },
      subscription_data: {
        metadata: { userId: user?.id || "", plan: planKey },
      },
    });
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error("checkout error:", (e as Error).message);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
