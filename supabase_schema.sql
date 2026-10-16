-- ==============================================================================
-- GDG SKNCOE Website - Supabase Database Schema
-- Run this script in your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Events Table
create table if not exists public.events (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  type text not null,
  date text not null,
  color text default 'bg-primary',
  description text,
  tags text[],
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Resources Table
create table if not exists public.resources (
  id text primary key default gen_random_uuid()::text,
  event_id text references public.events(id) on delete cascade,
  label text not null,
  icon text default 'slideshow',
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Core Team Table
create table if not exists public.team (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  roleTag text not null,
  roleColor text default 'bg-primary',
  category text default 'Lead',
  image text,
  linkedin text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Sponsors Table
create table if not exists public.sponsors (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  tier text default 'Community Partner',
  logo text,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Community Comments Table
create table if not exists public.comments (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  "eventRef" text default 'General',
  "eventId" text default 'General',
  message text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()),
  "createdAt" timestamp with time zone default timezone('utc'::text, now()),
  likes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Row Level Security (RLS) Policies
alter table public.events enable row level security;
drop policy if exists "Allow public read on events" on public.events;
drop policy if exists "Allow all operations on events" on public.events;
drop policy if exists "Allow authenticated write on events" on public.events;
create policy "Allow public read on events" on public.events for select using (true);
create policy "Allow authenticated write on events" on public.events for all to authenticated using (true) with check (true);

alter table public.resources enable row level security;
drop policy if exists "Allow public read on resources" on public.resources;
drop policy if exists "Allow all operations on resources" on public.resources;
drop policy if exists "Allow authenticated write on resources" on public.resources;
create policy "Allow public read on resources" on public.resources for select using (true);
create policy "Allow authenticated write on resources" on public.resources for all to authenticated using (true) with check (true);

alter table public.team enable row level security;
drop policy if exists "Allow public read on team" on public.team;
drop policy if exists "Allow all operations on team" on public.team;
drop policy if exists "Allow authenticated write on team" on public.team;
create policy "Allow public read on team" on public.team for select using (true);
create policy "Allow authenticated write on team" on public.team for all to authenticated using (true) with check (true);

alter table public.sponsors enable row level security;
drop policy if exists "Allow public read on sponsors" on public.sponsors;
drop policy if exists "Allow all operations on sponsors" on public.sponsors;
drop policy if exists "Allow authenticated write on sponsors" on public.sponsors;
create policy "Allow public read on sponsors" on public.sponsors for select using (true);
create policy "Allow authenticated write on sponsors" on public.sponsors for all to authenticated using (true) with check (true);

alter table public.comments enable row level security;
drop policy if exists "Allow public read on comments" on public.comments;
drop policy if exists "Allow public insert on comments" on public.comments;
drop policy if exists "Allow public update on comments" on public.comments;
drop policy if exists "Allow authenticated moderation on comments" on public.comments;
create policy "Allow public read on comments" on public.comments for select using (true);
create policy "Allow public insert on comments" on public.comments for insert with check (true);
create policy "Allow public update on comments" on public.comments for update using (true) with check (true);
create policy "Allow authenticated delete on comments" on public.comments for delete to authenticated using (true);

-- ==============================================================================
-- STORAGE BUCKET SETUP:
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Click "New Bucket", name it: gdg-media
-- 3. Toggle "Public bucket" to ON
-- 4. Click Save
-- ==============================================================================
