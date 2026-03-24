import { XMLParser } from "fast-xml-parser";
import { getSupabaseServer } from "./supabase";

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  summary?: string;
  pubDate?: string;
  published?: string;
  "dc:date"?: string;
  "@_href"?: string;
}

interface ParsedArticle {
  title: string;
  url: string;
  description: string;
  published_at: string | null;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export async function fetchRSSFeed(url: string): Promise<ParsedArticle[]> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "BriefMyNews/1.0" },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      console.error(`Failed to fetch RSS from ${url}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const parsed = parser.parse(xml);

    const channel = parsed?.rss?.channel || parsed?.feed;
    if (!channel) return [];

    const items: RSSItem[] = channel.item || channel.entry || [];
    const itemArray = Array.isArray(items) ? items : [items];

    return itemArray.map((item) => ({
      title: item.title || "",
      url: item.link || item["@_href"] || "",
      description: item.description || item.summary || "",
      published_at: item.pubDate || item["dc:date"] || item.published || null,
    }));
  } catch (error) {
    console.error(`Error fetching RSS from ${url}:`, error);
    return [];
  }
}

export async function cacheArticles(
  sourceId: number,
  articles: ParsedArticle[]
) {
  const supabase = getSupabaseServer();

  for (const article of articles) {
    if (!article.url || !article.title) continue;

    await supabase.from("bmn_articles").upsert(
      {
        source_id: sourceId,
        title: article.title,
        url: article.url,
        description: article.description,
        published_at: article.published_at
          ? new Date(article.published_at).toISOString()
          : null,
      },
      { onConflict: "url" }
    );
  }
}
