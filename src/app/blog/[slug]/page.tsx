import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug, getAllSlugs } from "@/data/blog-posts";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://briefmynews.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
    alternates: { canonical: `https://briefmynews.com/blog/${post.slug}` },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Get related posts (exclude current, pick 3 most recent)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
          "@type": "Organization",
          name: "BriefMyNews",
          url: "https://briefmynews.com",
        },
        publisher: {
          "@type": "Organization",
          name: "BriefMyNews",
          url: "https://briefmynews.com",
          logo: {
            "@type": "ImageObject",
            url: "https://briefmynews.com/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://briefmynews.com/blog/${post.slug}`,
        },
      },
      {
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
            name: "Blog",
            item: "https://briefmynews.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://briefmynews.com/blog/${post.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
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

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header>
          <time
            dateTime={post.publishedAt}
            className="text-sm text-muted"
          >
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{post.description}</p>
        </header>

        {/* Content */}
        <div
          className="prose mt-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-4">
            {post.faqs.map((faq) => (
              <details key={faq.question} className="glass-card group">
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
                <div className="px-5 pb-5 text-sm text-muted">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Posts */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-bold text-foreground">
            Related Articles
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="glass-card p-4 transition-all hover:scale-[1.02]"
              >
                <time
                  dateTime={related.publishedAt}
                  className="text-xs text-muted"
                >
                  {new Date(related.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                <h3 className="mt-1 text-sm font-semibold text-foreground line-clamp-2">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 glass-card p-8 text-center">
          <h2 className="text-xl font-bold text-foreground">
            Ready to take control of your news?
          </h2>
          <p className="mt-2 text-sm text-muted">
            Choose your topics, pick your sources, set your schedule. Free to start.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Get Started Free
          </Link>
        </section>
      </article>
    </>
  );
}
