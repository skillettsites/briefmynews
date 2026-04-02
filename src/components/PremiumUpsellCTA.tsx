import Link from "next/link";

interface PremiumUpsellCTAProps {
  variant: "inline" | "banner";
}

export default function PremiumUpsellCTA({ variant }: PremiumUpsellCTAProps) {
  if (variant === "inline") {
    return (
      <div className="my-8 rounded-xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-800 dark:bg-indigo-950/30">
        <h3 className="text-lg font-semibold text-foreground">
          Save 2+ hours per week with BriefMyNews Pro
        </h3>
        <p className="mt-1 text-sm text-muted">
          Join thousands of readers who replaced doomscrolling with a 5-minute daily briefing.
        </p>
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
            Briefings from 50+ trusted sources, including Reuters, AP, and BBC
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Source bias labels so you always know the editorial perspective
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Daily delivery and weekly deep-dive reports on your chosen subjects
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/pricing"
            className="inline-flex rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Start Your Free Trial
          </Link>
          <span className="text-xs text-muted">
            From $2.50/mo with annual billing (save 50%)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-10 text-center text-white sm:px-12 sm:py-14">
      <h3 className="text-2xl font-bold sm:text-3xl">
        Get smarter briefings from 50+ trusted sources
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-indigo-100">
        Pro readers save over 2 hours per week with personalised daily digests, unlimited topics, full source control, and weekly deep-dive reports. Everything you need to stay ahead, nothing you don&apos;t.
      </p>
      <div className="mt-6 flex flex-col items-center gap-2">
        <Link
          href="/pricing"
          className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          Try Pro Free for 7 Days
        </Link>
        <span className="text-xs text-indigo-200">
          Just $2.50/mo with annual billing. Cancel anytime.
        </span>
      </div>
    </div>
  );
}
