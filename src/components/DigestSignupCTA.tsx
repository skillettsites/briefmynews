"use client";

import { useState } from "react";

// Email-first capture for the blog. Readers of "best unbiased news sources"
// posts are high intent; let them start with just an email, prefilled into
// signup so the account step is one field away.
export function DigestSignupCTA({ variant = "compact" }: { variant?: "compact" | "hero" }) {
  const [email, setEmail] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : "";
    window.location.href = `/signup${q}`;
  }

  if (variant === "hero") {
    return (
      <section className="mt-16 glass-card p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Get this delivered as a free, personalised digest
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Pick your topics and sources, choose a schedule, and we do the reading. Balanced by design,
          with a bias label on every story. Free to start, no spam, unsubscribe anytime.
        </p>
        <form onSubmit={go} className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover whitespace-nowrap">
            Get my free digest
          </button>
        </form>
      </section>
    );
  }

  return (
    <aside className="mt-8 rounded-2xl border border-border bg-surface/60 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">Want these sources without the doomscroll?</p>
        <p className="mt-0.5 text-sm text-muted">Get a free personalised digest, with a bias label on every story.</p>
      </div>
      <form onSubmit={go} className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-56"
        />
        <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover whitespace-nowrap">
          Get it free
        </button>
      </form>
    </aside>
  );
}
