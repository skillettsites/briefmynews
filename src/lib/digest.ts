import { Resend } from "resend";
import { getAdmin, AppUser } from "./admin";
import { expandTopic, scoreArticle, RELEVANCE_THRESHOLD } from "./topic-match";
import { biasStyle, leanWeight } from "./bias";
import { ensureSummaries, ArticleRow } from "./summarise";
import { unsubUrl } from "./unsubscribe";
import { topicLimit, sourceLimit, politicalLeanAllowed } from "./limits";

const MAX_ARTICLES_PER_TOPIC = 5;
const FROM = process.env.DIGEST_FROM || "BriefMyNews <digest@briefmynews.com>";

export type Frequency = "daily" | "weekly" | "monthly";

function windowDays(freq: Frequency): number {
  return freq === "daily" ? 1 : freq === "monthly" ? 30 : 7;
}

interface SourceRow {
  id: number;
  name: string;
  bias_rating: string | null;
}

// New free users who haven't picked sources still deserve a broad, useful
// digest. Default to a curated spread of high-volume, widely-trusted sources
// rather than one arbitrary row (which produced 1-story emails). Pro defaults
// to everything. Explicit source picks are still capped to the tier limit.
const FREE_DEFAULT_SOURCE_COUNT = 5;
const PREFERRED_DEFAULT_PATTERNS = [
  /^bbc news$/i, /reuters/i, /guardian/i, /sky news/i, /independent/i,
  /associated press|ap news/i, /npr/i, /bbc world/i, /al jazeera/i,
];
function defaultSourceIds(tier: "free" | "pro", all: SourceRow[]): number[] {
  if (tier === "pro") return all.map((s) => s.id);
  const ids: number[] = [];
  for (const pat of PREFERRED_DEFAULT_PATTERNS) {
    const m = all.find((s) => pat.test(s.name) && !ids.includes(s.id));
    if (m) ids.push(m.id);
    if (ids.length >= FREE_DEFAULT_SOURCE_COUNT) break;
  }
  // Top up with any remaining sources if too few matched.
  for (const s of all) {
    if (ids.length >= FREE_DEFAULT_SOURCE_COUNT) break;
    if (!ids.includes(s.id)) ids.push(s.id);
  }
  return ids;
}

interface DigestArticle {
  title: string;
  url: string;
  summary: string;
  sourceName: string;
  bias: { colour: string; label: string };
  publishedAt: string | null;
}

interface DigestTopic {
  topic: string;
  articles: DigestArticle[];
}

export interface BuiltDigest {
  topics: DigestTopic[];
  totalArticles: number;
  sourceCount: number;
}

// Pull this user's topics, enabled sources and political lean, match recent
// articles, summarise the selected ones, and return a structured digest.
export async function buildUserDigest(
  user: AppUser,
  opts: { lookbackDays?: number } = {}
): Promise<{ profile: { lean: string }; digest: BuiltDigest }> {
  const admin = getAdmin();
  const isFree = user.tier !== "pro";

  const [{ data: topicRows }, { data: srcPrefRows }, { data: profileRows }, { data: allSources }] =
    await Promise.all([
      admin.from("bmn_user_topics").select("topic, frequency").eq("user_id", user.id),
      admin.from("bmn_user_sources").select("source_id, enabled").eq("user_id", user.id),
      admin.from("bmn_profiles").select("political_lean").eq("id", user.id).limit(1),
      admin.from("bmn_sources").select("id, name, bias_rating"),
    ]);

  const tier: "free" | "pro" = isFree ? "free" : "pro";
  // Political lean only weights articles for Pro subscribers. Free defaults
  // to centre regardless of what's stored in the profile row.
  const storedLean = profileRows?.[0]?.political_lean || "centre";
  const lean = politicalLeanAllowed(tier) ? storedLean : "centre";
  const sourceById = new Map<number, SourceRow>((allSources || []).map((s) => [s.id, s as SourceRow]));

  // Resolve the user's enabled sources. Explicit picks are capped to the tier's
  // source limit. If they haven't picked any, use a good default set (a curated
  // spread of broad, high-volume sources for free; all sources for pro) so the
  // digest is genuinely useful out of the box, not one arbitrary source.
  let enabledSourceIds: number[];
  const explicitlyEnabled = (srcPrefRows || []).filter((r) => r.enabled).map((r) => r.source_id);
  if (explicitlyEnabled.length > 0) {
    enabledSourceIds = explicitlyEnabled.slice(0, sourceLimit(tier));
  } else {
    enabledSourceIds = defaultSourceIds(tier, (allSources || []) as SourceRow[]);
  }
  const enabledSet = new Set(enabledSourceIds);

  let topics = (topicRows || []).map((t) => ({
    topic: t.topic as string,
    frequency: (t.frequency as Frequency) || "weekly",
  }));
  topics = topics.slice(0, topicLimit(tier));

  // Widest lookback across this user's topics (free users are weekly).
  const lookback =
    opts.lookbackDays ??
    Math.max(...topics.map((t) => windowDays(isFree ? "weekly" : t.frequency)), 7);
  const since = new Date(Date.now() - lookback * 864e5).toISOString();

  // Candidate articles: recent, from enabled sources.
  const { data: articleRows } = await admin
    .from("bmn_articles")
    .select("id, source_id, title, url, description, full_text, summary, published_at")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(1200);

  const candidates = (articleRows || []).filter((a) => enabledSet.has(a.source_id));

  const builtTopics: DigestTopic[] = [];
  const usedUrls = new Set<string>();
  const toSummarise: ArticleRow[] = [];
  const pending: { topic: string; rows: { row: typeof candidates[number]; score: number }[] }[] = [];

  for (const t of topics) {
    const terms = expandTopic(t.topic);
    const scored = candidates
      .map((row) => {
        const relevance = scoreArticle(row, terms);
        const weight = leanWeight(lean, sourceById.get(row.source_id)?.bias_rating);
        // Recency: newer is better, gentle decay.
        const ageDays = row.published_at
          ? (Date.now() - new Date(row.published_at).getTime()) / 864e5
          : 7;
        const recency = Math.max(0.5, 1 - ageDays / (lookback * 2));
        return { row, relevance, score: relevance * weight * recency };
      })
      .filter((x) => x.relevance >= RELEVANCE_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    const picked: { row: typeof candidates[number]; score: number }[] = [];
    for (const s of scored) {
      if (usedUrls.has(s.row.url)) continue;
      usedUrls.add(s.row.url);
      picked.push(s);
      toSummarise.push(s.row as ArticleRow);
      if (picked.length >= MAX_ARTICLES_PER_TOPIC) break;
    }
    if (picked.length > 0) pending.push({ topic: t.topic, rows: picked });
  }

  const summaries = await ensureSummaries(toSummarise);

  let total = 0;
  for (const p of pending) {
    const articles: DigestArticle[] = p.rows.map(({ row }) => {
      const src = sourceById.get(row.source_id);
      return {
        title: row.title,
        url: row.url,
        summary: summaries.get(row.id) || row.description || "",
        sourceName: src?.name || "News",
        bias: biasStyle(src?.bias_rating),
        publishedAt: row.published_at,
      };
    });
    total += articles.length;
    builtTopics.push({ topic: p.topic, articles });
  }

  return {
    profile: { lean },
    digest: { topics: builtTopics, totalArticles: total, sourceCount: enabledSet.size },
  };
}

function timeAgo(iso: string | null): string {
  if (!iso) return "recently";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderDigestEmail(
  digest: BuiltDigest,
  opts: { frequency: Frequency; unsubscribeUrl: string; dateStr: string }
): string {
  const freqLabel =
    opts.frequency.charAt(0).toUpperCase() + opts.frequency.slice(1);

  const topicHtml = digest.topics
    .map((t) => {
      const cards = t.articles
        .map(
          (a) => `
        <div style="padding:16px 0;border-bottom:1px solid #e5e7eb;">
          <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:4px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${a.bias.colour};margin-right:6px;vertical-align:middle;"></span>
            ${esc(a.sourceName)} &middot; ${esc(a.bias.label)} &middot; ${esc(timeAgo(a.publishedAt))}
          </div>
          <a href="${esc(a.url)}" style="font-size:16px;font-weight:700;color:#1a1a2e;text-decoration:none;line-height:1.35;">${esc(a.title)}</a>
          <p style="font-size:14px;color:#4b5563;line-height:1.55;margin:6px 0 8px;">${esc(a.summary)}</p>
          <a href="${esc(a.url)}" style="font-size:13px;color:#2563eb;text-decoration:none;font-weight:600;">Read full article &rarr;</a>
        </div>`
        )
        .join("");
      return `
      <div style="margin:28px 0 8px;">
        <h2 style="font-size:18px;font-weight:800;color:#1a1a2e;margin:0 0 4px;border-bottom:2px solid #1a1a2e;padding-bottom:6px;">
          ${esc(t.topic)} <span style="font-size:12px;font-weight:500;color:#9ca3af;">(${t.articles.length})</span>
        </h2>
        ${cards}
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your ${freqLabel} Brief</title></head>
<body style="margin:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#1a1a2e;padding:24px 20px;text-align:center;">
      <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Brief<span style="color:#60a5fa;">My</span>News</div>
      <div style="font-size:13px;color:#cbd5e1;margin-top:4px;">Your ${freqLabel} Digest &middot; ${esc(opts.dateStr)}</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:2px;">${digest.totalArticles} ${digest.totalArticles === 1 ? "story" : "stories"} matched across your sources</div>
    </div>
    <div style="padding:8px 20px 24px;">
      ${topicHtml || `<p style="font-size:15px;color:#4b5563;padding:24px 0;text-align:center;">No new stories matched your topics in this window. We'll keep watching and send more in your next brief.</p>`}
    </div>
    <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
      <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">
        <a href="https://briefmynews.com/dashboard" style="color:#2563eb;text-decoration:none;">Manage preferences</a>
        &nbsp;&middot;&nbsp;
        <a href="${esc(opts.unsubscribeUrl)}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
      </div>
      <div style="font-size:11px;color:#9ca3af;line-height:1.5;">
        You're receiving this because you signed up at briefmynews.com.<br>
        BriefMyNews, London, United Kingdom.
      </div>
    </div>
  </div>
</body></html>`;
}

export interface SendResult {
  status: "sent" | "skipped" | "error";
  reason?: string;
  emailId?: string;
  articleCount?: number;
}

export async function sendDigestToUser(
  user: AppUser,
  opts: { force?: boolean; frequency?: Frequency } = {}
): Promise<SendResult> {
  if (!user.email) return { status: "skipped", reason: "no_email" };
  if (user.unsubscribed && !opts.force) return { status: "skipped", reason: "unsubscribed" };

  const isFree = user.tier !== "pro";
  const frequency: Frequency = isFree ? "weekly" : opts.frequency || "weekly";

  const { digest } = await buildUserDigest(user);
  if (digest.totalArticles === 0 && !opts.force) {
    return { status: "skipped", reason: "no_articles" };
  }

  if (!process.env.RESEND_API_KEY) return { status: "error", reason: "no_resend_key" };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const dateStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const unsubscribeUrl = unsubUrl(user.id);
  const html = renderDigestEmail(digest, { frequency, unsubscribeUrl, dateStr });

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `Your ${frequency} brief: ${digest.totalArticles} ${digest.totalArticles === 1 ? "story" : "stories"}`,
    html,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (error) return { status: "error", reason: JSON.stringify(error).slice(0, 200) };

  // Log to bmn_digests (also our source of truth for "last sent").
  try {
    await getAdmin().from("bmn_digests").insert({
      user_id: user.id,
      topic: digest.topics.map((t) => t.topic).join(", ").slice(0, 200) || "all",
      article_count: digest.totalArticles,
      email_id: data?.id || null,
    });
  } catch (e) {
    console.error("digest log failed:", (e as Error).message);
  }

  return { status: "sent", emailId: data?.id, articleCount: digest.totalArticles };
}
