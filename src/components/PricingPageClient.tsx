"use client";

import { useState } from "react";
import Link from "next/link";
import PricingToggle from "./PricingToggle";
import ProCheckoutButton from "./ProCheckoutButton";

const getPlans = (isYearly: boolean) => [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Perfect for staying informed on the topic you care about most.",
    features: [
      { text: "1 topic", included: true },
      { text: "1 news source", included: true },
      { text: "Weekly digest", included: true },
      { text: "AI-powered summaries", included: true },
      { text: "Source bias labels", included: true },
      { text: "Daily or monthly delivery", included: false },
      { text: "Up to 5 topics", included: false },
      { text: "Up to 10 sources from 90+ outlets", included: false },
      { text: "Priority email delivery", included: false },
      { text: "Early access to new features", included: false },
    ],
    cta: "Get Started Free",
    ctaLink: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: isYearly ? "£29.99" : "£4.99",
    period: isYearly ? "year" : "month",
    subtitle: isYearly
      ? "Just £2.50/month. Cancel anytime."
      : "Or save 50% with yearly billing at £29.99/year.",
    description:
      "Save 2+ hours per week. Full control over topics, sources, and delivery.",
    features: [
      { text: "Up to 5 topics, as specific as you need", included: true },
      { text: "Choose up to 10 sources from 90+ trusted outlets (Reuters, AP, BBC, and more)", included: true },
      { text: "Daily, weekly, or monthly delivery", included: true },
      { text: "AI-powered summaries with key quotes", included: true },
      { text: "Source bias labels on every article", included: true },
      { text: "Political lean customisation", included: true },
      { text: "Priority email delivery", included: true },
      { text: "Early access to new features", included: true },
      { text: "Custom digest formatting", included: true },
      { text: "Email support", included: true },
    ],
    cta: "Upgrade to Pro",
    ctaLink: "/signup",
    highlight: true,
    badge: isYearly ? "Save 50%" : "Most Popular",
  },
];

export default function PricingPageClient() {
  const [isYearly, setIsYearly] = useState(true);
  const plans = getPlans(isYearly);

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
        <div className="mt-6">
          <PricingToggle onToggle={setIsYearly} defaultYearly={true} />
        </div>
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
                {plan.badge}
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
              <p className="mt-1 text-xs text-muted">{plan.subtitle}</p>
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

            {plan.highlight ? (
              <ProCheckoutButton
                plan={isYearly ? "annual" : "monthly"}
                label={plan.cta}
                className="mt-8 block w-full rounded-full bg-primary py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
              />
            ) : (
              <Link
                href={plan.ctaLink}
                className="mt-8 block w-full rounded-full border border-border py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-surface p-6 sm:p-8">
        <p className="text-center text-sm font-medium uppercase tracking-wide text-muted">
          What our readers say
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            {
              quote:
                "I used to spend an hour on Twitter every morning just to feel anxious. Now I read my BriefMyNews digest in 5 minutes and I am actually better informed.",
              name: "Sarah T.",
              role: "Product Manager, London",
            },
            {
              quote:
                "The source bias labels are a game-changer. I finally feel like I understand the lens each outlet brings to a story.",
              name: "James K.",
              role: "Journalist, Manchester",
            },
            {
              quote:
                "Switched from Google News to BriefMyNews Pro three months ago. The topic specificity is unmatched, and I have reclaimed at least 2 hours every week.",
              name: "Priya M.",
              role: "Startup Founder, Bristol",
            },
          ].map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col justify-between rounded-lg border border-border p-5"
            >
              <p className="text-sm text-muted leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4">
                <p className="text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-xs text-muted">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
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
              a: "Yes. You can choose between monthly billing at £4.99/month or annual billing at £29.99/year, which saves you 50%.",
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
