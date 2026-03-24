"use client";

import { useState } from "react";
import PricingToggle from "./PricingToggle";

export default function HomePricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section className="border-t border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mt-3 text-muted">
            Start free. Upgrade when you need more.
          </p>
          <div className="mt-6">
            <PricingToggle onToggle={setIsYearly} defaultYearly={true} />
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Free */}
          <div className="glass-card p-8">
            <h3 className="text-lg font-semibold text-foreground">Free</h3>
            <div className="mt-2">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted">/forever</span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                "3 topics",
                "5 news sources",
                "Weekly digest",
                "AI summaries",
                "Source bias labels",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <svg
                    className="h-4 w-4 text-success flex-shrink-0"
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
                  {item}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-full border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover">
              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div className="glass-card relative overflow-hidden border-primary/30 p-8">
            <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">
              {isYearly ? "Save 50%" : "Most Flexible"}
            </div>
            <h3 className="text-lg font-semibold text-foreground">Pro</h3>
            <div className="mt-2">
              <span className="text-4xl font-bold text-foreground">
                {isYearly ? "$29.99" : "$5"}
              </span>
              <span className="text-muted">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {isYearly
                ? "Just $2.50/month. Cancel anytime."
                : "Or save 50% with yearly billing at $29.99/year."}
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Unlimited topics",
                "Unlimited sources",
                "Daily, weekly, or monthly delivery",
                "AI summaries with key quotes",
                "Political lean customisation",
                "Priority email delivery",
                "Early access to new features",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <svg
                    className="h-4 w-4 text-success flex-shrink-0"
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
                  {item}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-full bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
              Join Waitlist for Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
