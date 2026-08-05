import { getAdmin } from "./admin";

// The public "Today's briefing" strip on the homepage.
//
// Design constraints, deliberately chosen to add reach without any SEO risk:
//   * It creates NO new URLs. Every story links out to the publisher, so there
//     are no thin per-article stub pages for Google to index and no crawl
//     budget spent on churn.
//   * It renders only our OWN summary text, never the publisher's article body,
//     so there is no duplicate content with the original and nothing that reads
//     as scraping.
//   * It reads pre-generated summaries only. Nothing is summarised at request
//     time, so the page stays statically served and fast (protects Core Web
//     Vitals and therefore existing rankings).
//   * It sits BELOW the hero, so the H1, meta and above-fold targeting of the
//     homepage are untouched.

export interface BriefStory {
  id: number;
  title: string;
  url: string;
  summary: string;
  sourceName: string;
  category: string;
  biasRating: string | null;
  publishedAt: string;
}

// Categories eligible for the PUBLIC strip. An allowlist, not a blocklist, so a
// newly added source can never surprise us onto the marketing page.
//
// "alternative" is deliberately excluded. It is a legitimate part of the
// product (it holds ProPublica, Bellingcat, The Intercept, The Conversation),
// but it also holds six Reddit feeds and Drudge Report, whose "headlines" are
// user-written post titles. Those must never represent us on the homepage.
// Excluding the category changes nothing for users: if someone subscribes to
// those sources, their digest still includes them.
const PUBLIC_CATEGORIES = new Set([
  "uk-news",
  "us-news",
  "world",
  "business",
  "tech",
  "science",
  "sports",
]);

// Verified against bmn_sources on 2026-08-05: these two are seeded under
// "uk-news", so the category allowlist alone does not catch them. The homepage
// is a shop window for a product that sells editorial judgement, and a
// celebrity-death splash is a poor advert for it. Digests are unaffected.
const EXCLUDED_FROM_PUBLIC_STRIP = new Set(["Daily Mail", "Mirror"]);

// How far back a story may be and still count as "today's" briefing.
const LOOKBACK_HOURS = 48;
// Stories shown on the homepage.
export const BRIEF_SIZE = 9;
// No single outlet may dominate the strip; keeps the spread visibly plural,
// which is the whole product promise.
const MAX_PER_SOURCE = 2;
// Static generation runs this during `next build`. A slow (not dead) Supabase
// would otherwise hang the build until Next's own timeout and fail the deploy.
const QUERY_TIMEOUT_MS = 5000;

interface Row {
  id: number;
  title: string;
  url: string;
  summary: string | null;
  description?: string | null;
  published_at: string | null;
  bmn_sources: { name: string; category: string; bias_rating: string | null } | null;
}

// The digest path is allowed to fall back to the publisher's own blurb when the
// summariser is unavailable, and it caches that on the same summary column. That
// is fine inside a private email but must never reach the public page, so this
// rejects any summary that is really just the source's text echoed back. Catches
// fallbacks no matter which code path wrote them.
function isOurOwnWriting(summary: string, description?: string | null): boolean {
  // No description to compare against means we cannot PROVE the text is ours.
  // Fail closed: today fallbackSummary degrades to the title (caught below),
  // but the moment full-text extraction is added, a cached fallback would carry
  // the publisher's article body and this is the guard that must stop it.
  if (!description) return false;
  const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
  const s = norm(summary).replace(/\.\.\.$/, "");
  const d = norm(description);
  if (!s) return false;
  return !d.startsWith(s.slice(0, Math.min(s.length, 120)));
}

const NAMED_ENTITIES: Record<string, string> = {
  quot: '"', apos: "'", nbsp: " ", lt: "<", gt: ">",
  pound: "£", euro: "€", cent: "¢", yen: "¥",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
  ndash: "–", mdash: "—", hellip: "…", bull: "•",
  eacute: "é", egrave: "è", agrave: "à", ccedil: "ç", uuml: "ü",
  ouml: "ö", auml: "ä", ntilde: "ñ", aacute: "á", iacute: "í",
  oacute: "ó", uacute: "ú", deg: "°", trade: "™", copy: "©", reg: "®",
};

// Entities that produce markup characters. Decoded on the first pass only: a
// second pass would turn deliberately double-escaped text like "&amp;lt;script&amp;gt;"
// (which should DISPLAY as "&lt;script&gt;") into "<script>". React escapes text
// children so this was never exploitable, but it would still be wrong output.
const MARKUP_ENTITIES = new Set(["lt", "gt", "amp"]);

function decodePass(input: string, decodeMarkup: boolean): string {
  const out = input
    .replace(/&#(\d+);/g, (m, code) => {
      const cp = parseInt(code, 10);
      return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
    })
    .replace(/&#x([0-9a-f]+);/gi, (m, code) => {
      const cp = parseInt(code, 16);
      return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
    })
    .replace(/&([a-z]+);/gi, (m, name) => {
      const key = name.toLowerCase();
      if (!decodeMarkup && MARKUP_ENTITIES.has(key)) return m;
      return NAMED_ENTITIES[key] ?? m;
    });
  // &amp; must be decoded LAST within a pass, so "&amp;lt;script&gt;" stays
  // inert as the literal text "&lt;script&gt;" rather than becoming a tag.
  return decodeMarkup ? out.replace(/&amp;/g, "&") : out;
}

// RSS titles routinely arrive with HTML entities still encoded ("Gen Z&#039;s",
// "&pound;75m deal"), sometimes double-encoded ("&amp;#039;"). React escapes
// strings on render, so these would otherwise display literally on the page.
export function decodeEntities(input: string): string {
  const once = decodePass(input, true);
  // One bounded second pass handles double-encoding, skipping markup entities so
  // escaped-on-purpose text stays escaped. No loop, so nothing can spin.
  const twice = /&(?:#\d+|#x[0-9a-f]+|[a-z]+);/i.test(once) ? decodePass(once, false) : once;
  return twice.replace(/\s+/g, " ").trim();
}

// The summariser occasionally editorialises about its input, or opens with a
// preamble, rather than just summarising. Fine to skip in a digest; must never
// be shown on the public homepage.
const META_COMMENTARY =
  /\b(appears to be|this article|this (?:appears|seems)|the headline (?:references|suggests)|rather than a news article|no substantive|insufficient (?:content|information)|unable to summarise|cannot summarise|here is a summary|here's a summary|the provided text|based on the (?:article|text)|i (?:cannot|can't|am unable|'m unable))\b/i;

// A story is publishable on the homepage only if we genuinely wrote a summary,
// it is a real summary rather than the headline echoed back, and it is not the
// model talking about the article instead of summarising it.
function isPublishable(r: Row): boolean {
  const summary = (r.summary || "").trim();
  if (summary.length < 80) return false;
  if (META_COMMENTARY.test(summary)) return false;
  if (!isOurOwnWriting(summary, r.description)) return false;

  const norm = (s: string) => decodeEntities(s).toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  // Reject "summaries" that are just the title again (the no-description fallback).
  if (norm(summary) === norm(r.title)) return false;
  if (norm(summary).startsWith(norm(r.title)) && summary.length < r.title.length * 1.4) return false;

  return true;
}

// Round-robin one story per category, then repeat, so the strip never shows
// nine football stories. Each bucket keeps its OWN cursor: an earlier version
// indexed every bucket by the shared round number, so a story skipped by the
// per-source quota burned that bucket's turn and later stories were never
// reached (measured: 8 rows in, 6 eligible, only 4 returned).
function diversify(rows: Row[], limit: number): Row[] {
  const byCategory = new Map<string, Row[]>();
  for (const r of rows) {
    const cat = r.bmn_sources?.category || "other";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(r);
  }

  const buckets = [...byCategory.values()];
  const cursors = buckets.map(() => 0);
  const perSource = new Map<string, number>();
  const picked: Row[] = [];

  for (;;) {
    let progressed = false;
    for (let b = 0; b < buckets.length; b++) {
      if (picked.length >= limit) return picked;
      const bucket = buckets[b];
      // Advance this bucket's cursor past anything the quota rejects, so a
      // skip never costs the bucket its turn.
      while (cursors[b] < bucket.length) {
        const cand = bucket[cursors[b]++];
        const source = cand.bmn_sources?.name || "unknown";
        const used = perSource.get(source) || 0;
        if (used >= MAX_PER_SOURCE) continue;
        perSource.set(source, used + 1);
        picked.push(cand);
        progressed = true;
        break;
      }
    }
    if (!progressed) break;
  }
  return picked;
}

function eligibleForPublicStrip(r: Row): boolean {
  return (
    Boolean(r.url) &&
    r.url.startsWith("http") &&
    Boolean(r.title) &&
    Boolean(r.published_at) &&
    PUBLIC_CATEGORIES.has(r.bmn_sources?.category || "") &&
    !EXCLUDED_FROM_PUBLIC_STRIP.has(r.bmn_sources?.name || "")
  );
}

async function withTimeout<T>(p: PromiseLike<T>, fallback: T): Promise<T> {
  return Promise.race([
    Promise.resolve(p),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), QUERY_TIMEOUT_MS)),
  ]);
}

// Candidate pool for briefing: the newest eligible articles that still NEED a
// summary, already diversified. The cron decides how many to spend Haiku tokens
// on. Throws on a query failure rather than returning [] so a Supabase outage
// surfaces as a failed cron run instead of a silent "nothing to do".
export async function getBriefCandidates(limit = 60): Promise<Row[]> {
  const since = new Date(Date.now() - LOOKBACK_HOURS * 3600_000).toISOString();
  const { data, error } = await withTimeout(
    getAdmin()
      .from("bmn_articles")
      .select("id, title, url, summary, description, full_text, published_at, bmn_sources(name, category, bias_rating)")
      .gte("published_at", since)
      .is("summary", null)
      .order("published_at", { ascending: false })
      .limit(400),
    { data: null, error: new Error("brief candidates query timed out") } as {
      data: unknown;
      error: unknown;
    }
  );
  if (error) throw error instanceof Error ? error : new Error(String(error));

  // Filter to eligible BEFORE diversifying. Diversify enforces a per-source cap,
  // so running it first would spend that cap on rows we were never going to
  // summarise, shrinking the reachable pool as summary coverage grows.
  const rows = ((data || []) as unknown as Row[]).filter(eligibleForPublicStrip);
  return diversify(rows, limit);
}

// What the homepage actually renders. Summary-only: if the cron has not run
// yet, the section simply shows fewer stories rather than raw RSS blurb.
export async function getHomepageBrief(): Promise<BriefStory[]> {
  const since = new Date(Date.now() - LOOKBACK_HOURS * 3600_000).toISOString();
  const { data, error } = await withTimeout(
    getAdmin()
      .from("bmn_articles")
      .select("id, title, url, summary, description, published_at, bmn_sources(name, category, bias_rating)")
      .gte("published_at", since)
      .not("summary", "is", null)
      .order("published_at", { ascending: false })
      .limit(200),
    { data: null, error: new Error("timeout") } as { data: unknown; error: unknown }
  );

  if (error || !data) return [];

  const usable = (data as unknown as Row[]).filter(
    (r) => eligibleForPublicStrip(r) && isPublishable(r)
  );

  return diversify(usable, BRIEF_SIZE).map((r) => ({
    id: r.id,
    title: decodeEntities(r.title),
    url: r.url,
    summary: decodeEntities(r.summary!),
    sourceName: r.bmn_sources?.name || "Source",
    category: r.bmn_sources?.category || "news",
    biasRating: r.bmn_sources?.bias_rating ?? null,
    publishedAt: r.published_at!,
  }));
}
