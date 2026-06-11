import type { Metadata } from "next";
import PricingPageClient from "@/components/PricingPageClient";

export const metadata: Metadata = {
  title: "BriefMyNews Pricing: Free Plan and Pro from £4.99/month (2026)",
  description:
    "Start free with 1 topic and a weekly digest. Go Pro for £4.99/month or £29.99/year to unlock up to 5 topics, 10 sources from 90+ outlets, and daily delivery. No credit card needed to start.",
  openGraph: {
    title: "BriefMyNews Pricing: Free Plan and Pro from £4.99/month",
    description:
      "Start free with 1 topic. Pro unlocks up to 5 topics, 10 sources from 90+ outlets, and daily delivery from £4.99/month.",
    url: "https://briefmynews.com/pricing",
  },
  alternates: { canonical: "https://briefmynews.com/pricing" },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
