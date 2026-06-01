// Tier-1 topic matching: expand a free-text user topic into keywords, then
// score an article by how many keywords appear in its title/description.
// Free, fast, no API calls. Good enough for the large majority of topics.

const SYNONYMS: Record<string, string[]> = {
  tech: ["technology", "software", "hardware", "startup", "silicon valley", "ai", "computing", "gadget"],
  technology: ["tech", "software", "ai", "startup", "computing"],
  ai: ["artificial intelligence", "machine learning", "chatgpt", "openai", "anthropic", "llm", "neural"],
  "artificial intelligence": ["ai", "machine learning", "chatgpt", "llm", "openai"],
  crypto: ["cryptocurrency", "bitcoin", "ethereum", "blockchain", "web3", "defi", "btc", "stablecoin"],
  cryptocurrency: ["crypto", "bitcoin", "ethereum", "blockchain", "web3"],
  "uk politics": ["westminster", "parliament", "downing street", "labour", "conservative", "tory", "starmer", "pmqs", "commons"],
  politics: ["government", "election", "parliament", "congress", "senate", "policy", "minister", "president"],
  business: ["economy", "markets", "finance", "company", "earnings", "stocks", "trade"],
  finance: ["markets", "stocks", "investing", "economy", "interest rates", "inflation", "banking"],
  economy: ["economic", "gdp", "inflation", "recession", "interest rates", "jobs", "growth"],
  sport: ["sports", "football", "premier league", "rugby", "cricket", "tennis", "f1", "formula 1"],
  sports: ["sport", "football", "nba", "nfl", "premier league", "tennis", "olympics"],
  football: ["soccer", "premier league", "champions league", "fifa", "transfer"],
  science: ["research", "study", "scientists", "physics", "biology", "space", "climate"],
  space: ["nasa", "spacex", "rocket", "astronaut", "satellite", "mars", "moon"],
  health: ["nhs", "medical", "medicine", "disease", "doctors", "hospital", "wellbeing", "mental health"],
  climate: ["climate change", "global warming", "emissions", "net zero", "renewable", "environment"],
  environment: ["climate", "pollution", "wildlife", "conservation", "sustainability"],
  world: ["international", "global", "foreign", "diplomacy", "war", "conflict"],
  entertainment: ["film", "movie", "tv", "celebrity", "music", "hollywood", "streaming"],
};

const STOP = new Set([
  "the", "a", "an", "and", "or", "in", "on", "of", "to", "for", "with", "about",
  "news", "latest", "update", "updates", "story", "stories",
]);

export function expandTopic(topic: string): string[] {
  const lower = topic.toLowerCase().trim();
  const terms = new Set<string>();

  // Whole-phrase synonyms (e.g. "uk politics", "artificial intelligence").
  if (SYNONYMS[lower]) SYNONYMS[lower].forEach((s) => terms.add(s));
  terms.add(lower);

  // Per-word expansion + the words themselves (minus stop words).
  for (const word of lower.split(/[\s,/]+/)) {
    const w = word.trim();
    if (!w || STOP.has(w) || w.length < 3) continue;
    terms.add(w);
    if (SYNONYMS[w]) SYNONYMS[w].forEach((s) => terms.add(s));
  }
  return [...terms];
}

export interface Scorable {
  title?: string | null;
  description?: string | null;
  full_text?: string | null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Match a term as a whole word, case-insensitive. Critical for short tokens
// like "ai" or "llm" — substring matching makes them hit "paid", "again",
// "main", "small", etc., which floods digests with garbage.
function matchesWord(haystack: string, term: string): boolean {
  if (!term || !haystack) return false;
  const re = new RegExp(`\\b${escapeRegex(term)}\\b`, "i");
  return re.test(haystack);
}

// Relevance 0..1. Title hits weigh more than body hits.
export function scoreArticle(article: Scorable, expandedTerms: string[]): number {
  const title = article.title || "";
  const desc = article.description || "";
  const body = article.full_text || "";
  if (!title && !desc && !body) return 0;

  let hits = 0;
  let titleHits = 0;
  for (const term of expandedTerms) {
    if (!term) continue;
    if (matchesWord(title, term)) {
      hits += 1;
      titleHits += 1;
    } else if (matchesWord(desc, term) || matchesWord(body, term)) {
      hits += 1;
    }
  }
  if (hits === 0) return 0;
  const base = Math.min(1, hits / 3);
  const titleBoost = Math.min(0.3, titleHits * 0.12);
  return Math.min(1, base + titleBoost);
}

export const RELEVANCE_THRESHOLD = 0.34;
