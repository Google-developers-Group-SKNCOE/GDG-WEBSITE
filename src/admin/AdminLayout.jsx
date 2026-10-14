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

const AdminLayout = () => {
  const { user, signOut, isSupabaseConfigured } = useAuth()
  const [active, setActive] = useState('events')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const ActiveComponent = {
    events:    AdminEvents,
    resources: AdminResources,
    sponsors:  AdminSponsors,
    team:      AdminTeam,
    comments:  AdminComments,
  }[active]

  return (
    <div className="h-screen bg-surface-dark flex overflow-hidden">

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
          <div className="px-4 py-2 border-b-4 border-white/10 flex items-center text-[10px] font-black uppercase">
            <span className="flex items-center gap-1.5 text-white/70">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-success' : 'bg-warning animate-pulse'}`} />
              {isSupabaseConfigured ? 'Supabase Live' : 'Local DB Mode'}
            </span>
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
      <div className="flex-1 flex flex-col h-full overflow-hidden md:ml-0">
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
        <main className="flex-1 p-4 pt-8 md:p-10 md:pt-10 overflow-auto">
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

    </div>
  )
}

export default AdminLayout
