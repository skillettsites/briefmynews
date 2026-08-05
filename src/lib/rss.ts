import { XMLParser } from "fast-xml-parser";
import { getSupabaseServer } from "./supabase";

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  summary?: string;
  pubDate?: string;
  published?: string;
  updated?: string;
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

// JavaScript's Date only understands GMT/UTC and numeric offsets. Several
// publishers stamp pubDate with a named timezone instead ("... 10:42:00 BST"),
// which parses to Invalid Date and silently becomes a NULL published_at. Any
// article with a NULL published_at is then invisible to the digest builder,
// which filters on published_at. Sky Sports hit exactly this: it publishes in
// BST, so every one of its articles vanished from digests for the whole of
// British Summer Time and would have quietly fixed itself in the winter when
// the same feed switches to GMT.
//
// Only unambiguous abbreviations are mapped. IST is deliberately excluded
// (India +0530, Irish +0100 and Israel +0200 all use it); those fall through
// to the fetch-time fallback, which is accurate to within a few hours.
const TZ_OFFSETS: Record<string, string> = {
  UT: "+0000", UTC: "+0000", GMT: "+0000", Z: "+0000", WET: "+0000",
  BST: "+0100", CET: "+0100", WEST: "+0100",
  CEST: "+0200", EET: "+0200", SAST: "+0200",
  EEST: "+0300", MSK: "+0300",
  EST: "-0500", EDT: "-0400", CST: "-0600", CDT: "-0500",
  MST: "-0700", MDT: "-0600", PST: "-0800", PDT: "-0700",
  AKST: "-0900", AKDT: "-0800", HST: "-1000",
  JST: "+0900", KST: "+0900", HKT: "+0800", SGT: "+0800",
  AEST: "+1000", AEDT: "+1100", NZST: "+1200", NZDT: "+1300",
};

// Parse an RSS/Atom date to an ISO string. Returns null only when the input is
// genuinely unusable, so callers can apply their own fallback.
export function parseFeedDate(input: string | null | undefined): string | null {
  if (!input) return null;
  const raw = String(input).trim();
  if (!raw) return null;

  const direct = new Date(raw);
  if (!isNaN(direct.getTime())) return direct.toISOString();

  // Retry with a trailing named timezone swapped for its numeric offset.
  const m = raw.match(/\s([A-Z]{1,5})$/);
  if (m) {
    const offset = TZ_OFFSETS[m[1].toUpperCase()];
    if (offset) {
      const retry = new Date(raw.replace(/\s[A-Z]{1,5}$/, ` ${offset}`));
      if (!isNaN(retry.getTime())) return retry.toISOString();
    }
  }
  return null;
}

// Many publishers (Reddit, FT, Telegraph, Investing.com) reject the literal
// "BriefMyNews/1.0" UA with a 403. A browser-shaped UA gets through everywhere
// in our verified-live source list. Keep the bot identifier in parentheses so
// we're still honest.
const BROWSER_UA =
  "Mozilla/5.0 (compatible; BriefMyNewsBot/1.0; +https://briefmynews.com)";

export async function fetchRSSFeed(url: string, timeoutMs = 10000): Promise<ParsedArticle[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      redirect: "follow",
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
      published_at:
        parseFeedDate(str(item.pubDate ?? item["dc:date"] ?? item.published ?? item.updated)) ||
        null,
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
