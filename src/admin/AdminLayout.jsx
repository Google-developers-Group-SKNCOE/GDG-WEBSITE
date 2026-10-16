import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import AdminEvents from './AdminEvents'
import AdminResources from './AdminResources'
import AdminSponsors from './AdminSponsors'
import AdminTeam from './AdminTeam'
import AdminComments from './AdminComments'

const NAV = [
  { id: 'events',    icon: 'calendar_month',   label: 'Events' },
  { id: 'resources', icon: 'library_books',    label: 'Resources' },
  { id: 'sponsors',  icon: 'handshake',        label: 'Sponsors' },
  { id: 'team',      icon: 'group',            label: 'Core Team' },
  { id: 'comments',  icon: 'forum',            label: 'Comments' },
]

const SECTION_COLORS = {
  events:    'bg-primary',
  resources: 'bg-danger',
  sponsors:  'bg-warning',
  team:      'bg-success',
  comments:  'bg-primary',
}

const SQL_SCHEMA = `-- 1. Events Table
create table if not exists events (
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
create table if not exists resources (
  id text primary key default gen_random_uuid()::text,
  event_id text references events(id) on delete cascade,
  label text not null,
  icon text default 'slideshow',
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Core Team Table
create table if not exists team (
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
create table if not exists sponsors (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  tier text default 'Community Partner',
  logo text,
  url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Community Comments Table
create table if not exists comments (
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

-- Enable public read, admin write policies
alter table events enable row level security;
drop policy if exists "Public read events" on events;
drop policy if exists "Public insert/update/delete events" on events;
drop policy if exists "Authenticated write events" on events;
create policy "Public read events" on events for select using (true);
create policy "Authenticated write events" on events for all to authenticated using (true) with check (true);

alter table resources enable row level security;
drop policy if exists "Public read resources" on resources;
drop policy if exists "Public insert/update/delete resources" on resources;
drop policy if exists "Authenticated write resources" on resources;
create policy "Public read resources" on resources for select using (true);
create policy "Authenticated write resources" on resources for all to authenticated using (true) with check (true);

alter table team enable row level security;
drop policy if exists "Public read team" on team;
drop policy if exists "Public insert/update/delete team" on team;
drop policy if exists "Authenticated write team" on team;
create policy "Public read team" on team for select using (true);
create policy "Authenticated write team" on team for all to authenticated using (true) with check (true);

alter table sponsors enable row level security;
drop policy if exists "Public read sponsors" on sponsors;
drop policy if exists "Public insert/update/delete sponsors" on sponsors;
drop policy if exists "Authenticated write sponsors" on sponsors;
create policy "Public read sponsors" on sponsors for select using (true);
create policy "Authenticated write sponsors" on sponsors for all to authenticated using (true) with check (true);

alter table comments enable row level security;
drop policy if exists "Public read comments" on comments;
drop policy if exists "Public insert comments" on comments;
drop policy if exists "Public update comments" on comments;
drop policy if exists "Authenticated delete comments" on comments;
create policy "Public read comments" on comments for select using (true);
create policy "Public insert comments" on comments for insert with check (true);
create policy "Public update comments" on comments for update using (true) with check (true);
create policy "Authenticated delete comments" on comments for delete to authenticated using (true);
`

const AdminLayout = () => {
  const { user, signOut, isSupabaseConfigured } = useAuth()
  const [active, setActive] = useState('events')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSqlModal, setShowSqlModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const ActiveComponent = {
    events:    AdminEvents,
    resources: AdminResources,
    sponsors:  AdminSponsors,
    team:      AdminTeam,
    comments:  AdminComments,
  }[active]

  return (
    <div className="min-h-screen bg-surface-dark flex">

      {/* ── Sidebar ── */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`
          fixed top-0 left-0 h-full z-50 w-64 bg-black border-r-4 border-black flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}>
          {/* Brand */}
          <div className="p-6 border-b-4 border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="GDG" className="w-8 h-8 object-contain" />
              <div>
                <p className="text-white/50 text-[9px] font-black uppercase tracking-widest">GDG SKNCOE</p>
                <p className="text-white font-black uppercase text-sm font-headline">Admin Panel</p>
              </div>
            </div>
            <Link
              to="/"
              className="text-white/50 hover:text-white transition-colors"
              title="Return to Public Website"
            >
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </Link>
          </div>

          {/* Database Status indicator */}
          <div className="px-4 py-2 border-b-4 border-white/10 flex items-center justify-between text-[10px] font-black uppercase">
            <span className="flex items-center gap-1.5 text-white/70">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-success' : 'bg-warning animate-pulse'}`} />
              {isSupabaseConfigured ? 'Supabase Live' : 'Local DB Mode'}
            </span>
            <button
              onClick={() => setShowSqlModal(true)}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">schema</span>
              SQL
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false) }}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-wider transition-all text-left ${
                  active === item.id
                    ? `${SECTION_COLORS[item.id]} text-white border-2 border-white/20 shadow-brutal-sm`
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="pt-4 mt-auto border-t-2 border-white/10">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-lg">home</span>
                Go to Website
              </Link>
            </div>
          </nav>

          {/* User info */}
          <div className="p-4 border-t-4 border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary border-2 border-white/20 flex items-center justify-center">
                <span className="text-white text-xs font-black uppercase">{user?.email?.charAt(0) || 'A'}</span>
              </div>
              <p className="text-white/70 text-xs font-bold truncate">{user?.email || 'Admin'}</p>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-danger/20 text-danger border border-danger/30 text-xs font-black uppercase hover:bg-danger hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-black border-b-4 border-black">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-white font-black uppercase text-sm">{NAV.find(n => n.id === active)?.label}</span>
          <Link to="/" className="text-white">
            <span className="material-symbols-outlined">home</span>
          </Link>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* SQL Setup Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black shadow-brutal-lg max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="p-4 border-b-4 border-black flex items-center justify-between bg-primary text-white">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">database</span>
                <h3 className="font-headline font-black uppercase text-base">Supabase SQL Schema Setup</h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="text-white hover:opacity-75">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs">
              <p className="font-sans font-bold text-xs text-black/70 mb-3">
                Paste this SQL in your <strong>Supabase Dashboard &gt; SQL Editor</strong> to instantly create tables for Events, Resources, Team, and Sponsors:
              </p>
              <pre className="p-3 bg-black text-green-400 border-2 border-black overflow-x-auto whitespace-pre">
                {SQL_SCHEMA}
              </pre>
            </div>
            <div className="p-4 border-t-4 border-black flex justify-between items-center bg-surface-dark">
              <span className="text-xs font-bold text-black/60">
                Create storage bucket <strong>gdg-media</strong> (public) for image uploads.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copySql}
                  className="px-4 py-2 bg-primary text-white font-black text-xs uppercase border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  {copied ? 'Copied!' : 'Copy SQL'}
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-2 bg-black text-white font-black text-xs uppercase border-2 border-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
