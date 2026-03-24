"use client";

import { useState } from "react";

export default function PricingToggle({
  onToggle,
  defaultYearly = true,
}: {
  onToggle?: (isYearly: boolean) => void;
  defaultYearly?: boolean;
}) {
  const [isYearly, setIsYearly] = useState(defaultYearly);

  const handleToggle = (yearly: boolean) => {
    setIsYearly(yearly);
    onToggle?.(yearly);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="inline-flex items-center rounded-full border border-border bg-surface p-1">
        <button
          onClick={() => handleToggle(false)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            !isYearly
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => handleToggle(true)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            isYearly
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Yearly
        </button>
      </div>
      {isYearly && (
        <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
          Save 50%
        </span>
      )}
    </div>
  );
}
