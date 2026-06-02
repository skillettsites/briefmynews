import Stripe from "stripe";

function clean(v: string | undefined): string {
  return (v || "").replace(/\\n$/, "").trim();
}

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = clean(process.env.STRIPE_SECRET_KEY);
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}

export function stripeConfigured(): boolean {
  return !!clean(process.env.STRIPE_SECRET_KEY);
}

// BriefMyNews Pro pricing — billed in GBP via Stripe price IDs (see Stripe
// dashboard product prod_Ud3WwPnN1kRLtl). Lookup keys mirror these IDs so we
// can re-resolve them if the price gets rotated.
export const PLANS = {
  annual: {
    priceId: "price_1TdnPsIpnYPofJui6hE9A3N2",
    lookupKey: "bmn_pro_annual_gbp",
    label: "BriefMyNews Pro (annual)",
    displayPrice: "£29.99/yr",
  },
  monthly: {
    priceId: "price_1TdnPsIpnYPofJui0q9T5cfH",
    lookupKey: "bmn_pro_monthly_gbp",
    label: "BriefMyNews Pro (monthly)",
    displayPrice: "£4.99/mo",
  },
} as const;

export type PlanKey = keyof typeof PLANS;
