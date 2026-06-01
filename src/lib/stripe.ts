import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

export function stripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// Pro plan pricing. Subscriptions are created with inline price_data so no
// Stripe dashboard product setup is required to go live.
export const PLANS = {
  annual: { amount: 2999, interval: "year" as const, label: "BriefMyNews Pro (annual)" },
  monthly: { amount: 500, interval: "month" as const, label: "BriefMyNews Pro (monthly)" },
};

export type PlanKey = keyof typeof PLANS;
