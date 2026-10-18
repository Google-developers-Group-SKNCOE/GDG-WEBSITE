-- GDG SKNCOE Admin Panel Database Schema
-- Fully idempotent - safe to run multiple times

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  name text not null default 'Admin',
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text,
  label text,
  category text default 'general',
  updated_at timestamp with time zone default now()
);

create table if not exists hero_content (
  id uuid primary key default uuid_generate_v4(),
  section text not null default 'home',
  headline text not null,
  subtitle text,
  cta_primary_label text,
  cta_primary_url text,
  cta_secondary_label text,
  cta_secondary_url text,
  updated_at timestamp with time zone default now()
);

create table if not exists about_content (
  id uuid primary key default uuid_generate_v4(),
  section text not null,
  heading text not null,
  body text not null,
  icon text,
  sort_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists domains (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text,
  sort_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  date text not null,
  year integer not null,
  type text not null,
  title text not null,
  description text,
  color text default '#4285F4',
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  badge text,
  image_url text,
  demo_url text,
  tags text[] default '{}',
  contributors text[] default '{}',
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  category text not null default 'lead',
  domain text,
  photo_url text,
  linkedin_url text,
  email text,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists sponsors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text not null,
  website_url text,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  sort_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists nav_links (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  url text not null,
  type text default 'internal',
  sort_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  url text not null,
  icon text,
  sort_order integer default 0,
  updated_at timestamp with time zone default now()
);

create table if not exists contact_info (
  id uuid primary key default uuid_generate_v4(),
  address text,
  email text,
  map_embed_url text,
  location_badge text,
  updated_at timestamp with time zone default now()
);

-- Add unique constraints (idempotent)
do $$ begin alter table nav_links add constraint nav_links_unique unique (label, url, type); exception when duplicate_object then null; end $$;
do $$ begin alter table hero_content add constraint hero_section_unique unique (section); exception when duplicate_object then null; end $$;
do $$ begin alter table about_content add constraint about_section_unique unique (section, heading); exception when duplicate_object then null; end $$;
do $$ begin alter table domains add constraint domains_name_unique unique (name); exception when duplicate_object then null; end $$;
do $$ begin alter table events add constraint events_unique unique (title, date, year); exception when duplicate_object then null; end $$;
do $$ begin alter table projects add constraint projects_title_unique unique (title); exception when duplicate_object then null; end $$;
do $$ begin alter table team_members add constraint team_unique unique (name, role); exception when duplicate_object then null; end $$;
do $$ begin alter table sponsors add constraint sponsors_unique unique (name, logo_url); exception when duplicate_object then null; end $$;
do $$ begin alter table faqs add constraint faqs_question_unique unique (question); exception when duplicate_object then null; end $$;
do $$ begin alter table social_links add constraint social_unique unique (platform); exception when duplicate_object then null; end $$;

-- Enable RLS
alter table admin_users enable row level security;
alter table site_settings enable row level security;
alter table hero_content enable row level security;
alter table about_content enable row level security;
alter table domains enable row level security;
alter table events enable row level security;
alter table projects enable row level security;
alter table team_members enable row level security;
alter table sponsors enable row level security;
alter table faqs enable row level security;
alter table nav_links enable row level security;
alter table social_links enable row level security;
alter table contact_info enable row level security;

-- Policies (drop first, then create)
drop policy if exists "Allow public read access" on site_settings;
drop policy if exists "Allow public read access" on hero_content;
drop policy if exists "Allow public read access" on about_content;
drop policy if exists "Allow public read access" on domains;
drop policy if exists "Allow public read access" on events;
drop policy if exists "Allow public read access" on projects;
drop policy if exists "Allow public read access" on team_members;
drop policy if exists "Allow public read access" on sponsors;
drop policy if exists "Allow public read access" on faqs;
drop policy if exists "Allow public read access" on nav_links;
drop policy if exists "Allow public read access" on social_links;
drop policy if exists "Allow public read access" on contact_info;

drop policy if exists "Allow authenticated write access" on site_settings;
drop policy if exists "Allow authenticated write access" on hero_content;
drop policy if exists "Allow authenticated write access" on about_content;
drop policy if exists "Allow authenticated write access" on domains;
drop policy if exists "Allow authenticated write access" on events;
drop policy if exists "Allow authenticated write access" on projects;
drop policy if exists "Allow authenticated write access" on team_members;
drop policy if exists "Allow authenticated write access" on sponsors;
drop policy if exists "Allow authenticated write access" on faqs;
drop policy if exists "Allow authenticated write access" on nav_links;
drop policy if exists "Allow authenticated write access" on social_links;
drop policy if exists "Allow authenticated write access" on contact_info;

create policy "Allow public read access" on site_settings for select using (true);
create policy "Allow public read access" on hero_content for select using (true);
create policy "Allow public read access" on about_content for select using (true);
create policy "Allow public read access" on domains for select using (true);
create policy "Allow public read access" on events for select using (true);
create policy "Allow public read access" on projects for select using (true);
create policy "Allow public read access" on team_members for select using (true);
create policy "Allow public read access" on sponsors for select using (true);
create policy "Allow public read access" on faqs for select using (true);
create policy "Allow public read access" on nav_links for select using (true);
create policy "Allow public read access" on social_links for select using (true);
create policy "Allow public read access" on contact_info for select using (true);

create policy "Allow anon write access" on site_settings for all using (true) with check (true);
create policy "Allow anon write access" on hero_content for all using (true) with check (true);
create policy "Allow anon write access" on about_content for all using (true) with check (true);
create policy "Allow anon write access" on domains for all using (true) with check (true);
create policy "Allow anon write access" on events for all using (true) with check (true);
create policy "Allow anon write access" on projects for all using (true) with check (true);
create policy "Allow anon write access" on team_members for all using (true) with check (true);
create policy "Allow anon write access" on sponsors for all using (true) with check (true);
create policy "Allow anon write access" on faqs for all using (true) with check (true);
create policy "Allow anon write access" on nav_links for all using (true) with check (true);
create policy "Allow anon write access" on social_links for all using (true) with check (true);
create policy "Allow anon write access" on contact_info for all using (true) with check (true);

-- Clean up duplicates before inserting (keep first by created order)
DELETE FROM nav_links a USING nav_links b WHERE a.id > b.id AND a.label = b.label AND a.url = b.url AND a.type = b.type;
DELETE FROM hero_content a USING hero_content b WHERE a.id > b.id AND a.section = b.section;
DELETE FROM about_content a USING about_content b WHERE a.id > b.id AND a.section = b.section AND a.heading = b.heading;
DELETE FROM domains a USING domains b WHERE a.id > b.id AND a.name = b.name;
DELETE FROM events a USING events b WHERE a.id > b.id AND a.title = b.title AND a.date = b.date AND a.year = b.year;
DELETE FROM projects a USING projects b WHERE a.id > b.id AND a.title = b.title;
DELETE FROM team_members a USING team_members b WHERE a.id > b.id AND a.name = b.name AND a.role = b.role;
DELETE FROM sponsors a USING sponsors b WHERE a.id > b.id AND a.name = b.name AND a.logo_url = b.logo_url;
DELETE FROM faqs a USING faqs b WHERE a.id > b.id AND a.question = b.question;
DELETE FROM social_links a USING social_links b WHERE a.id > b.id AND a.platform = b.platform;

-- Insert default data
insert into hero_content (section, headline, subtitle, cta_primary_label, cta_primary_url, cta_secondary_label, cta_secondary_url)
values (
  'home',
  'Empowering Innovators',
  'Google Developer Groups On-Campus at SKNCOE is where technical excellence meets collaborative spirit. Join 500+ students building the future.',
  'Explore Events',
  '/events',
  'Qubit For Quiz',
  'https://qubit-live.vercel.app/'
) on conflict do nothing;

insert into about_content (section, heading, body, sort_order)
values
  ('mission', 'Our Mission', 'To bridge the gap between academic theory and industry practice. We provide SKNCOE developers with access to Google''s cutting-edge technologies, fostering an environment where curiosity thrives and real-world impact is the benchmark.', 1),
  ('principles', 'Core Principles', 'We value radically open collaboration. Our community is built on the belief that technology should be accessible, inclusive, and built ethically. We don''t just write code; we cultivate a culture of shared growth and mentorship.', 2)
on conflict do nothing;

insert into domains (name, icon, sort_order)
values
  ('Web Development', 'html', 1),
  ('App Development', 'smartphone', 2),
  ('Cloud Computing', 'cloud', 3),
  ('Cybersecurity', 'shield', 4),
  ('Comp. Programming', 'terminal', 5),
  ('UI/UX Design', 'palette', 6),
  ('Social media', 'alternate_email', 7),
  ('Events Ops', 'calendar_today', 8),
  ('WIT Community', 'diversity_2', 9),
  ('AI / ML', 'psychology', 10),
  ('Sponsorship', 'emoji', 11),
  ('Wanna Join Us ?', 'emoji', 12)
on conflict do nothing;

insert into events (date, year, type, title, color, sort_order)
values
  ('February 23-25, 2026', 2026, 'Flagship Event - Synthera', '3 days collaborative event of GDG SKNCOE, SCOE, NBNSSOE', '#4285F4', 1),
  ('October 26, 2025', 2025, 'Workshop / Study Group', 'Google Cloud Study Jams: Hands-on Workshop', '#34A853', 1),
  ('October 3, 2025', 2025, 'Speaker Session / Tech Talk', 'Cyber Threat Intelligence Workshop', '#EA4335', 2),
  ('September 19, 2025', 2025, 'Info Session', 'GDGoC Member Orientation 2025', '#FBBC04', 3),
  ('March 25, 2025', 2025, 'Workshop / Study Group', 'FlutterFlow Masterclass: Build Flutter Apps Without Code', '#4285F4', 4),
  ('Jan 27, 2025', 2025, 'Hackathon', 'Solution Series', '#34A853', 5),
  ('Dec 25, 2024', 2024, 'Info Session', 'Tech Winter Break Introduction to Solutions Challenge', '#EA4335', 1),
  ('Dec 6, 2024', 2024, 'Workshop / Study Group', 'Tech Winter Break -- GDG On Campus SKNCOE', '#4285F4', 2),
  ('Nov 14, 2024', 2024, 'Conference', 'GDG Orientation: Welcome to the Community!', '#FBBC04', 3),
  ('Oct 4, 2024', 2024, 'Info Session', 'Gen-AI in Action: Tools, Techniques, and Trends', '#34A853', 4)
on conflict do nothing;

insert into projects (title, description, badge, demo_url, tags, featured, sort_order)
values
  ('Project Sentinel: Campus Hub', 'An automated campus monitoring system utilizing TensorFlow and Google Cloud Platform to optimize student facility usage in real-time.', 'Cloud Native', '#', '{Cloud Native,AI Integration,React,Python,GCP}', true, 0),
  ('EcoTrack Mobile', 'A Flutter-based application that helps students calculate and offset their carbon footprint through campus initiatives.', 'Mobile App', '#', '{Flutter,Mobile}', false, 1),
  ('SyllabusBot AI', 'Using LangChain and OpenAI to create a RAG-based chatbot that answers student queries directly from department PDFs.', 'AI / ML', '#', '{AI,LangChain,RAG}', false, 2),
  ('Alumni Connect', 'A comprehensive portal for alumni networking built with Next.js, featuring real-time job boards and mentorship matching.', 'Web App', '#', '{Next.js,Web}', false, 3)
on conflict do nothing;

insert into team_members (name, role, category, photo_url, linkedin_url, sort_order)
values
  ('Swarnim Shamgaonkar', 'Organizer', 'lead', '/core-images/organizer.jpeg', 'https://linkedin.com/in/swarnim-shamgaonkar-b725472b1', 1),
  ('Pratham Jadhav', 'Co-Organizer', 'lead', '/core-images/co-organizer.jpg', 'https://linkedin.com/in/jadhavprathammm', 2),
  ('Sudeep Sakpal', 'Web Development Lead', 'domain_lead', '/core-images/leads/Web Dev Lead.jpg', '', 1),
  ('Hritika Gupta', 'Web Development Co-Lead', 'co_lead', '/core-images/coleads/Web dev Colead.jpg', '', 1),
  ('Niranjan Sonawane', 'AI/ML Lead', 'domain_lead', '/core-images/leads/AIML Lead.jpg', '', 2),
  ('Manasvi Bhandarkar', 'AI/ML Co-Lead', 'co_lead', '/core-images/coleads/Aiml Co-lead.jpg', '', 2),
  ('Srushti Dawkhar', 'Android Development Lead', 'domain_lead', '/core-images/leads/Android Lead.jpg', '', 3),
  ('Aditya Khawale', 'Android Development Co-Lead', 'co_lead', '/core-images/coleads/Android Co lead.jpg', '', 3),
  ('Tvisha Ghiya', 'Competitive Programming Lead', 'domain_lead', '/core-images/leads/Competitive Lead.jpg', '', 4),
  ('Kaiwalya Gunjal', 'Competitive Programming Co-Lead', 'co_lead', '/core-images/coleads/Competitive Co-lead.jpg', '', 4),
  ('Elton Fernandes', 'Cyber Security Lead', 'domain_lead', '/core-images/leads/Cyber Security Lead.jpg', '', 5),
  ('Priyal Sathe', 'Cyber Security Co-Lead', 'co_lead', '/core-images/coleads/Cyber Security Co lead.jpg', '', 5),
  ('Vinayak Kapkar', 'Event Management Lead', 'domain_lead', '/core-images/leads/Event Management Lead.jpeg', '', 6),
  ('Shreya Kadam', 'Event Management Co-Lead', 'co_lead', '/core-images/coleads/Event Management Co-lead.jpg', '', 6),
  ('Aditi Deshpande', 'Social Media Lead', 'domain_lead', '/core-images/leads/Social Media Lead.jpg', '', 7),
  ('Parth Karpe', 'Social Media Co-Lead', 'co_lead', '/core-images/coleads/Social Media Colead.jpeg', '', 7),
  ('Avishkar Choundkar', 'Sponsorship Lead', 'domain_lead', '/core-images/leads/Sponsorship lead.jpg', '', 8),
  ('Alphiya Kazi', 'Sponsorship Co-Lead', 'co_lead', '/core-images/coleads/Sponsorship Colead.jpg', '', 8),
  ('Aarya Anekar', 'Cloud Computing Lead', 'domain_lead', '/core-images/leads/Cloud Lead.jpg', '', 9),
  ('Harsh Dharmawat', 'Cloud Computing Co-Lead', 'co_lead', '/core-images/coleads/Cloud Computing Co lead.jpg', '', 9),
  ('Dhanashree Labhe', 'Women Tech Lead', 'domain_lead', '/core-images/leads/Women Tech Lead.jpg', '', 10),
  ('Dynanada Thuse', 'Women Tech Co-Lead', 'co_lead', '/core-images/coleads/Women Tech Colead.jpg', '', 10),
  ('Madhura Gore', 'UI/UX Lead', 'domain_lead', '/core-images/leads/UIUX Lead.jpg', '', 11),
  ('Divya Bhandari', 'UI/UX Co-Lead', 'co_lead', '/core-images/coleads/UIUX Colead.jpg', '', 11)
on conflict do nothing;

insert into sponsors (name, logo_url, sort_order)
values
  ('Sponsor 1', '/sponsors/WhatsApp Image 2026-05-01 at 3.07.58 PM.jpeg', 1),
  ('Sponsor 2', '/sponsors/WhatsApp Image 2026-05-01 at 3.09.10 PM.jpeg', 2),
  ('Sponsor 3', '/sponsors/WhatsApp Image 2026-05-01 at 3.10.14 PM.jpeg', 3),
  ('Sponsor 4', '/sponsors/WhatsApp Image 2026-05-01 at 3.11.00 PM.jpeg', 4),
  ('Sponsor 5', '/sponsors/WhatsApp Image 2026-05-01 at 3.12.41 PM.jpeg', 5),
  ('Sponsor 6', '/sponsors/imresizer-Soli.jpeg', 6)
on conflict do nothing;

insert into faqs (question, answer, sort_order)
values
  ('Who can join GDG On-Campus SKNCOE?', 'Open to all students across all branches and years. Whether you''re a designer, coder, or community builder, there''s a place for you.', 1),
  ('How can I become a core team member?', 'Applications for the core team open once per academic year. Stay tuned to our social channels for recruitment updates.', 2),
  ('What technologies do you cover?', 'We focus primarily on Google ecosystems like Firebase, Flutter, GCP, and Android, but also explore modern stacks like React, Next.js, and PyTorch.', 3)
on conflict do nothing;

insert into nav_links (label, url, type, sort_order)
values
  ('Home', '/', 'internal', 1),
  ('Events', '/events', 'internal', 2),
  ('Core Team', '/core', 'internal', 3),
  ('Projects', '/projects', 'internal', 4),
  ('Resources', '/resources', 'internal', 5),
  ('Community', '/community', 'internal', 6),
  ('Qubit', 'https://qubit-live.vercel.app/', 'external', 7)
on conflict do nothing;

insert into social_links (platform, url, sort_order)
values
  ('WhatsApp', 'https://chat.whatsapp.com/FW4TdHTASgzGPJ4ZuxyJyD', 1),
  ('Instagram', 'https://www.instagram.com/gdg_skncoe', 2),
  ('LinkedIn', 'https://www.linkedin.com/company/gdgoncampus/', 3)
on conflict do nothing;

insert into contact_info (address, email, map_embed_url, location_badge)
values (
  'SKNCOE Campus, Block A, 402',
  'gdg.skncoe@gmail.com',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.9857!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1234567890',
  'SKNCOE Pune'
) on conflict do nothing;
