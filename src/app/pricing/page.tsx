import type { Metadata } from "next";
import PricingPageClient from "@/components/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "BriefMyNews pricing plans. Start free with 3 topics and 5 sources, or go Pro for unlimited everything at just $29.99/year or $5/month.",
  openGraph: {
    title: "BriefMyNews Pricing",
    description:
      "Start free or go Pro for unlimited topics, sources, and daily delivery.",
    url: "https://briefmynews.com/pricing",
  },
  alternates: { canonical: "https://briefmynews.com/pricing" },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
