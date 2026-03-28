import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BriefMyNews: Who We Are and Why We Built It",
  description:
    "BriefMyNews is a UK-based personalised news digest service. Choose your topics, pick trusted sources with bias labels, and get a clean email on your schedule. No spam, no noise.",
  openGraph: {
    title: "About BriefMyNews: Who We Are and Why We Built It",
    description:
      "UK-based personalised news digest. Choose topics, pick sources with bias labels, set your schedule.",
    url: "https://briefmynews.com/about",
  },
  alternates: { canonical: "https://briefmynews.com/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        About BriefMyNews
      </h1>

      <div className="mt-8 space-y-6 text-muted">
        <p>
          BriefMyNews was born from a simple frustration: every morning, the
          same generic newsletters landed in our inboxes, packed with stories we
          did not care about. The news that actually mattered to us was buried
          under celebrity gossip, clickbait, and recycled takes.
        </p>

        <p>
          We built BriefMyNews to fix this. Instead of a one-size-fits-all
          newsletter, we created a system that lets you decide exactly what
          you want to read, where it comes from, and how often you receive it.
        </p>

        <h2 className="!mt-10 text-2xl font-bold text-foreground">
          Our Mission
        </h2>
        <p>
          To give every reader full control over their news consumption. We
          believe informed citizens make better decisions, and that starts with
          access to relevant, balanced, and trustworthy information.
        </p>

        <h2 className="!mt-10 text-2xl font-bold text-foreground">
          What Makes Us Different
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-foreground">You choose the topics.</strong>{" "}
            Not just &ldquo;technology&rdquo; but specific subjects like
            &ldquo;AI regulation in the EU&rdquo; or &ldquo;electric vehicle
            policy&rdquo;.
          </li>
          <li>
            <strong className="text-foreground">You pick the sources.</strong>{" "}
            We support 35+ outlets, each labelled with its political lean so you
            know exactly where your news comes from.
          </li>
          <li>
            <strong className="text-foreground">
              You set the schedule.
            </strong>{" "}
            Daily, weekly, or monthly per topic. Your time, your rules.
          </li>
          <li>
            <strong className="text-foreground">Zero spam.</strong> We will
            never sell your data, send promotional emails, or share your
            information with third parties.
          </li>
        </ul>

        <h2 className="!mt-10 text-2xl font-bold text-foreground">
          Transparency First
        </h2>
        <p>
          Every news source on our platform displays a bias rating. We use
          widely accepted media bias research to label each outlet from left
          to right. This is not about telling you what to think. It is about
          giving you the information to make that decision yourself.
        </p>

        <h2 className="!mt-10 text-2xl font-bold text-foreground">
          Based in the UK
        </h2>
        <p>
          BriefMyNews is a UK-based service, built by a small team that cares
          deeply about quality journalism and responsible technology. We are
          committed to building a product that respects your time, your privacy,
          and your intelligence.
        </p>
      </div>
    </div>
  );
}
