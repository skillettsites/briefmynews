-- BriefMyNews Database Schema
-- Run this in Supabase SQL Editor
-- All tables prefixed with bmn_ to avoid clashes with other projects on shared instance

-- Users extended profile
create table if not exists bmn_profiles (
  id uuid references auth.users primary key,
  display_name text,
  political_lean text default 'centre',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- News sources
create table if not exists bmn_sources (
  id serial primary key,
  name text not null,
  slug text unique not null,
  rss_url text not null,
  category text not null,
  bias_rating text default 'centre',
  is_free boolean default true,
  logo_url text,
  created_at timestamptz default now()
);

-- User source preferences
create table if not exists bmn_user_sources (
  id serial primary key,
  user_id uuid references auth.users not null,
  source_id integer references bmn_sources not null,
  enabled boolean default true,
  unique(user_id, source_id)
);

-- User topics
create table if not exists bmn_user_topics (
  id serial primary key,
  user_id uuid references auth.users not null,
  topic text not null,
  frequency text default 'weekly',
  created_at timestamptz default now()
);

-- Cached articles
create table if not exists bmn_articles (
  id serial primary key,
  source_id integer references bmn_sources not null,
  title text not null,
  url text unique not null,
  description text,
  full_text text,
  summary text,
  published_at timestamptz,
  fetched_at timestamptz default now()
);

-- Sent digests log
create table if not exists bmn_digests (
  id serial primary key,
  user_id uuid references auth.users not null,
  topic text,
  sent_at timestamptz default now(),
  article_count integer,
  email_id text
);

-- Waitlist
create table if not exists bmn_waitlist (
  id serial primary key,
  email text unique not null,
  source text default 'website',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_bmn_articles_source_id on bmn_articles(source_id);
create index if not exists idx_bmn_articles_published_at on bmn_articles(published_at desc);
create index if not exists idx_bmn_user_topics_user_id on bmn_user_topics(user_id);
create index if not exists idx_bmn_user_sources_user_id on bmn_user_sources(user_id);
create index if not exists idx_bmn_digests_user_id on bmn_digests(user_id);
create index if not exists idx_bmn_waitlist_email on bmn_waitlist(email);

-- RLS policies
alter table bmn_profiles enable row level security;
alter table bmn_user_sources enable row level security;
alter table bmn_user_topics enable row level security;
alter table bmn_digests enable row level security;
alter table bmn_waitlist enable row level security;

-- Profiles: users can read/update their own
create policy "BMN users can view own profile" on bmn_profiles for select using (auth.uid() = id);
create policy "BMN users can update own profile" on bmn_profiles for update using (auth.uid() = id);
create policy "BMN users can insert own profile" on bmn_profiles for insert with check (auth.uid() = id);

-- User sources: users can manage their own
create policy "BMN users can view own sources" on bmn_user_sources for select using (auth.uid() = user_id);
create policy "BMN users can insert own sources" on bmn_user_sources for insert with check (auth.uid() = user_id);
create policy "BMN users can update own sources" on bmn_user_sources for update using (auth.uid() = user_id);
create policy "BMN users can delete own sources" on bmn_user_sources for delete using (auth.uid() = user_id);

-- User topics: users can manage their own
create policy "BMN users can view own topics" on bmn_user_topics for select using (auth.uid() = user_id);
create policy "BMN users can insert own topics" on bmn_user_topics for insert with check (auth.uid() = user_id);
create policy "BMN users can update own topics" on bmn_user_topics for update using (auth.uid() = user_id);
create policy "BMN users can delete own topics" on bmn_user_topics for delete using (auth.uid() = user_id);

-- Digests: users can view their own
create policy "BMN users can view own digests" on bmn_digests for select using (auth.uid() = user_id);

-- Waitlist: anyone can insert (public signup)
create policy "BMN anyone can join waitlist" on bmn_waitlist for insert with check (true);

-- Sources table: public read
alter table bmn_sources enable row level security;
create policy "BMN anyone can view sources" on bmn_sources for select using (true);

-- Articles table: public read
alter table bmn_articles enable row level security;
create policy "BMN anyone can view articles" on bmn_articles for select using (true);
