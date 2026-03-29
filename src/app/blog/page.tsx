import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/all-blog-posts";

export const metadata: Metadata = {
  title: "News Consumption Tips, Media Literacy and Staying Informed (2026)",
  description:
    "Practical guides on building a balanced news diet, spotting media bias, beating news fatigue, and choosing trustworthy sources. 37+ articles from the BriefMyNews team.",
  openGraph: {
    title: "BriefMyNews Blog: News Tips and Media Literacy Guides",
    description:
      "Practical guides on building a balanced news diet, spotting bias, and staying informed without burnout.",
    url: "https://briefmynews.com/blog",
  },
  alternates: { canonical: "https://briefmynews.com/blog" },
};

export default function BlogIndex() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "BriefMyNews Blog",
    url: "https://briefmynews.com/blog",
    description:
      "News consumption tips, media literacy guides, and expert advice on building a balanced information diet.",
    publisher: {
      "@type": "Organization",
      name: "BriefMyNews",
      url: "https://briefmynews.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 text-lg text-muted">
            Guides, comparisons, and practical advice on staying informed in 2026.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {sortedPosts.map((post) => (
            <article key={post.slug} className="glass-card p-6 transition-all hover:scale-[1.01]">
              <Link href={`/blog/${post.slug}`}>
                <time
                  dateTime={post.publishedAt}
                  className="text-xs text-muted"
                >
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <h2 className="mt-2 text-xl font-semibold text-foreground hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted line-clamp-2">
                  {post.description}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-primary">
                  Read more &rarr;
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
