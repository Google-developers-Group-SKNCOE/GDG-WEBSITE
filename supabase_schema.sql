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
  icon text default 'event',
  description text,
  tags text[],
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.events add column if not exists icon text default 'event';

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

-- 5. Comments Table
create table if not exists public.comments (
  id text primary key default gen_random_uuid(),
  author text not null,
  content text not null,
  approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. Row Level Security (RLS) Policies
-- PUBLIC: read-only
-- AUTHENTICATED (admin): full write access
-- ==============================================================================

-- Events
alter table public.events enable row level security;
create policy "Public read events"         on public.events for select using (true);
create policy "Auth insert events"         on public.events for insert with check (auth.role() = 'authenticated');
create policy "Auth update events"         on public.events for update using (auth.role() = 'authenticated');
create policy "Auth delete events"         on public.events for delete using (auth.role() = 'authenticated');

-- Resources
alter table public.resources enable row level security;
create policy "Public read resources"      on public.resources for select using (true);
create policy "Auth insert resources"      on public.resources for insert with check (auth.role() = 'authenticated');
create policy "Auth update resources"      on public.resources for update using (auth.role() = 'authenticated');
create policy "Auth delete resources"      on public.resources for delete using (auth.role() = 'authenticated');

-- Team
alter table public.team enable row level security;
create policy "Public read team"           on public.team for select using (true);
create policy "Auth insert team"           on public.team for insert with check (auth.role() = 'authenticated');
create policy "Auth update team"           on public.team for update using (auth.role() = 'authenticated');
create policy "Auth delete team"           on public.team for delete using (auth.role() = 'authenticated');

-- Sponsors
alter table public.sponsors enable row level security;
create policy "Public read sponsors"       on public.sponsors for select using (true);
create policy "Auth insert sponsors"       on public.sponsors for insert with check (auth.role() = 'authenticated');
create policy "Auth update sponsors"       on public.sponsors for update using (auth.role() = 'authenticated');
create policy "Auth delete sponsors"       on public.sponsors for delete using (auth.role() = 'authenticated');

-- Comments (public can submit, only auth can read/approve/delete)
alter table public.comments enable row level security;
create policy "Public submit comments"     on public.comments for insert with check (true);
create policy "Auth read comments"         on public.comments for select using (auth.role() = 'authenticated');
create policy "Auth update comments"       on public.comments for update using (auth.role() = 'authenticated');
create policy "Auth delete comments"       on public.comments for delete using (auth.role() = 'authenticated');

-- ==============================================================================
-- 7. Seed Initial Events & Resources (Runs once, safe if IDs exist)
-- ==============================================================================

insert into public.events (id, title, type, date, color, icon, description, tags)
values
  ('connecting-backend-engineering', 'Connecting To Backend Engineering', 'Workshop', 'Oct 13, 2026', 'bg-danger', 'terminal', 'Mastering Backend Engineering: An Interactive Workshop. Explore the essentials of backend engineering in ''Connecting to Backend Engineering.'' Participants learn web request processes, HTTP, APIs, databases, and tools like Redis, RabbitMQ, and Kafka for scalable applications.', array['HTTP/HTTPS', 'APIs', 'DB', 'Redis', 'Kafka']),
  ('synthera-2026', 'Synthera 2026', 'Flagship Event', 'Feb 23–25, 2026', 'bg-primary', 'rocket_launch', 'A 3-day collaborative mega-event uniting GDG SKNCOE, SCOE, and NBNSSOE. Workshops, hackathons, and speaker sessions across every tech domain.', array['Hackathon', 'Workshop', 'Networking', 'Multi-College']),
  ('cloud-study-jams-2025', 'Google Cloud Study Jams: Hands-on Workshop', 'Workshop', 'Oct 26, 2025', 'bg-primary', 'cloud', 'Hands-on Google Cloud workshop covering compute, storage, and ML APIs. Participants earned free Qwiklabs credits and cloud skill badges.', array['GCP', 'Qwiklabs', 'Cloud', 'Badges']),
  ('cyber-threat-2025', 'Cyber Threat Intelligence Workshop', 'Speaker Session', 'Oct 3, 2025', 'bg-danger', 'shield', 'An industry expert-led deep dive into threat hunting, OSINT, and defensive security strategies applicable in real-world SOC environments.', array['Cybersecurity', 'OSINT', 'Threat Intel', 'SOC']),
  ('orientation-2025', 'GDGoC Member Orientation 2025', 'Info Session', 'Sep 19, 2025', 'bg-warning', 'waving_hand', 'Welcome session for new members covering GDG On-Campus structure, how to get involved, domain overview, and upcoming event roadmap for the year.', array['Onboarding', 'Community', 'Roadmap']),
  ('flutterflow-2025', 'FlutterFlow Masterclass: Build Flutter Apps Without Code', 'Workshop', 'Mar 25, 2025', 'bg-success', 'smartphone', 'Build production-ready Flutter apps visually with no code required. Covered Firebase integration, responsive layouts, and deployment to the Play Store.', array['Flutter', 'FlutterFlow', 'Firebase', 'No-Code']),
  ('solution-series-2025', 'Solution Series Hackathon', 'Hackathon', 'Jan 27, 2025', 'bg-primary', 'emoji_events', 'A 24-hour hackathon challenging teams to solve real-world problems using Google technologies. Winners received cloud credits and mentorship opportunities.', array['Hackathon', '24hr', 'Google Tech', 'Prizes']),
  ('solutions-challenge-2024', 'Solutions Challenge Intro', 'Info Session', 'Dec 25, 2024', 'bg-primary', 'lightbulb', 'Introduction to Google Solutions Challenge — what it is, how to form a team, past winning ideas, and tips to build an impactful submission.', array['Solutions Challenge', 'Google', 'Ideation']),
  ('tech-winter-break-2024', 'Tech Winter Break', 'Workshop', 'Dec 6, 2024', 'bg-danger', 'ac_unit', 'A series of winter break workshops covering APIs, open-source contributions, and beginner-friendly projects to keep the momentum going.', array['APIs', 'Open Source', 'Projects', 'Beginner']),
  ('gen-ai-2024', 'Gen-AI in Action', 'Speaker Session', 'Oct 4, 2024', 'bg-success', 'psychology', 'Tools, techniques, and trends in Generative AI — covering prompt engineering, LLM APIs, Vertex AI, and responsible AI practices.', array['AI', 'ML', 'Gemini', 'Prompt Engineering'])
on conflict (id) do nothing;

insert into public.resources (id, event_id, label, icon, url)
values
  ('res-cbe-1', 'connecting-backend-engineering', 'Workshop Notes', 'article', 'https://gdg.community.dev'),
  ('res-cbe-2', 'connecting-backend-engineering', 'Resource Kit', 'folder_zip', 'https://github.com'),
  ('res-1', 'synthera-2026', 'Event Recap & Guide', 'article', 'https://gdg.community.dev'),
  ('res-2', 'synthera-2026', 'Photo Gallery', 'photo_library', 'https://photos.google.com'),
  ('res-3', 'cloud-study-jams-2025', 'Workshop Slides', 'slideshow', 'https://docs.google.com/presentation'),
  ('res-3b', 'cloud-study-jams-2025', 'Lab Guide', 'menu_book', 'https://cloud.google.com'),
  ('res-3c', 'cloud-study-jams-2025', 'Recording', 'videocam', 'https://youtube.com'),
  ('res-4', 'cyber-threat-2025', 'Slides', 'slideshow', 'https://docs.google.com/presentation'),
  ('res-4b', 'cyber-threat-2025', 'Resource Kit & OSINT Tools', 'folder_zip', 'https://github.com'),
  ('res-5', 'orientation-2025', 'Presentation Slides', 'slideshow', 'https://docs.google.com/presentation'),
  ('res-5b', 'orientation-2025', 'Orientation Recording', 'videocam', 'https://youtube.com'),
  ('res-6', 'flutterflow-2025', 'Slides', 'slideshow', 'https://docs.google.com/presentation'),
  ('res-6b', 'flutterflow-2025', 'Starter Project', 'code', 'https://github.com'),
  ('res-6c', 'flutterflow-2025', 'Recording', 'videocam', 'https://youtube.com'),
  ('res-7', 'solution-series-2025', 'Problem Statements', 'assignment', 'https://gdg.community.dev'),
  ('res-7b', 'solution-series-2025', 'Winning Projects', 'emoji_events', 'https://github.com'),
  ('res-8', 'solutions-challenge-2024', 'Intro Slides', 'slideshow', 'https://docs.google.com/presentation'),
  ('res-9', 'tech-winter-break-2024', 'Workshop Notes', 'article', 'https://gdg.community.dev'),
  ('res-10', 'gen-ai-2024', 'Slides', 'slideshow', 'https://docs.google.com/presentation'),
  ('res-10b', 'gen-ai-2024', 'Recording', 'videocam', 'https://youtube.com')
on conflict (id) do nothing;

-- ==============================================================================
-- STORAGE BUCKET SETUP:
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Click "New Bucket", name it: gdg-media
-- 3. Toggle "Public bucket" to ON
-- 4. Click Save
-- NOTE: Add a storage policy to restrict uploads to authenticated users only:
--   Policy: authenticated users can upload (INSERT) to gdg-media
-- ==============================================================================
