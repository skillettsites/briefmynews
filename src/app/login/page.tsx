"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [mode, setMode] = useState<"password" | "code">("password");
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

  // Email-code sign-in. We deliver the code via our own Resend email (see
  // /api/auth/send-code) and verify it here — we do NOT use Supabase's magic
  // LINK, whose redirect routes through the shared project's Site URL (a
  // different domain) and lands users on the wrong site.
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setCodeSent(true);
        setStatus("idle");
        setMessage("");
      } else {
        setStatus("error");
        setMessage(data.error || "Could not send a code. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: "email",
    });
    if (error) {
      setStatus("error");
      setMessage("That code was not right or has expired. Try again.");
    } else {
      setStatus("success");
      window.location.href = "/dashboard";
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
            onClick={() => { setMode("password"); setMessage(""); setStatus("idle"); }}
          >
            Password
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "code"
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-foreground"
            }`}
            onClick={() => { setMode("code"); setMessage(""); setStatus("idle"); }}
          >
            Email code
          </button>
        </div>

        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
            <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field id="password" label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" />
            <Feedback status={status} message={message} />
            <Submit loading={status === "loading"} label="Log In" />
          </form>
        )}

        {mode === "code" && !codeSent && (
          <form onSubmit={handleSendCode} className="mt-6 space-y-4">
            <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Feedback status={status} message={message} />
            <Submit loading={status === "loading"} label="Email me a code" />
            <p className="text-xs text-muted text-center">We'll email you a 6-digit sign-in code. No password needed.</p>
          </form>
        )}

        {mode === "code" && codeSent && (
          <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
            <p className="text-sm text-muted text-center">Enter the code we emailed to {email}.</p>
            <Field id="code" label="Sign-in code" type="text" value={code} onChange={(v) => setCode(v.replace(/\D/g, "").slice(0, 8))} placeholder="123456" />
            <Feedback status={status} message={message} />
            <Submit loading={status === "loading"} label="Sign in" />
            <button type="button" onClick={() => { setCodeSent(false); setCode(""); setMessage(""); }} className="w-full text-xs text-muted hover:text-foreground">
              Use a different email
            </button>
          </form>
        )}

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

function Field({ id, label, type, value, onChange, placeholder }: { id: string; label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        inputMode={id === "code" ? "numeric" : undefined}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder={placeholder}
      />
    </div>
  );
}

function Feedback({ status, message }: { status: string; message: string }) {
  if (status === "error" && message) return <p className="text-sm text-danger">{message}</p>;
  if (status === "success" && message) return <p className="text-sm text-success">{message}</p>;
  return null;
}

function Submit({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {loading ? "Please wait..." : label}
    </button>
  );
}
