import WaitlistForm from "@/components/WaitlistForm";
import HomePricingSection from "@/components/HomePricingSection";

const features = [
  {
    title: "Granular Topic Selection",
    description:
      "Go beyond broad categories. Track specific subjects like \"AI regulation in the EU\" or \"Premier League transfers\", not just \"tech\" or \"sports\".",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    title: "Source Control",
    description:
      "Pick exactly which outlets you trust. Tick BBC, untick Daily Mail, add TechCrunch. Your digest, your rules.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    title: "Political Lean Slider",
    description:
      "See the spectrum. Every source is labelled from left to right so you know where your information is coming from.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    title: "Flexible Scheduling",
    description:
      "Set a different frequency for each topic. Breaking news daily, industry trends weekly, deep dives monthly.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Summaries",
    description:
      "Each article is condensed into a clear, concise summary. Click through to the original source whenever you want the full story.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Zero Spam Promise",
    description:
      "No promotional emails. No partner offers. No data selling. Just the news you asked for, when you asked for it.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "How does BriefMyNews work?",
    answer:
      "You choose the topics you care about, select which news sources you trust, and set how often you want updates. Our system fetches, filters, and summarises the most relevant articles, then delivers a clean digest straight to your inbox.",
  },
  {
    question: "Is BriefMyNews free to use?",
    answer:
      "Yes. The free plan gives you 3 topics, 5 news sources, and a weekly digest. For unlimited topics, sources, and daily delivery, the Pro plan is just \u00a329.99 per year.",
  },
  {
    question: "Which news sources are available?",
    answer:
      "We support 35+ sources including BBC News, The Guardian, The Telegraph, CNN, New York Times, TechCrunch, Ars Technica, Reuters, and many more. Each source is clearly labelled with its editorial lean.",
  },
  {
    question: "Can I control the political bias of my digest?",
    answer:
      "Absolutely. Every source displays a bias indicator, and you can set your preferred political lean from left to right. This helps you build a balanced or focused reading list, depending on your preference.",
  },
  {
    question: "How often will I receive emails?",
    answer:
      "That is entirely up to you. Set each topic to daily, weekly, or monthly delivery. You can have breaking news daily while receiving industry analysis weekly.",
  },
  {
    question: "Will you sell my data or send me spam?",
    answer:
      "Never. We have a strict zero-spam policy. You only receive the digests you configure. We do not sell your email address or personal data to anyone.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "BriefMyNews",
        url: "https://briefmynews.com",
        description: "Personalised news digests delivered to your inbox.",
      },
      {
        "@type": "Organization",
        name: "BriefMyNews",
        url: "https://briefmynews.com",
        logo: "https://briefmynews.com/logo.png",
        sameAs: [
          "https://postcodecheck.co.uk",
          "https://carcostcheck.co.uk",
          "https://findyourstay.com",
          "https://askyourstay.com",
          "https://aicareerswap.com",
          "https://guardmybusiness.com",
          "https://helpafterloss.co.uk",
          "https://helpafterlife.com",
          "https://bestlondontours.co.uk",
          "https://the-best-tours.com",
          "https://daveknowsai.com",
          "https://davidskillett.com",
          "https://aibetfinder.com",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Launching soon
            </div>
          </div>
          <h1 className="animate-fade-in-up stagger-1 mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your news. Your sources.{" "}
            <span className="gradient-text">Your schedule.</span>{" "}
            Nothing&nbsp;else.
          </h1>
          <p className="animate-fade-in-up stagger-2 mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            A personalised news digest that delivers only what matters to you.
            Pick your topics, choose your sources, set your frequency.
          </p>
          <div className="animate-fade-in-up stagger-3 mt-10 flex justify-center">
            <WaitlistForm />
          </div>
          <p className="animate-fade-in-up stagger-4 mt-4 text-xs text-muted">
            Join 0 others already on the waitlist. No spam, ever.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Drowning in noise?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Most newsletters send the same stories to everyone. They decide what
            matters. BriefMyNews flips the model: you choose the topics, the
            sources, and the schedule. We just deliver.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { stat: "300+", label: "articles published daily by major outlets" },
              { stat: "12 min", label: "average time wasted scrolling for news" },
              { stat: "73%", label: "of readers want more control over their feed" },
            ].map((item) => (
              <div key={item.label} className="glass-card p-6">
                <div className="text-3xl font-bold gradient-text">{item.stat}</div>
                <p className="mt-2 text-sm text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Three steps to a cleaner inbox
            </h2>
            <p className="mt-3 text-muted">
              Set up once. Receive relevant news forever.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pick your topics",
                desc: "Add specific interests like \"renewable energy policy\" or \"Arsenal transfer news\". Go as broad or as narrow as you like.",
              },
              {
                step: "2",
                title: "Choose your sources",
                desc: "Select from 35+ outlets, each labelled with its political lean. Build the mix that works for you.",
              },
              {
                step: "3",
                title: "Set your schedule",
                desc: "Daily briefing? Weekly roundup? Monthly deep dive? Set a different frequency for each topic.",
              },
            ].map((item) => (
              <div key={item.step} className="glass-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Built for people who value their time
            </h2>
            <p className="mt-3 text-muted">
              Every feature exists to save you time and keep you informed.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 transition-all hover:scale-[1.02]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <HomePricingSection />

      {/* FAQ */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="glass-card group overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium text-foreground">
                  {faq.question}
                  <svg
                    className="h-4 w-4 text-muted transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-sm text-muted">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Ready to take back your mornings?
          </h2>
          <p className="mt-4 text-muted">
            Join the waitlist and be the first to get your personalised news
            digest.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistForm source="homepage-footer" />
          </div>
        </div>
      </section>
    </>
  );
}
