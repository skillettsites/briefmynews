import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how BriefMyNews creates your personalised news digest in three simple steps. Pick topics, choose sources, set your schedule.",
  openGraph: {
    title: "How BriefMyNews Works",
    description:
      "Three steps to a personalised news digest. Pick topics, choose sources, set your schedule.",
    url: "https://briefmynews.com/how-it-works",
  },
  alternates: { canonical: "https://briefmynews.com/how-it-works" },
};

const steps = [
  {
    number: "01",
    title: "Pick your topics",
    description:
      "Tell us exactly what you want to read about. Not just broad categories like \"technology\" or \"politics\", but specific interests that matter to you.",
    examples: [
      "AI regulation in the EU",
      "UK housing market trends",
      "Premier League transfers",
      "Renewable energy policy",
      "Cryptocurrency regulation",
      "NHS funding updates",
    ],
    detail:
      "Free users can track up to 3 topics. Pro users have no limits. Add, remove, or adjust topics at any time from your dashboard.",
  },
  {
    number: "02",
    title: "Choose your sources",
    description:
      "Select which news outlets you trust from our curated list of 35+ sources. Each one displays a clear bias indicator so you always know the editorial perspective.",
    examples: [
      "BBC News (Centre)",
      "The Guardian (Centre-Left)",
      "The Telegraph (Centre-Right)",
      "Reuters (Centre)",
      "TechCrunch (Centre)",
      "Financial Times (Centre)",
    ],
    detail:
      "Toggle sources on and off with a single click. Mix outlets from different perspectives to build a balanced view, or focus on the sources you trust most.",
  },
  {
    number: "03",
    title: "Set your schedule",
    description:
      "Decide how often you want updates on each topic. Different subjects deserve different frequencies. Breaking news daily, industry analysis weekly, deep dives monthly.",
    examples: [
      "UK Politics: Daily at 7am",
      "AI Research: Weekly on Mondays",
      "Climate Science: Monthly roundup",
      "Football News: Daily during transfer window",
    ],
    detail:
      "Free users receive weekly digests. Pro users can set any combination of daily, weekly, or monthly delivery for each individual topic.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          How BriefMyNews works
        </h1>
        <p className="mt-4 text-lg text-muted">
          Three simple steps to a news experience that actually respects your
          time.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {steps.map((step) => (
          <div key={step.number} className="glass-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {step.number}
              </span>
              <h2 className="text-2xl font-bold text-foreground">
                {step.title}
              </h2>
            </div>
            <p className="text-muted">{step.description}</p>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Examples:
              </h3>
              <div className="flex flex-wrap gap-2">
                {step.examples.map((example) => (
                  <span
                    key={example}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 text-sm text-muted border-t border-border pt-4">
              {step.detail}
            </p>
          </div>
        ))}
      </div>

      {/* What happens next */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Then what happens?
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              ),
              title: "We fetch the latest",
              desc: "Our system checks your selected sources for new articles matching your topics.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: "AI summarises",
              desc: "Each article is condensed into a clear summary with a link to the full story.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: "Delivered to you",
              desc: "A clean, formatted digest lands in your inbox on your chosen schedule.",
            },
          ].map((item) => (
            <div key={item.title} className="glass-card p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {item.icon}
              </div>
              <h3 className="mt-3 font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/signup"
          className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
}
