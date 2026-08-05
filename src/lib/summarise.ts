import Anthropic from "@anthropic-ai/sdk";
import { getAdmin } from "./admin";

// Lazy summarisation with Claude Haiku. We only summarise articles that are
// actually being sent in a digest, and cache the result on bmn_articles so
// every later recipient of the same article pays nothing.

const MODEL = "claude-haiku-4-5";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });
  }
  return _client;
}

export interface ArticleRow {
  id: number;
  title: string;
  description?: string | null;
  full_text?: string | null;
  summary?: string | null;
}

function fallbackSummary(a: ArticleRow): string {
  const text = (a.description || a.full_text || "").replace(/\s+/g, " ").trim();
  if (!text) return a.title;
  return text.length > 280 ? text.slice(0, 277).trimEnd() + "..." : text;
}

// Returns null when we could not genuinely write a summary ourselves. Callers
// that publish text on the open web MUST use this and drop the article on null,
// because the fallback is the publisher's own wording: fine to forward inside a
// private email, but republishing it would be duplicate content lifted from the
// source and would make our "summaries written by us" claim untrue.
async function summariseStrict(a: ArticleRow): Promise<string | null> {
  const source = (a.full_text || a.description || "").replace(/\s+/g, " ").trim().slice(0, 4000);
  if (!source) return null;
  if (!process.env.ANTHROPIC_API_KEY) return null;

  try {
    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 220,
      system:
        "You write neutral, factual 2-3 sentence summaries for a news digest email. No opinion, no editorialising, no preamble. British English. Never use em dashes; use commas or separate sentences.",
      messages: [
        {
          role: "user",
          content: `Summarise this news article in 2 to 3 plain sentences for a busy reader.\n\nHeadline: ${a.title}\n\nArticle: ${source}`,
        },
      ],
    });
    const block = msg.content.find((b) => b.type === "text");
    const text = block && block.type === "text" ? block.text.trim() : "";
    if (!text) return null;
    // Guard against the model echoing the source blurb back verbatim.
    const normalise = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
    if (normalise(text) === normalise(source.slice(0, text.length))) return null;
    return text;
  } catch (e) {
    console.error(`summariseStrict failed for article ${a.id}:`, (e as Error).message);
    return null;
  }
}

async function summariseOne(a: ArticleRow): Promise<string> {
  const source = (a.full_text || a.description || "").replace(/\s+/g, " ").trim().slice(0, 4000);
  if (!source) return fallbackSummary(a);
  if (!process.env.ANTHROPIC_API_KEY) return fallbackSummary(a);

  try {
    const msg = await client().messages.create({
      model: MODEL,
      max_tokens: 220,
      system:
        "You write neutral, factual 2-3 sentence summaries for a news digest email. No opinion, no editorialising, no preamble. British English. Never use em dashes; use commas or separate sentences.",
      messages: [
        {
          role: "user",
          content: `Summarise this news article in 2 to 3 plain sentences for a busy reader.\n\nHeadline: ${a.title}\n\nArticle: ${source}`,
        },
      ],
    });
    const block = msg.content.find((b) => b.type === "text");
    const text = block && block.type === "text" ? block.text.trim() : "";
    return text || fallbackSummary(a);
  } catch (e) {
    console.error(`summariseOne failed for article ${a.id}:`, (e as Error).message);
    return fallbackSummary(a);
  }
}

// Ensure each article has a summary; generate + cache the missing ones.
// Returns a map of articleId -> summary.
export async function ensureSummaries(articles: ArticleRow[]): Promise<Map<number, string>> {
  const out = new Map<number, string>();
  const admin = getAdmin();

  for (const a of articles) {
    if (a.summary && a.summary.trim().length > 0) {
      out.set(a.id, a.summary);
      continue;
    }
    const summary = await summariseOne(a);
    out.set(a.id, summary);
    // Cache it (best-effort; never block the send on a write failure).
    try {
      await admin.from("bmn_articles").update({ summary }).eq("id", a.id);
    } catch (e) {
      console.error(`cache summary failed for ${a.id}:`, (e as Error).message);
    }
  }
  return out;
}

// Public-web variant: writes a cached summary ONLY when we genuinely authored
// it. Articles we could not summarise are skipped entirely rather than stored
// with the publisher's own text. Returns the number newly summarised.
export async function ensurePublicSummaries(articles: ArticleRow[]): Promise<number> {
  const admin = getAdmin();
  let written = 0;

  for (const a of articles) {
    if (a.summary && a.summary.trim().length > 0) continue;
    const summary = await summariseStrict(a);
    if (!summary) continue;
    try {
      await admin.from("bmn_articles").update({ summary }).eq("id", a.id);
      written++;
    } catch (e) {
      console.error(`cache summary failed for ${a.id}:`, (e as Error).message);
    }
  }
  return written;
}
