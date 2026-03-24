export interface SourceSeed {
  name: string;
  slug: string;
  rss_url: string;
  category: string;
  bias_rating: string;
}

export const SOURCES: SourceSeed[] = [
  // UK News
  { name: "BBC News", slug: "bbc-news", rss_url: "https://feeds.bbci.co.uk/news/rss.xml", category: "uk-news", bias_rating: "centre" },
  { name: "The Guardian", slug: "guardian", rss_url: "https://www.theguardian.com/uk/rss", category: "uk-news", bias_rating: "centre-left" },
  { name: "The Telegraph", slug: "telegraph", rss_url: "https://www.telegraph.co.uk/rss.xml", category: "uk-news", bias_rating: "centre-right" },
  { name: "The Independent", slug: "independent", rss_url: "https://www.independent.co.uk/news/uk/rss", category: "uk-news", bias_rating: "centre-left" },
  { name: "Sky News", slug: "sky-news", rss_url: "https://feeds.skynews.com/feeds/rss/uk.xml", category: "uk-news", bias_rating: "centre" },
  { name: "ITV News", slug: "itv-news", rss_url: "https://www.itv.com/news/rss.xml", category: "uk-news", bias_rating: "centre" },
  { name: "Daily Mail", slug: "daily-mail", rss_url: "https://www.dailymail.co.uk/articles.rss", category: "uk-news", bias_rating: "right" },
  { name: "Mirror", slug: "mirror", rss_url: "https://www.mirror.co.uk/news/rss.xml", category: "uk-news", bias_rating: "centre-left" },
  { name: "Evening Standard", slug: "evening-standard", rss_url: "https://www.standard.co.uk/rss", category: "uk-news", bias_rating: "centre" },
  { name: "Metro", slug: "metro", rss_url: "https://metro.co.uk/feed/", category: "uk-news", bias_rating: "centre" },
  { name: "Financial Times", slug: "financial-times", rss_url: "https://www.ft.com/?format=rss", category: "uk-news", bias_rating: "centre" },

  // US News
  { name: "CNN", slug: "cnn", rss_url: "http://rss.cnn.com/rss/edition.rss", category: "us-news", bias_rating: "centre-left" },
  { name: "New York Times", slug: "nyt", rss_url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", category: "us-news", bias_rating: "centre-left" },
  { name: "Washington Post", slug: "washington-post", rss_url: "https://feeds.washingtonpost.com/rss/national", category: "us-news", bias_rating: "centre-left" },
  { name: "AP News", slug: "ap-news", rss_url: "https://apnews.com/index.rss", category: "us-news", bias_rating: "centre" },
  { name: "NPR", slug: "npr", rss_url: "https://feeds.npr.org/1001/rss.xml", category: "us-news", bias_rating: "centre-left" },
  { name: "Fox News", slug: "fox-news", rss_url: "https://moxie.foxnews.com/google-publisher/latest.xml", category: "us-news", bias_rating: "right" },
  { name: "Bloomberg", slug: "bloomberg", rss_url: "https://feeds.bloomberg.com/markets/news.rss", category: "us-news", bias_rating: "centre" },
  { name: "Wall Street Journal", slug: "wsj", rss_url: "https://feeds.a.dj.com/rss/RSSWorldNews.xml", category: "us-news", bias_rating: "centre-right" },

  // Tech
  { name: "TechCrunch", slug: "techcrunch", rss_url: "https://techcrunch.com/feed/", category: "tech", bias_rating: "centre" },
  { name: "The Verge", slug: "the-verge", rss_url: "https://www.theverge.com/rss/index.xml", category: "tech", bias_rating: "centre-left" },
  { name: "Ars Technica", slug: "ars-technica", rss_url: "https://feeds.arstechnica.com/arstechnica/index", category: "tech", bias_rating: "centre" },
  { name: "Wired", slug: "wired", rss_url: "https://www.wired.com/feed/rss", category: "tech", bias_rating: "centre-left" },
  { name: "Hacker News", slug: "hacker-news", rss_url: "https://hnrss.org/frontpage", category: "tech", bias_rating: "centre" },

  // Business
  { name: "Reuters", slug: "reuters", rss_url: "https://www.reuters.com/rssFeed/businessNews", category: "business", bias_rating: "centre" },
  { name: "CNBC", slug: "cnbc", rss_url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114", category: "business", bias_rating: "centre" },
  { name: "Forbes", slug: "forbes", rss_url: "https://www.forbes.com/innovation/feed2", category: "business", bias_rating: "centre-right" },

  // Science
  { name: "Nature", slug: "nature", rss_url: "https://www.nature.com/nature.rss", category: "science", bias_rating: "centre" },
  { name: "New Scientist", slug: "new-scientist", rss_url: "https://www.newscientist.com/feed/home/", category: "science", bias_rating: "centre" },
  { name: "Science Daily", slug: "science-daily", rss_url: "https://www.sciencedaily.com/rss/all.xml", category: "science", bias_rating: "centre" },

  // World
  { name: "Al Jazeera", slug: "al-jazeera", rss_url: "https://www.aljazeera.com/xml/rss/all.xml", category: "world", bias_rating: "centre-left" },
  { name: "BBC World", slug: "bbc-world", rss_url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "world", bias_rating: "centre" },
  { name: "France 24", slug: "france24", rss_url: "https://www.france24.com/en/rss", category: "world", bias_rating: "centre" },

  // Sports
  { name: "BBC Sport", slug: "bbc-sport", rss_url: "https://feeds.bbci.co.uk/sport/rss.xml", category: "sports", bias_rating: "centre" },
  { name: "ESPN", slug: "espn", rss_url: "https://www.espn.com/espn/rss/news", category: "sports", bias_rating: "centre" },
  { name: "Sky Sports", slug: "sky-sports", rss_url: "https://www.skysports.com/rss/12040", category: "sports", bias_rating: "centre" },
];

export const CATEGORIES = [
  { id: "uk-news", name: "UK News" },
  { id: "us-news", name: "US News" },
  { id: "tech", name: "Technology" },
  { id: "business", name: "Business" },
  { id: "science", name: "Science" },
  { id: "world", name: "World" },
  { id: "sports", name: "Sports" },
];

export const BIAS_LABELS: Record<string, { label: string; colour: string }> = {
  "left": { label: "Left", colour: "#3b82f6" },
  "centre-left": { label: "Centre-Left", colour: "#60a5fa" },
  "centre": { label: "Centre", colour: "#a78bfa" },
  "centre-right": { label: "Centre-Right", colour: "#f97316" },
  "right": { label: "Right", colour: "#ef4444" },
};
