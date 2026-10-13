-- ==============================================================================
-- GDG SKNCOE Website - Supabase Database Schema
-- Run this script in your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Events Table
create table if not exists public.events (
  id text primary key default gen_random_uuid(),
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
  id text primary key default gen_random_uuid(),
  event_id text references public.events(id) on delete cascade,
  label text not null,
  icon text default 'slideshow',
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Core Team Table
create table if not exists public.team (
  id text primary key default gen_random_uuid(),
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
  id text primary key default gen_random_uuid(),
  name text not null,
  tier text default 'Community Partner',
  logo text,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Row Level Security (RLS) Policies
alter table public.events enable row level security;
create policy "Allow public read on events" on public.events for select using (true);
create policy "Allow all operations on events" on public.events for all using (true);

alter table public.resources enable row level security;
create policy "Allow public read on resources" on public.resources for select using (true);
create policy "Allow all operations on resources" on public.resources for all using (true);

alter table public.team enable row level security;
create policy "Allow public read on team" on public.team for select using (true);
create policy "Allow all operations on team" on public.team for all using (true);

alter table public.sponsors enable row level security;
create policy "Allow public read on sponsors" on public.sponsors for select using (true);
create policy "Allow all operations on sponsors" on public.sponsors for all using (true);

-- ==============================================================================
-- STORAGE BUCKET SETUP:
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Click "New Bucket", name it: gdg-media
-- 3. Toggle "Public bucket" to ON
-- 4. Click Save
-- ==============================================================================
