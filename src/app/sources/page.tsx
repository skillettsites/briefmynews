import type { Metadata } from "next";
import { SOURCES, CATEGORIES, BIAS_LABELS } from "@/lib/sources-data";

export const metadata: Metadata = {
  title: "Our Sources | 63+ News Sources Across the Political Spectrum",
  description:
    "BriefMyNews pulls from 63+ news sources spanning left to right, mainstream to independent. Reddit, podcasts, investigative journalism, and traditional media. Full transparency on every source we use.",
  openGraph: {
    title: "Our Sources | BriefMyNews",
    description:
      "63+ news sources across the political spectrum. Full transparency on bias ratings and categories.",
    url: "https://briefmynews.com/sources",
  },
  alternates: { canonical: "https://briefmynews.com/sources" },
};

function BiasChip({ rating }: { rating: string }) {
  const info = BIAS_LABELS[rating] || { label: rating, colour: "#888" };
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{
        backgroundColor: `${info.colour}18`,
        color: info.colour,
        border: `1px solid ${info.colour}30`,
      }}
    >
      {info.label}
    </span>
  );
}

export default function SourcesPage() {
  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    sources: SOURCES.filter((s) => s.category === cat.id),
  })).filter((g) => g.sources.length > 0);

  const totalSources = SOURCES.length;
  const biasBreakdown = Object.entries(BIAS_LABELS).map(([key, val]) => ({
    key,
    label: val.label,
    colour: val.colour,
    count: SOURCES.filter((s) => s.bias_rating === key).length,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Our Sources
        </h1>
        <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
          {totalSources} sources across {CATEGORIES.length} categories, spanning
          the full political spectrum. We believe in transparency: you should
          know exactly where your news comes from.
        </p>
      </div>

      {/* Bias spectrum overview */}
      <div className="mb-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          Political Spectrum Coverage
        </h2>

        {/* Spectrum bar */}
        <div className="flex rounded-lg overflow-hidden h-10 mb-4">
          {biasBreakdown.map((b) => (
            <div
              key={b.key}
              className="flex items-center justify-center text-xs font-bold text-white transition-all"
              style={{
                backgroundColor: b.colour,
                width: `${(b.count / totalSources) * 100}%`,
                minWidth: b.count > 0 ? "40px" : "0",
              }}
            >
              {b.count}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted">
          {biasBreakdown.map((b) => (
            <div key={b.key} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: b.colour }}
              />
              <span>
                {b.label} ({b.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Source grid by category */}
      <div className="space-y-10">
        {grouped.map((group) => (
          <section key={group.id}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-foreground">
                {group.name}
              </h2>
              <span className="text-xs text-muted bg-[var(--color-surface)] px-2 py-0.5 rounded-full">
                {group.sources.length} sources
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.sources.map((source) => (
                <div
                  key={source.slug}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] px-4 py-3 hover:border-[var(--color-border-hover)] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {source.name}
                    </p>
                  </div>
                  <BiasChip rating={source.bias_rating} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom note */}
      <div className="mt-12 text-center">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 max-w-2xl mx-auto">
          <h3 className="font-semibold text-foreground mb-2">
            How we rate bias
          </h3>
          <p className="text-sm text-muted">
            Our bias ratings are based on cross-referencing Media Bias/Fact
            Check, AllSides, and Ad Fontes Media. We use a 5-point scale: Left,
            Centre-Left, Centre, Centre-Right, and Right. Bias is not the same
            as accuracy; a source can be biased yet factually reliable. You
            control which sources appear in your digest.
          </p>
        </div>
      </div>
    </div>
  );
}
