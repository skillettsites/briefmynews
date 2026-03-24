-- BriefMyNews Database Schema
-- Run this in Supabase SQL Editor

-- Users extended profile
create table if not exists profiles (
  id uuid references auth.users primary key,
  display_name text,
  political_lean text default 'centre',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- News sources
create table if not exists sources (
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
create table if not exists user_sources (
  id serial primary key,
  user_id uuid references auth.users not null,
  source_id integer references sources not null,
  enabled boolean default true,
  unique(user_id, source_id)
);

-- User topics
create table if not exists user_topics (
  id serial primary key,
  user_id uuid references auth.users not null,
  topic text not null,
  frequency text default 'weekly',
  created_at timestamptz default now()
);

-- Cached articles
create table if not exists articles (
  id serial primary key,
  source_id integer references sources not null,
  title text not null,
  url text unique not null,
  description text,
  full_text text,
  summary text,
  published_at timestamptz,
  fetched_at timestamptz default now()
);

-- Sent digests log
create table if not exists digests (
  id serial primary key,
  user_id uuid references auth.users not null,
  topic text,
  sent_at timestamptz default now(),
  article_count integer,
  email_id text
);

-- Waitlist
create table if not exists waitlist (
  id serial primary key,
  email text unique not null,
  source text default 'website',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_articles_source_id on articles(source_id);
create index if not exists idx_articles_published_at on articles(published_at desc);
create index if not exists idx_user_topics_user_id on user_topics(user_id);
create index if not exists idx_user_sources_user_id on user_sources(user_id);
create index if not exists idx_digests_user_id on digests(user_id);
create index if not exists idx_waitlist_email on waitlist(email);

-- RLS policies
alter table profiles enable row level security;
alter table user_sources enable row level security;
alter table user_topics enable row level security;
alter table digests enable row level security;
alter table waitlist enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- User sources: users can manage their own
create policy "Users can view own sources" on user_sources for select using (auth.uid() = user_id);
create policy "Users can insert own sources" on user_sources for insert with check (auth.uid() = user_id);
create policy "Users can update own sources" on user_sources for update using (auth.uid() = user_id);
create policy "Users can delete own sources" on user_sources for delete using (auth.uid() = user_id);

-- User topics: users can manage their own
create policy "Users can view own topics" on user_topics for select using (auth.uid() = user_id);
create policy "Users can insert own topics" on user_topics for insert with check (auth.uid() = user_id);
create policy "Users can update own topics" on user_topics for update using (auth.uid() = user_id);
create policy "Users can delete own topics" on user_topics for delete using (auth.uid() = user_id);

-- Digests: users can view their own
create policy "Users can view own digests" on digests for select using (auth.uid() = user_id);

-- Waitlist: anyone can insert (public signup)
create policy "Anyone can join waitlist" on waitlist for insert with check (true);

-- Sources table: public read
alter table sources enable row level security;
create policy "Anyone can view sources" on sources for select using (true);

-- Articles table: public read
alter table articles enable row level security;
create policy "Anyone can view articles" on articles for select using (true);
