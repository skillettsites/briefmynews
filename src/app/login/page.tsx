"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      window.location.href = "/dashboard";
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      setMessage("Check your email for the login link.");
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-foreground text-center">
          Log in to BriefMyNews
        </h1>

        {/* Mode toggle */}
        <div className="mt-6 flex rounded-lg border border-border overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "password"
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-foreground"
            }`}
            onClick={() => setMode("password")}
          >
            Password
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "magic"
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-foreground"
            }`}
            onClick={() => setMode("magic")}
          >
            Magic Link
          </button>
        </div>

        <form
          onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
          className="mt-6 space-y-4"
        >
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

          {mode === "password" && (
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
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Your password"
              />
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-danger">{message}</p>
          )}
          {status === "success" && message && (
            <p className="text-sm text-success">{message}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {status === "loading"
              ? "Please wait..."
              : mode === "password"
              ? "Log In"
              : "Send Magic Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Do not have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary-hover font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
