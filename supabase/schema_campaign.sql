-- Campaign & moderation additions (safe to run multiple times)

alter table comments add column if not exists hidden boolean not null default false;

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Untitled Campaign',
  subject text not null default '',
  body text not null default '',
  status text not null default 'draft',
  sent_count integer not null default 0,
  last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists campaign_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null,
  created_at timestamptz not null default now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'campaign_contacts_email_key'
  ) THEN
    ALTER TABLE campaign_contacts ADD CONSTRAINT campaign_contacts_email_key UNIQUE (email);
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

alter table campaigns disable row level security;
alter table campaign_contacts disable row level security;
