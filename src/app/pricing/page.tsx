import type { Metadata } from "next";
import PricingPageClient from "@/components/PricingPageClient";

export const metadata: Metadata = {
  title: "BriefMyNews Pricing: Free Plan and Pro from $5/month (2026)",
  description:
    "Start free with 3 topics and 5 sources. Go Pro for $5/month or $29.99/year to unlock unlimited topics, 63+ sources, and daily delivery. No credit card needed to start.",
  openGraph: {
    title: "BriefMyNews Pricing: Free Plan and Pro from $5/month",
    description:
      "Start free with 3 topics. Pro unlocks unlimited topics, 63+ sources, and daily delivery from $5/month.",
    url: "https://briefmynews.com/pricing",
  },
  alternates: { canonical: "https://briefmynews.com/pricing" },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
