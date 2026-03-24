-- BriefMyNews Seed Data: News Sources
-- Run this AFTER the schema migration

INSERT INTO bmn_sources (name, slug, rss_url, category, bias_rating) VALUES
-- UK News
('BBC News', 'bbc-news', 'https://feeds.bbci.co.uk/news/rss.xml', 'uk-news', 'centre'),
('The Guardian', 'guardian', 'https://www.theguardian.com/uk/rss', 'uk-news', 'centre-left'),
('The Telegraph', 'telegraph', 'https://www.telegraph.co.uk/rss.xml', 'uk-news', 'centre-right'),
('The Independent', 'independent', 'https://www.independent.co.uk/news/uk/rss', 'uk-news', 'centre-left'),
('Sky News', 'sky-news', 'https://feeds.skynews.com/feeds/rss/uk.xml', 'uk-news', 'centre'),
('ITV News', 'itv-news', 'https://www.itv.com/news/rss.xml', 'uk-news', 'centre'),
('Daily Mail', 'daily-mail', 'https://www.dailymail.co.uk/articles.rss', 'uk-news', 'right'),
('Mirror', 'mirror', 'https://www.mirror.co.uk/news/rss.xml', 'uk-news', 'centre-left'),
('Evening Standard', 'evening-standard', 'https://www.standard.co.uk/rss', 'uk-news', 'centre'),
('Metro', 'metro', 'https://metro.co.uk/feed/', 'uk-news', 'centre'),
('Financial Times', 'financial-times', 'https://www.ft.com/?format=rss', 'uk-news', 'centre'),
-- US News
('CNN', 'cnn', 'http://rss.cnn.com/rss/edition.rss', 'us-news', 'centre-left'),
('New York Times', 'nyt', 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', 'us-news', 'centre-left'),
('Washington Post', 'washington-post', 'https://feeds.washingtonpost.com/rss/national', 'us-news', 'centre-left'),
('AP News', 'ap-news', 'https://apnews.com/index.rss', 'us-news', 'centre'),
('NPR', 'npr', 'https://feeds.npr.org/1001/rss.xml', 'us-news', 'centre-left'),
('Fox News', 'fox-news', 'https://moxie.foxnews.com/google-publisher/latest.xml', 'us-news', 'right'),
('Bloomberg', 'bloomberg', 'https://feeds.bloomberg.com/markets/news.rss', 'us-news', 'centre'),
('Wall Street Journal', 'wsj', 'https://feeds.a.dj.com/rss/RSSWorldNews.xml', 'us-news', 'centre-right'),
-- Tech
('TechCrunch', 'techcrunch', 'https://techcrunch.com/feed/', 'tech', 'centre'),
('The Verge', 'the-verge', 'https://www.theverge.com/rss/index.xml', 'tech', 'centre-left'),
('Ars Technica', 'ars-technica', 'https://feeds.arstechnica.com/arstechnica/index', 'tech', 'centre'),
('Wired', 'wired', 'https://www.wired.com/feed/rss', 'tech', 'centre-left'),
('Hacker News', 'hacker-news', 'https://hnrss.org/frontpage', 'tech', 'centre'),
-- Business
('Reuters', 'reuters', 'https://www.reuters.com/rssFeed/businessNews', 'business', 'centre'),
('CNBC', 'cnbc', 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', 'business', 'centre'),
('Forbes', 'forbes', 'https://www.forbes.com/innovation/feed2', 'business', 'centre-right'),
-- Science
('Nature', 'nature', 'https://www.nature.com/nature.rss', 'science', 'centre'),
('New Scientist', 'new-scientist', 'https://www.newscientist.com/feed/home/', 'science', 'centre'),
('Science Daily', 'science-daily', 'https://www.sciencedaily.com/rss/all.xml', 'science', 'centre'),
-- World
('Al Jazeera', 'al-jazeera', 'https://www.aljazeera.com/xml/rss/all.xml', 'world', 'centre-left'),
('BBC World', 'bbc-world', 'https://feeds.bbci.co.uk/news/world/rss.xml', 'world', 'centre'),
('France 24', 'france24', 'https://www.france24.com/en/rss', 'world', 'centre'),
-- Sports
('BBC Sport', 'bbc-sport', 'https://feeds.bbci.co.uk/sport/rss.xml', 'sports', 'centre'),
('ESPN', 'espn', 'https://www.espn.com/espn/rss/news', 'sports', 'centre'),
('Sky Sports', 'sky-sports', 'https://www.skysports.com/rss/12040', 'sports', 'centre')
ON CONFLICT (slug) DO NOTHING;
