import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "BriefMyNews pricing plans. Start free with 3 topics and 5 sources, or go Pro for unlimited everything at just $29.99/year.",
  openGraph: {
    title: "BriefMyNews Pricing",
    description:
      "Start free or go Pro for unlimited topics, sources, and daily delivery.",
    url: "https://briefmynews.com/pricing",
  },
  alternates: { canonical: "https://briefmynews.com/pricing" },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for staying informed on a few key topics.",
    features: [
      { text: "3 topics", included: true },
      { text: "5 news sources", included: true },
      { text: "Weekly digest", included: true },
      { text: "AI-powered summaries", included: true },
      { text: "Source bias labels", included: true },
      { text: "Daily or monthly delivery", included: false },
      { text: "Unlimited topics", included: false },
      { text: "Unlimited sources", included: false },
      { text: "Priority email delivery", included: false },
      { text: "Early access to new features", included: false },
    ],
    cta: "Get Started Free",
    ctaLink: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29.99",
    period: "year",
    description: "For serious readers who want full control over their news.",
    features: [
      { text: "Unlimited topics", included: true },
      { text: "Unlimited news sources", included: true },
      { text: "Daily, weekly, or monthly delivery", included: true },
      { text: "AI-powered summaries with key quotes", included: true },
      { text: "Source bias labels", included: true },
      { text: "Political lean customisation", included: true },
      { text: "Priority email delivery", included: true },
      { text: "Early access to new features", included: true },
      { text: "Custom digest formatting", included: true },
      { text: "Email support", included: true },
    ],
    cta: "Join Waitlist for Pro",
    ctaLink: "/signup",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Simple, honest pricing
        </h1>
        <p className="mt-3 text-lg text-muted">
          No hidden fees. No surprise charges. Start free and upgrade when you
          need more.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-card relative p-8 ${
              plan.highlight ? "border-primary/30" : ""
            }`}
          >
            {plan.highlight && (
              <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">
                Best Value
              </div>
            )}
            <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
            <div className="mt-3">
              <span className="text-4xl font-bold text-foreground">
                {plan.price}
              </span>
              <span className="text-muted">/{plan.period}</span>
            </div>
            {plan.name === "Pro" && (
              <p className="mt-1 text-xs text-muted">
                Less than $2.50 per month
              </p>
            )}
            <p className="mt-3 text-sm text-muted">{plan.description}</p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-center gap-2 text-sm"
                >
                  {feature.included ? (
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-border"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <span
                    className={
                      feature.included ? "text-muted" : "text-border"
                    }
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.ctaLink}
              className={`mt-8 block w-full rounded-full py-2.5 text-center text-sm font-medium transition-colors ${
                plan.highlight
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "border border-border text-foreground hover:bg-surface-hover"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Frequently asked about pricing
        </h2>
        <div className="mt-8 mx-auto max-w-2xl space-y-4 text-left">
          {[
            {
              q: "Can I upgrade from Free to Pro at any time?",
              a: "Yes. You can upgrade at any time and your existing topics and sources will carry over seamlessly.",
            },
            {
              q: "Is there a monthly payment option?",
              a: "We currently offer annual billing only. At less than $2.50 per month, we think it represents excellent value.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit and debit cards through our secure payment processor, Stripe.",
            },
            {
              q: "Can I cancel my Pro subscription?",
              a: "Yes, at any time. You will retain Pro features until the end of your billing period, then revert to the Free plan.",
            },
          ].map((item) => (
            <details key={item.q} className="glass-card group">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium text-foreground">
                {item.q}
                <svg
                  className="h-4 w-4 text-muted transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-sm text-muted">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
