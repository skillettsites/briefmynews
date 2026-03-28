import type { Metadata } from "next";
import Link from "next/link";
import PremiumUpsellCTA from "@/components/PremiumUpsellCTA";

export const metadata: Metadata = {
  title: "Best News Apps UK 2026: 10 Apps Compared for Personalised News",
  description:
    "Compare the 10 best news apps available in the UK for 2026. We rank Google News, Apple News, Flipboard, BriefMyNews, and more on personalisation, source quality, and pricing.",
  keywords: [
    "best news apps UK 2026",
    "best news aggregator apps",
    "personalised news app UK",
    "news app comparison UK",
    "best free news app UK",
  ],
  openGraph: {
    title: "Best News Apps UK 2026: 10 Apps Compared",
    description:
      "We tested and ranked the 10 best news apps in the UK for personalisation, source quality, and value.",
    url: "https://briefmynews.com/guides/best-news-apps-uk-2026",
  },
  alternates: {
    canonical: "https://briefmynews.com/guides/best-news-apps-uk-2026",
  },
};

interface NewsApp {
  name: string;
  featured?: boolean;
  description: string;
  bestFor: string;
  pricing: string;
  pros: string[];
  cons: string[];
}

const apps: NewsApp[] = [
  {
    name: "BriefMyNews",
    featured: true,
    description:
      "BriefMyNews delivers personalised news digests straight to your inbox. You pick your topics, choose from 63+ sources with clear bias labels, and set your own delivery schedule. Instead of doomscrolling through endless feeds, you get a concise briefing that covers exactly what matters to you.",
    bestFor: "Busy professionals who want curated, bias-aware briefings without opening another app",
    pricing: "Free (3 topics, weekly digest) / Pro at \u00a34.99/month (unlimited topics, daily delivery)",
    pros: [
      "Bias labels on every source so you always know the editorial perspective",
      "Email delivery means zero extra apps or notifications",
      "Granular topic control, not just broad categories",
    ],
    cons: [
      "No standalone mobile app yet (email-first by design)",
      "Free tier limited to 3 topics and weekly delivery",
    ],
  },
  {
    name: "Google News",
    description:
      "Google News uses your search history, location, and stated interests to assemble a personalised feed. It aggregates stories from thousands of publishers worldwide and groups related articles into clusters so you can see multiple angles on the same event.",
    bestFor: "Users who want broad, algorithm-driven coverage across many topics",
    pricing: "Free",
    pros: [
      "Massive source pool covering virtually every publisher online",
      "Full Coverage feature shows multiple perspectives on a story",
      "Deep integration with the Google ecosystem",
    ],
    cons: [
      "Algorithm can create filter bubbles without transparency",
      "Limited control over how stories are ranked or weighted",
    ],
  },
  {
    name: "Apple News / Apple News+",
    description:
      "Apple News comes pre-installed on every iPhone and iPad, combining editorially curated top stories with a personalised feed. Apple News+ adds full access to hundreds of magazines and selected newspapers behind a single subscription.",
    bestFor: "Apple device owners who want a polished reading experience with magazine access",
    pricing: "Free (Apple News) / \u00a312.99/month (Apple News+)",
    pros: [
      "Clean, ad-light interface with strong editorial curation",
      "Apple News+ bundles hundreds of magazines and premium outlets",
      "Privacy-focused; personalisation happens on-device",
    ],
    cons: [
      "Only available on Apple devices, no Android or web version",
      "Apple News+ is expensive compared to individual subscriptions for most users",
    ],
  },
  {
    name: "Flipboard",
    description:
      "Flipboard presents news in a visually rich, magazine-style layout. You follow topics, sources, and community-curated \"magazines\" to build a personalised reading experience. Its Storyboard feature lets editors and users assemble narrative collections around major events.",
    bestFor: "Visual readers who enjoy a magazine-style browsing experience",
    pricing: "Free",
    pros: [
      "Beautiful card-based design that makes browsing enjoyable",
      "Community curation adds a human layer to algorithmic feeds",
    ],
    cons: [
      "Ad-supported, and ads can disrupt the reading flow",
      "Personalisation is less granular than topic-specific services",
    ],
  },
  {
    name: "Feedly",
    description:
      "Feedly is an RSS-based news reader built for power users and research professionals. You subscribe to individual feeds from any website, then organise them into folders and boards. Its Leo feature uses machine learning to prioritise, tag, and summarise articles automatically.",
    bestFor: "Power users and researchers who want full control over their sources via RSS",
    pricing: "Free (100 sources) / Pro at $6/month / Pro+ at $12/month",
    pros: [
      "Granular source control; subscribe to any website with an RSS feed",
      "Leo can auto-tag, prioritise, and summarise articles",
      "Excellent integrations with Slack, Notion, and other productivity tools",
    ],
    cons: [
      "Steep learning curve for users unfamiliar with RSS",
      "Best features locked behind higher-priced tiers",
    ],
  },
  {
    name: "Inoreader",
    description:
      "Inoreader is another powerful RSS reader that competes directly with Feedly. It supports RSS feeds, newsletters, Twitter feeds, podcasts, and even web page monitoring. Rules and filters let you automate how content is sorted and surfaced.",
    bestFor: "Advanced users who want RSS plus automation and multi-format support",
    pricing: "Free (150 feeds) / Pro at $2.99/month / Supporter at $4.99/month",
    pros: [
      "Supports RSS, newsletters, social feeds, and podcasts in one place",
      "Powerful rules engine for filtering and automating feeds",
      "More affordable than Feedly at comparable feature levels",
    ],
    cons: [
      "Interface feels dated compared to more modern alternatives",
      "Free tier includes ads and limited search history",
    ],
  },
  {
    name: "SmartNews",
    description:
      "SmartNews analyses millions of articles to surface trending stories across categories like politics, tech, entertainment, and sports. It caches articles locally so you can read them even without an internet connection, making it ideal for commuters.",
    bestFor: "Commuters who want quick, offline-friendly trending news",
    pricing: "Free (ad-supported)",
    pros: [
      "Offline reading; articles are cached automatically",
      "Clean, fast interface with minimal load times",
    ],
    cons: [
      "Ad-heavy, which can detract from the reading experience",
      "Limited personalisation compared to topic-specific services",
    ],
  },
  {
    name: "Ground News",
    description:
      "Ground News focuses on media transparency. Every story shows a bias distribution chart so you can see whether it is being covered more by left-leaning, centre, or right-leaning outlets. Its Blindspot feature highlights stories that only one side of the political spectrum is covering.",
    bestFor: "Media-literate readers who want to see bias and coverage gaps",
    pricing: "Free (limited) / Premium at $4.99/month / Visioneer at $9.99/month",
    pros: [
      "Unique bias distribution and Blindspot features",
      "Excellent for understanding how different outlets frame the same story",
      "Ownership data reveals who controls each news source",
    ],
    cons: [
      "Smaller source pool for UK-specific stories compared to global coverage",
      "Premium pricing can add up if you want all features",
    ],
  },
  {
    name: "The Guardian App",
    description:
      "The Guardian's app provides free access to all Guardian and Observer journalism with a clean, well-organised interface. You can customise your edition, follow specific topics, and receive breaking news notifications. Supporter subscriptions remove ads and unlock crosswords.",
    bestFor: "Readers who trust The Guardian and want a single-source, high-quality experience",
    pricing: "Free (ad-supported) / Supporter tiers from \u00a35/month",
    pros: [
      "High-quality journalism with global and UK depth",
      "Completely free to read; no paywall on articles",
      "Strong investigative reporting and opinion sections",
    ],
    cons: [
      "Single-source; you only get The Guardian's perspective",
      "Ads in the free tier can be intrusive on mobile",
    ],
  },
  {
    name: "BBC News App",
    description:
      "The BBC News app is the most widely used news app in the UK. It offers comprehensive coverage across domestic and international stories, with a customisable \"My News\" section where you choose topic tabs. Push notifications keep you informed of breaking stories.",
    bestFor: "UK readers who want reliable, impartial domestic and international coverage",
    pricing: "Free (licence-fee funded, no ads for UK users)",
    pros: [
      "No ads for UK users; funded by the licence fee",
      "Trusted, impartial reporting with strong UK focus",
      "Excellent live coverage of breaking events",
    ],
    cons: [
      "Personalisation is limited to choosing topic tabs",
      "Can feel conservative in scope; less niche or specialist content",
    ],
  },
];

const faqItems = [
  {
    question: "What is the best free news app in the UK?",
    answer:
      "For most UK readers, the BBC News app is the best free option thanks to its ad-free experience and impartial reporting. If you want personalised digests from multiple sources at no cost, BriefMyNews offers a free tier with 3 topics and weekly email delivery.",
  },
  {
    question: "Are personalised news apps biased?",
    answer:
      "All algorithmic personalisation carries some risk of creating filter bubbles, where you only see perspectives you already agree with. Services like BriefMyNews and Ground News address this directly by labelling source bias, helping you build a more balanced information diet.",
  },
  {
    question: "What is a news aggregator app?",
    answer:
      "A news aggregator collects articles from multiple publishers and presents them in a single feed. Instead of visiting ten different websites, you get stories from all of them in one app. Examples include Google News, Flipboard, and BriefMyNews.",
  },
  {
    question: "Is Apple News available on Android?",
    answer:
      "No. Apple News and Apple News+ are exclusive to Apple devices (iPhone, iPad, and Mac). Android users looking for a similar curated experience should consider Google News, Flipboard, or BriefMyNews as alternatives.",
  },
  {
    question: "How do I avoid news fatigue from too many apps?",
    answer:
      "The key is consolidation. Choose one or two apps that cover your needs rather than installing many. Email-based services like BriefMyNews help by delivering a single digest on your schedule, so you read the news once and move on with your day.",
  },
  {
    question: "Which news app has the best UK coverage?",
    answer:
      "The BBC News app leads for broad UK coverage thanks to its extensive domestic reporting. For personalised UK news across multiple sources, BriefMyNews lets you select from 63+ outlets, including major UK publishers, and labels each one with a bias indicator.",
  },
];

export default function BestNewsAppsUK2026() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://briefmynews.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: "https://briefmynews.com/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Best News Apps UK 2026",
        item: "https://briefmynews.com/guides/best-news-apps-uk-2026",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/guides" className="hover:text-primary transition-colors">
                Guides
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">Best News Apps UK 2026</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Best News Apps UK 2026: 10 Apps Compared for Personalised News
          </h1>
          <p className="mt-4 text-lg text-muted">
            Updated March 2026. We tested the most popular news apps and aggregators available in
            the UK, comparing them on personalisation, source quality, pricing, and overall
            experience.
          </p>
        </div>

        {/* Introduction */}
        <div className="mt-12 space-y-4 text-muted">
          <p>
            Keeping up with the news in 2026 is harder than ever. Between 24-hour rolling coverage,
            social media hot takes, and push notifications from a dozen apps, information overload
            is a real problem. The average UK adult now spends over 80 minutes a day consuming news,
            yet most people still feel poorly informed about the topics that actually matter to them.
          </p>
          <p>
            The solution is not to read more; it is to read smarter. A good news app should filter
            the noise, surface stories that match your interests, and help you understand different
            perspectives without demanding hours of your time.
          </p>
          <p>
            We tested 10 of the most popular news apps and aggregators available in the UK, rating
            each on personalisation depth, source quality, UK-specific coverage, advertising
            experience, and value for money. Whether you are a busy professional, a committed news
            junkie, or someone who just wants a five-minute daily briefing, there is an option here
            for you.
          </p>
        </div>

        {/* App Reviews */}
        <div className="mt-16 space-y-10">
          <h2 className="text-2xl font-bold text-foreground">
            The 10 Best News Apps in the UK for 2026
          </h2>

          {apps.map((app, index) => (
            <div
              key={app.name}
              className={`glass-card p-8 ${
                app.featured
                  ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {app.name}
                  {app.featured && (
                    <span className="ml-3 inline-block rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      Featured Pick
                    </span>
                  )}
                </h3>
              </div>

              <p className="text-muted">{app.description}</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Best for</h4>
                  <p className="mt-1 text-sm text-muted">{app.bestFor}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Pricing</h4>
                  <p className="mt-1 text-sm text-muted">{app.pricing}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Pros
                  </h4>
                  <ul className="mt-1 space-y-1">
                    {app.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-1 text-green-600">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Cons
                  </h4>
                  <ul className="mt-1 space-y-1">
                    {app.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-1 text-red-500">&minus;</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {app.featured && <PremiumUpsellCTA variant="inline" />}
            </div>
          ))}
        </div>

        {/* How We Ranked */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">How We Ranked These Apps</h2>
          <p className="mt-4 text-muted">
            Every app was evaluated against five criteria. Here is what we looked at and why each
            factor matters.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Personalisation depth",
                desc: "How granular can you get? We favoured apps that let you define specific topics rather than just broad categories.",
              },
              {
                title: "Source quality and transparency",
                desc: "Does the app tell you where stories come from? Extra credit for bias labels, ownership data, or editorial standards.",
              },
              {
                title: "UK focus",
                desc: "Many global apps skew heavily toward US news. We prioritised services with strong UK publisher support and domestic coverage.",
              },
              {
                title: "Ad experience",
                desc: "Free is great, but not if ads dominate the experience. We assessed how intrusive advertising was across free tiers.",
              },
              {
                title: "Pricing and value",
                desc: "For paid tiers, we weighed the features you get against the monthly cost. A free app with solid basics can beat a premium app with marginal extras.",
              },
            ].map((criterion) => (
              <div key={criterion.title} className="glass-card p-6">
                <h3 className="font-semibold text-foreground">{criterion.title}</h3>
                <p className="mt-2 text-sm text-muted">{criterion.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Which App Is Right for You */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">
            Which News App Is Right for You?
          </h2>
          <p className="mt-4 text-muted">
            The best news app depends on how you consume information. Here are our top
            recommendations by reader type.
          </p>
          <div className="mt-8 space-y-6">
            {[
              {
                type: "Busy professional",
                recommendation:
                  "BriefMyNews. You get a concise, personalised digest delivered by email on your schedule. No app to open, no feed to scroll. Read it in five minutes over your morning coffee and you are caught up.",
              },
              {
                type: "News junkie",
                recommendation:
                  "Feedly or Inoreader. If you want to follow dozens of sources, organise them into folders, and dive deep into niche topics, an RSS-based reader gives you maximum control.",
              },
              {
                type: "Budget-conscious reader",
                recommendation:
                  "BBC News app or Google News. Both are completely free with no paywalled features. The BBC app is ad-free for UK users, making it the cleanest free experience available.",
              },
              {
                type: "UK-focused reader",
                recommendation:
                  "BriefMyNews or The Guardian app. BriefMyNews offers 63+ sources including major UK publishers with bias labels. The Guardian app gives you deep, free access to one of Britain's most comprehensive newsrooms.",
              },
            ].map((rec) => (
              <div key={rec.type} className="glass-card p-6">
                <h3 className="font-semibold text-foreground">{rec.type}</h3>
                <p className="mt-2 text-sm text-muted">{rec.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Banner CTA */}
        <PremiumUpsellCTA variant="banner" />

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            {faqItems.map((item) => (
              <div key={item.question} className="glass-card p-6">
                <h3 className="font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Links */}
        <div className="mt-16 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-foreground">Learn more about BriefMyNews</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { href: "/how-it-works", label: "How It Works" },
              { href: "/pricing", label: "Pricing" },
              { href: "/sources", label: "Our Sources" },
              { href: "/blog", label: "Blog" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
