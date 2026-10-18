-- Run this after the main schema.sql
-- Adds: Resources, Community Comments, Likes, Replies, OTP verification

-- Resources table (photos, videos, PPTs per event)
create table if not exists resources (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  name text not null,
  link text not null,
  type text not null default 'link',
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- Comments table
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  name text not null,
  email text not null,
  comment text not null,
  image_url text,
  is_verified boolean default false,
  is_moderated boolean default false,
  parent_id uuid references comments(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Likes table
create table if not exists comment_likes (
  id uuid primary key default uuid_generate_v4(),
  comment_id uuid references comments(id) on delete cascade,
  user_email text not null,
  created_at timestamp with time zone default now()
);

-- OTP table for email verification
create table if not exists email_otps (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  otp text not null,
  expires_at timestamp with time zone not null,
  verified boolean default false,
  created_at timestamp with time zone default now()
);

-- Disable RLS for public access
alter table resources disable row level security;
alter table comments disable row level security;
alter table comment_likes disable row level security;
alter table email_otps disable row level security;

-- Add unique constraints
do $$ begin alter table comment_likes add constraint comment_likes_unique unique (comment_id, user_email); exception when duplicate_object then null; end $$;
do $$ begin alter table email_otps add constraint email_otps_unique unique (email, otp); exception when duplicate_object then null; end $$;

-- Add admin policies
drop policy if exists "Allow anon write access" on resources;
drop policy if exists "Allow anon write access" on comments;
drop policy if exists "Allow anon write access" on comment_likes;
drop policy if exists "Allow anon write access" on email_otps;

create policy "Allow anon write access" on resources for all using (true) with check (true);
create policy "Allow anon write access" on comments for all using (true) with check (true);
create policy "Allow anon write access" on comment_likes for all using (true) with check (true);
create policy "Allow anon write access" on email_otps for all using (true) with check (true);

-- Insert sample resources
insert into resources (event_id, name, link, type, sort_order)
select id, 'Event Photos', 'https://photos.google.com/gdg-skncoe-event', 'photos', 1 from events where year = 2026 limit 1
on conflict do nothing;
