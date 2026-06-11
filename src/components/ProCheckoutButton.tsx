"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Smart Pro CTA. If the visitor is signed in we start a Stripe Checkout
// session straight away. If they are signed out we send them to /signup so
// they create an account first, then upgrade from the dashboard.
export default function ProCheckoutButton({
  plan,
  className,
  label = "Upgrade to Pro",
}: {
  plan: "annual" | "monthly";
  className?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        window.location.href = "/signup?upgrade=" + plan;
        return;
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        alert(json.error || "Could not start checkout. Please try again shortly.");
        setLoading(false);
      }
    } catch {
      alert("Could not start checkout. Please try again shortly.");
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Starting checkout..." : label}
    </button>
  );
}
