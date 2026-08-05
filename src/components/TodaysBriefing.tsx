import Link from "next/link";
import { getHomepageBrief, BriefStory } from "@/lib/homepage-brief";

// Public sample of the actual product. Every visitor currently lands on a page
// that only DESCRIBES a news digest; this shows one working.
//
// Every outbound link carries rel="nofollow noopener noreferrer". These are
// bulk automated links to third-party publishers, so passing PageRank to them
// would be both a leak and, at volume, a link-scheme signal. nofollow is the
// correct treatment for syndicated/aggregated outbound links.

// Deliberately an ABSOLUTE date, not "2h ago". This section is statically
// rendered with a 30-minute ISR window, so any relative string is computed once
// and then frozen into cached HTML that can be served for far longer. A card
// reading "2h ago" for a day-old story, under a badge saying "Updated daily",
// would undermine the exact credibility the strip exists to build. An absolute
// date is still true whenever the cached copy is served.
function publishedLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Every category that can reach the public strip (see PUBLIC_CATEGORIES in
// homepage-brief.ts). Anything unmapped falls back to the raw slug.
const CATEGORY_LABELS: Record<string, string> = {
  "uk-news": "UK",
  "us-news": "US",
  business: "Business",
  tech: "Tech",
  sports: "Sport",
  science: "Science",
  world: "World",
};

function StoryCard({ story }: { story: BriefStory }) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card-bg p-5 transition-colors hover:border-border-hover">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
          {CATEGORY_LABELS[story.category] || story.category}
        </span>
        <span className="text-muted">{story.sourceName}</span>
        <span aria-hidden="true" className="text-muted">
          &middot;
        </span>
        <time dateTime={story.publishedAt} className="text-muted">
          {publishedLabel(story.publishedAt)}
        </time>
      </div>

      <h3 className="text-base font-semibold leading-snug text-foreground">
        {story.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{story.summary}</p>

      <a
        href={story.url}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Read the full story at {story.sourceName}
        <span aria-hidden="true">&rarr;</span>
      </a>
    </article>
  );
}

export default async function TodaysBriefing() {
  const stories = await getHomepageBrief();

  // Never render a broken or near-empty strip. If the briefing cron has not
  // run, the homepage simply looks exactly as it did before.
  if (stories.length < 3) return null;

  const sources = [...new Set(stories.map((s) => s.sourceName))].length;

  return (
    <section
      id="todays-briefing"
      className="border-t border-border bg-surface py-16 sm:py-20"
      aria-labelledby="briefing-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Updated daily
          </div>
          <h2
            id="briefing-heading"
            className="text-3xl font-bold text-foreground sm:text-4xl"
          >
            Today&apos;s briefing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            A sample of what we do, summarised from {sources} different sources.
            This one is for everybody. Yours would carry only the topics you
            pick, from the outlets you trust.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Link
            href="/signup"
            className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Get this for your topics, free
          </Link>
          <p className="text-xs text-muted">
            Summaries are written by us. Headlines and full articles remain the
            work of the publishers linked above.
          </p>
        </div>
      </div>
    </section>
  );
}
