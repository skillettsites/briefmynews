-- Add geo tracking columns to bmn_waitlist table
-- Populated from Vercel IP headers (x-vercel-ip-city, x-vercel-ip-country-region, x-vercel-ip-country)

ALTER TABLE bmn_waitlist ADD COLUMN IF NOT EXISTS geo_city text;
ALTER TABLE bmn_waitlist ADD COLUMN IF NOT EXISTS geo_region text;
ALTER TABLE bmn_waitlist ADD COLUMN IF NOT EXISTS geo_country text;

-- Index for geographic analysis
CREATE INDEX IF NOT EXISTS idx_bmn_waitlist_geo_country ON bmn_waitlist(geo_country);
