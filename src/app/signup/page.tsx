"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const POPULAR_TOPICS = [
  "UK Politics",
  "US Politics",
  "Artificial Intelligence",
  "Technology",
  "Business & Economy",
  "Climate",
  "Premier League",
  "Science",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Prefill email when arriving from a blog capture CTA (/signup?email=...).
  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("email");
    if (e) setEmail(e);
  }, []);

  const chosenTopic = (customTopic.trim() || topic).trim();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName, topic: chosenTopic }),
      });
      const data = await res.json();

      if (res.ok) {
        // Carry the chosen topic to the dashboard (same-device fallback; the
        // confirmation link also carries it as a query param for other devices).
        if (chosenTopic) {
          try { localStorage.setItem("bmn_pending_topic", chosenTopic); } catch { /* ignore */ }
        }
        setStatus("success");
        setMessage(
          `Almost done. We've sent a confirmation link to ${email}. Click it to activate your account${chosenTopic ? ` and start getting ${chosenTopic} news` : ""}.`
        );
        setPassword("");
      } else {
        setStatus("error");
        setMessage(data.error || "Could not create your account. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-foreground text-center">
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Start receiving personalised news digests
        </p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          {/* First topic — captured up front so the first digest is never empty */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              What do you want news about?
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOPICS.map((t) => {
                const active = topic === t && !customTopic.trim();
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTopic(active ? "" : t); setCustomTopic(""); }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-foreground hover:border-primary"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => { setCustomTopic(e.target.value); if (e.target.value.trim()) setTopic(""); }}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Or type your own, e.g. UK housing market"
            />
            <p className="mt-1 text-xs text-muted">You can change or add more later.</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Your name (optional)"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-danger">{message}</p>
          )}
          {status === "success" && (
            <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {status === "loading" ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
