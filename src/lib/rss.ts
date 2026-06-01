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

export async function fetchRSSFeed(url: string, timeoutMs = 4000): Promise<ParsedArticle[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "BriefMyNews/1.0" },
      signal: controller.signal,
      cache: "no-store",
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

    // RSS/Atom fields can arrive as strings, CDATA objects ({ "#text": ... }),
    // or arrays (Atom <link>). Coerce everything to clean strings.
    const str = (v: unknown): string => {
      if (typeof v === "string") return v.trim();
      if (Array.isArray(v)) return str(v[0]);
      if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        return str(o["#text"] ?? o["@_href"] ?? o["@_url"] ?? "");
      }
      return "";
    };
    const linkOf = (item: RSSItem): string => {
      const l = (item as unknown as Record<string, unknown>).link;
      if (typeof l === "string") return l.trim();
      if (Array.isArray(l)) {
        // Atom: prefer rel="alternate" or the first href.
        const alt = (l as Record<string, unknown>[]).find((x) => {
          const rel = x && typeof x === "object" ? (x as Record<string, unknown>)["@_rel"] : undefined;
          return rel === "alternate" || rel === undefined;
        });
        return str(alt ?? l[0]);
      }
      return str(l ?? item["@_href"]);
    };

    return itemArray.map((item) => ({
      title: str(item.title),
      url: linkOf(item),
      description: str(item.description ?? item.summary),
      published_at: str(item.pubDate ?? item["dc:date"] ?? item.published) || null,
    }));
  } catch (error) {
    console.error(`Error fetching RSS from ${url}:`, (error as Error).message);
    return [];
  } finally {
    clearTimeout(timer);
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
