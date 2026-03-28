import Link from "next/link";

interface PremiumUpsellCTAProps {
  variant: "inline" | "banner";
}

export default function PremiumUpsellCTA({ variant }: PremiumUpsellCTAProps) {
  if (variant === "inline") {
    return (
      <div className="my-8 rounded-xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-800 dark:bg-indigo-950/30">
        <h3 className="text-lg font-semibold text-foreground">
          Get deeper briefings with BriefMyNews Pro
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited topics, tailored to your exact interests
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Priority delivery so you never miss breaking stories
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Advanced source filtering with bias indicators
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Weekly deep-dive reports on your chosen subjects
          </li>
        </ul>
        <Link
          href="/pricing"
          className="mt-4 inline-flex rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Explore Pro Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="my-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-10 text-center text-white sm:px-12 sm:py-14">
      <h3 className="text-2xl font-bold sm:text-3xl">
        Upgrade to Pro for just &pound;4.99/month
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-indigo-100">
        Unlimited topics, daily delivery, source filtering, and weekly deep-dive reports; everything you need to stay ahead of the news.
      </p>
      <Link
        href="/pricing"
        className="mt-6 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
      >
        Start Your Free Trial
      </Link>
    </div>
  );
}
