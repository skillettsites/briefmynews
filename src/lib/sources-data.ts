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

  // Alternative / Independent
  { name: "Reddit - World News", slug: "reddit-worldnews", rss_url: "https://www.reddit.com/r/worldnews/.rss", category: "alternative", bias_rating: "centre" },
  { name: "Reddit - News", slug: "reddit-news", rss_url: "https://www.reddit.com/r/news/.rss", category: "alternative", bias_rating: "centre" },
  { name: "Reddit - Technology", slug: "reddit-technology", rss_url: "https://www.reddit.com/r/technology/.rss", category: "alternative", bias_rating: "centre" },
  { name: "Reddit - Science", slug: "reddit-science", rss_url: "https://www.reddit.com/r/science/.rss", category: "alternative", bias_rating: "centre" },
  { name: "Reddit - UK Politics", slug: "reddit-ukpolitics", rss_url: "https://www.reddit.com/r/ukpolitics/.rss", category: "alternative", bias_rating: "centre" },
  { name: "Substack - Top", slug: "substack-top", rss_url: "https://substack.com/feed", category: "alternative", bias_rating: "centre" },
  { name: "Ground News", slug: "ground-news", rss_url: "https://ground.news/feed", category: "alternative", bias_rating: "centre" },
  { name: "The Intercept", slug: "the-intercept", rss_url: "https://theintercept.com/feed/?rss", category: "alternative", bias_rating: "left" },
  { name: "Bellingcat", slug: "bellingcat", rss_url: "https://www.bellingcat.com/feed/", category: "alternative", bias_rating: "centre" },
  { name: "The Canary", slug: "the-canary", rss_url: "https://www.thecanary.co/feed/", category: "alternative", bias_rating: "left" },
  { name: "Novara Media", slug: "novara-media", rss_url: "https://novaramedia.com/feed/", category: "alternative", bias_rating: "left" },
  { name: "Guido Fawkes", slug: "guido-fawkes", rss_url: "https://order-order.com/feed/", category: "alternative", bias_rating: "right" },
  { name: "Spiked", slug: "spiked-online", rss_url: "https://www.spiked-online.com/feed/", category: "alternative", bias_rating: "right" },
  { name: "UnHerd", slug: "unherd", rss_url: "https://unherd.com/feed/", category: "alternative", bias_rating: "centre-right" },
  { name: "Tortoise Media", slug: "tortoise", rss_url: "https://www.tortoisemedia.com/feed/", category: "alternative", bias_rating: "centre" },
  { name: "Byline Times", slug: "byline-times", rss_url: "https://bylinetimes.com/feed/", category: "alternative", bias_rating: "centre-left" },
  { name: "The Conversation", slug: "the-conversation", rss_url: "https://theconversation.com/uk/articles.atom", category: "alternative", bias_rating: "centre" },
  { name: "ProPublica", slug: "propublica", rss_url: "https://feeds.propublica.org/propublica/main", category: "alternative", bias_rating: "centre-left" },
  { name: "Drudge Report", slug: "drudge-report", rss_url: "https://feedpress.me/drudgereportfeed", category: "alternative", bias_rating: "right" },
  { name: "GB News", slug: "gb-news", rss_url: "https://www.gbnews.com/feeds/rss", category: "alternative", bias_rating: "right" },
  { name: "LBC", slug: "lbc", rss_url: "https://feeds.acast.com/public/shows/lbc-breaking-news", category: "alternative", bias_rating: "centre" },
  { name: "PoliticsJOE", slug: "politicsjoe", rss_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCE_M8A5yxnLfW0KghEeajjw", category: "alternative", bias_rating: "centre-left" },
  { name: "TalkTV", slug: "talktv", rss_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCUhby7V0mYbHaBGqsEAXEmA", category: "alternative", bias_rating: "right" },

  // Podcasts
  { name: "BBC Newscast", slug: "bbc-newscast", rss_url: "https://podcasts.files.bbci.co.uk/p09bnmxp.rss", category: "podcasts", bias_rating: "centre" },
  { name: "The Rest Is Politics", slug: "rest-is-politics", rss_url: "https://feeds.megaphone.fm/therestispolitics", category: "podcasts", bias_rating: "centre" },
  { name: "Full Disclosure (James O'Brien)", slug: "full-disclosure", rss_url: "https://feeds.acast.com/public/shows/full-disclosure-with-james-obrien", category: "podcasts", bias_rating: "centre-left" },
  { name: "Joe Rogan", slug: "joe-rogan", rss_url: "https://feeds.megaphone.fm/GLT1412515089", category: "podcasts", bias_rating: "centre-right" },
];

export const CATEGORIES = [
  { id: "uk-news", name: "UK News" },
  { id: "us-news", name: "US News" },
  { id: "tech", name: "Technology" },
  { id: "business", name: "Business" },
  { id: "science", name: "Science" },
  { id: "world", name: "World" },
  { id: "sports", name: "Sports" },
  { id: "alternative", name: "Alternative / Independent" },
  { id: "podcasts", name: "Podcasts" },
];

export const BIAS_LABELS: Record<string, { label: string; colour: string }> = {
  "left": { label: "Left", colour: "#3b82f6" },
  "centre-left": { label: "Centre-Left", colour: "#60a5fa" },
  "centre": { label: "Centre", colour: "#a78bfa" },
  "centre-right": { label: "Centre-Right", colour: "#f97316" },
  "right": { label: "Right", colour: "#ef4444" },
};
