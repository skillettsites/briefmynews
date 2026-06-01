"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Status = "verifying" | "success" | "error";

function ConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = (searchParams.get("type") || "signup") as
      | "signup"
      | "email"
      | "recovery"
      | "invite"
      | "email_change";

    if (!token_hash) {
      setStatus("error");
      setMessage("Missing confirmation token. Please try signing up again.");
      return;
    }

    let cancelled = false;
    (async () => {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type });
      if (cancelled) return;
      if (error) {
        setStatus("error");
        setMessage(
          error.message ||
            "This confirmation link is invalid or has expired. Please sign up again."
        );
        return;
      }
      setStatus("success");
      setMessage("Email confirmed. Taking you to your dashboard…");
      setTimeout(() => router.replace("/dashboard"), 800);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {status === "verifying" && "Confirming…"}
          {status === "success" && "You're in"}
          {status === "error" && "Something went wrong"}
        </h1>
        <p className="mt-4 text-sm text-muted">{message}</p>
        {status === "error" && (
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Sign up again
            </Link>
            <Link
              href="/login"
              className="text-sm text-primary hover:text-primary-hover"
            >
              Or log in instead
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
          <p className="text-sm text-muted">Loading…</p>
        </div>
      }
    >
      <ConfirmInner />
    </Suspense>
  );
}
