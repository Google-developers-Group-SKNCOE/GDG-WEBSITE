import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbFetch } from '../lib/db'

// ─── Event Resources Data ─────────────────────────────────────────────────────
const eventResources = [
  {
    id: 'synthera-2026',
    title: 'Synthera 2026',
    type: 'Flagship Event',
    date: 'Feb 23–25, 2026',
    color: 'bg-primary',
    icon: 'rocket_launch',
    description:
      'A 3-day collaborative mega-event uniting GDG SKNCOE, SCOE, and NBNSSOE. Workshops, hackathons, and speaker sessions across every tech domain.',
    tags: ['Hackathon', 'Workshop', 'Networking', 'Multi-College'],
    resources: [
      { label: 'Event Recap', icon: 'article', url: '#' },
      { label: 'Photo Gallery', icon: 'photo_library', url: '#' },
    ],
  },
  {
    id: 'cloud-study-jams-2025',
    title: 'Google Cloud Study Jams',
    type: 'Workshop',
    date: 'Oct 26, 2025',
    color: 'bg-primary',
    icon: 'cloud',
    description:
      'Hands-on Google Cloud workshop covering compute, storage, and ML APIs. Participants earned free Qwiklabs credits and cloud skill badges.',
    tags: ['GCP', 'Qwiklabs', 'Cloud', 'Badges'],
    resources: [
      { label: 'Slides', icon: 'slideshow', url: '#' },
      { label: 'Lab Guide', icon: 'menu_book', url: '#' },
      { label: 'Recording', icon: 'videocam', url: '#' },
    ],
  },
  {
    id: 'cyber-threat-2025',
    title: 'Cyber Threat Intelligence Workshop',
    type: 'Speaker Session',
    date: 'Oct 3, 2025',
    color: 'bg-danger',
    icon: 'shield',
    description:
      'An industry expert-led deep dive into threat hunting, OSINT, and defensive security strategies applicable in real-world SOC environments.',
    tags: ['Cybersecurity', 'OSINT', 'Threat Intel', 'SOC'],
    resources: [
      { label: 'Slides', icon: 'slideshow', url: '#' },
      { label: 'Resource Kit', icon: 'folder_zip', url: '#' },
    ],
  },
  {
    id: 'orientation-2025',
    title: 'GDGoC Orientation 2025',
    type: 'Info Session',
    date: 'Sep 19, 2025',
    color: 'bg-warning',
    icon: 'waving_hand',
    description:
      'Welcome session for new members covering GDG On-Campus structure, how to get involved, domain overview, and upcoming event roadmap for the year.',
    tags: ['Onboarding', 'Community', 'Roadmap'],
    resources: [
      { label: 'Presentation', icon: 'slideshow', url: '#' },
      { label: 'Recording', icon: 'videocam', url: '#' },
    ],
  },
  {
    id: 'flutterflow-2025',
    title: 'FlutterFlow Masterclass',
    type: 'Workshop',
    date: 'Mar 25, 2025',
    color: 'bg-success',
    icon: 'smartphone',
    description:
      'Build production-ready Flutter apps visually with no code required. Covered Firebase integration, responsive layouts, and deployment to the Play Store.',
    tags: ['Flutter', 'FlutterFlow', 'Firebase', 'No-Code'],
    resources: [
      { label: 'Slides', icon: 'slideshow', url: '#' },
      { label: 'Starter Project', icon: 'code', url: '#' },
      { label: 'Recording', icon: 'videocam', url: '#' },
    ],
  },
  {
    id: 'solution-series-2025',
    title: 'Solution Series Hackathon',
    type: 'Hackathon',
    date: 'Jan 27, 2025',
    color: 'bg-primary',
    icon: 'emoji_events',
    description:
      'A 24-hour hackathon challenging teams to solve real-world problems using Google technologies. Winners received cloud credits and mentorship opportunities.',
    tags: ['Hackathon', '24hr', 'Google Tech', 'Prizes'],
    resources: [
      { label: 'Problem Statements', icon: 'assignment', url: '#' },
      { label: 'Winning Projects', icon: 'trophy', url: '#' },
    ],
  },
  {
    id: 'solutions-challenge-2024',
    title: 'Solutions Challenge Intro',
    type: 'Info Session',
    date: 'Dec 25, 2024',
    color: 'bg-primary',
    icon: 'lightbulb',
    description:
      'Introduction to Google Solutions Challenge — what it is, how to form a team, past winning ideas, and tips to build an impactful submission.',
    tags: ['Solutions Challenge', 'Google', 'Ideation'],
    resources: [
      { label: 'Slides', icon: 'slideshow', url: '#' },
    ],
  },
  {
    id: 'tech-winter-break-2024',
    title: 'Tech Winter Break',
    type: 'Workshop',
    date: 'Dec 6, 2024',
    color: 'bg-danger',
    icon: 'ac_unit',
    description:
      'A series of winter break workshops covering APIs, open-source contributions, and beginner-friendly projects to keep the momentum going.',
    tags: ['APIs', 'Open Source', 'Projects', 'Beginner'],
    resources: [
      { label: 'Workshop Notes', icon: 'sticky_note_2', url: '#' },
    ],
  },
  {
    id: 'gen-ai-2024',
    title: 'Gen-AI in Action',
    type: 'Speaker Session',
    date: 'Oct 4, 2024',
    color: 'bg-success',
    icon: 'psychology',
    description:
      'Tools, techniques, and trends in Generative AI — covering prompt engineering, LLM APIs, Vertex AI, and responsible AI practices.',
    tags: ['AI', 'ML', 'Gemini', 'Prompt Engineering'],
    resources: [
      { label: 'Slides', icon: 'slideshow', url: '#' },
      { label: 'Recording', icon: 'videocam', url: '#' },
    ],
  },
]

// ─── Comment Helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'gdg_community_comments'

const loadComments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveComments = (comments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
}

const avatarColors = ['bg-primary', 'bg-danger', 'bg-warning', 'bg-success']
const getAvatarColor = (name) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length]

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ─── ResourceCard ─────────────────────────────────────────────────────────────
const ResourceCard = ({ event, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.07 }}
    className="bg-white border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col"
  >
    {/* Header */}
    <div className={`${event.color} p-5 border-b-4 border-black flex items-start justify-between gap-3`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
          <span className="material-symbols-outlined text-black text-xl">{event.icon}</span>
        </div>
        <div>
          <span className="block text-[10px] font-black uppercase tracking-widest text-white/80">{event.type}</span>
          <h3 className="font-headline font-black text-white text-lg leading-tight uppercase">{event.title}</h3>
        </div>
      </div>
      <span className="text-white/80 text-xs font-bold shrink-0 mt-1 text-right">{event.date}</span>
    </div>

    {/* Body */}
    <div className="p-6 flex flex-col flex-1 gap-4">
      {event.image && (
        <div className="border-2 border-black overflow-hidden max-h-48 bg-surface-dark mb-1 shadow-brutal-sm">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}
      <p className="text-black text-sm font-bold leading-relaxed">{event.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {(event.tags || []).map((tag) => (
          <span key={tag} className="px-3 py-1 bg-surface-dark border-2 border-black text-black text-[10px] font-black uppercase shadow-brutal-sm">
            {tag}
          </span>
        ))}
      </div>

      {/* Resource Links */}
      <div className="mt-auto pt-4 border-t-2 border-black flex flex-wrap gap-2">
        {(event.resources || []).map((r, i) => (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border-2 border-black text-black text-xs font-black uppercase shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all"
          >
            <span className="material-symbols-outlined text-sm">{r.icon || 'link'}</span>
            {r.label}
          </a>
        ))}
      </div>
    </div>
  </motion.article>
)

// ─── Community Section ────────────────────────────────────────────────────────
const CommunitySection = () => {
  const [comments, setComments] = useState(loadComments)
  const [name, setName] = useState('')
  const [eventRef, setEventRef] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [filter, setFilter] = useState('All')

  const allFilters = ['All', ...eventResources.map((e) => e.title), 'General']
  const filteredComments =
    filter === 'All' ? comments : comments.filter((c) => c.eventRef === filter)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      setError('Please fill in your name and message.')
      return
    }
    setError('')
    const newComment = {
      id: Date.now(),
      name: name.trim(),
      eventRef: eventRef || 'General',
      eventId: eventRef || 'General',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      likes: 0,
    }
    const updated = [newComment, ...comments]
    setComments(updated)
    saveComments(updated)
    setName('')
    setEventRef('')
    setMessage('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleLike = (id) => {
    const updated = comments.map((c) =>
      c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c
    )
    setComments(updated)
    saveComments(updated)
  }

  const handleDelete = (id) => {
    const updated = comments.filter((c) => c.id !== id)
    setComments(updated)
    saveComments(updated)
  }

  return (
    <section id="community" className="mt-24 md:mt-32 scroll-mt-28">
      {/* Header */}
      <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="bg-success border-4 border-black px-4 py-2 shadow-brutal inline-block -rotate-1 mb-4">
            <h2 className="text-3xl md:text-5xl font-headline font-black text-white uppercase tracking-tight m-0">
              Community
            </h2>
          </div>
          <p className="text-black font-bold text-base md:text-lg max-w-xl mt-2">
            Share your experience, ask questions, or drop a resource link.
            Comments are stored locally — no login required.
          </p>
        </div>
        <div className="bg-black text-white px-5 py-3 border-2 border-black font-black uppercase tracking-widest text-sm shadow-brutal-sm shrink-0">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
        {/* ── Form ── */}
        <div className="lg:col-span-2">
          <div className="bg-white border-4 border-black shadow-brutal p-6 md:p-8 sticky top-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-black">
              <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm">
                <span className="material-symbols-outlined text-white text-xl">edit</span>
              </div>
              <h3 className="font-headline font-black text-black text-xl uppercase">Leave a Note</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase tracking-widest text-black">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  maxLength={40}
                  className="w-full border-2 border-black px-4 py-3 text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all placeholder:text-black/30"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase tracking-widest text-black">Related Event</label>
                <select
                  value={eventRef}
                  onChange={(e) => setEventRef(e.target.value)}
                  className="w-full border-2 border-black px-4 py-3 text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">General / No specific event</option>
                  {eventResources.map((ev) => (
                    <option key={ev.id} value={ev.title}>{ev.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase tracking-widest text-black">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, feedback, or a helpful link..."
                  rows={5}
                  maxLength={500}
                  className="w-full border-2 border-black px-4 py-3 text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all resize-none placeholder:text-black/30"
                />
                <span className="text-xs text-black/40 font-bold self-end">{message.length}/500</span>
              </div>

              {error && (
                <div className="bg-danger text-white border-2 border-black px-4 py-2 text-xs font-black uppercase shadow-brutal-sm">
                  {error}
                </div>
              )}

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-success text-white border-2 border-black px-4 py-2 text-xs font-black uppercase shadow-brutal-sm"
                  >
                    ✓ Posted! Thanks for sharing.
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="w-full bg-primary text-white py-4 font-black uppercase tracking-wider text-sm border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* ── Feed ── */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 pb-4 border-b-4 border-black">
            {allFilters.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 border-black transition-all ${
                  filter === tag
                    ? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5'
                    : 'bg-white text-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {filteredComments.length === 0 ? (
            <div className="bg-white border-4 border-black p-16 text-center shadow-brutal">
              <span className="material-symbols-outlined text-5xl text-black/20 mb-3 block">forum</span>
              <p className="font-black uppercase text-black/40 text-sm">
                {filter === 'All' ? 'No comments yet. Be the first!' : `No comments for "${filter}" yet.`}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredComments.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border-4 border-black shadow-brutal p-5 md:p-6 flex flex-col gap-4"
                >
                  {/* Comment header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 border-2 border-black ${getAvatarColor(c.name)} flex items-center justify-center shadow-brutal-sm shrink-0`}>
                        <span className="font-black text-white text-sm uppercase">{c.name.charAt(0)}</span>
                      </div>
                      <div>
                        <span className="block font-black text-black text-sm uppercase">{c.name}</span>
                        {c.eventRef && c.eventRef !== 'General' && (
                          <span className="text-[10px] font-bold text-black/50 uppercase tracking-wide">re: {c.eventRef}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-black/40 uppercase tracking-widest">{timeAgo(c.timestamp)}</span>
                  </div>

                  {/* Message */}
                  <p className="text-black text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                    {c.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2 border-t-2 border-black">
                    <button
                      onClick={() => handleLike(c.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black text-xs font-black uppercase shadow-brutal-sm hover:bg-warning hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">thumb_up</span>
                      {c.likes || 0}
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black text-xs font-black uppercase shadow-brutal-sm hover:bg-danger hover:text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ml-auto"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Main Resources Page ──────────────────────────────────────────────────────
const Resources = () => {
  const [allEvents, setAllEvents] = useState(eventResources)
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState('All')

  useEffect(() => {
    const fetchDb = async () => {
      const [{ data: dbEvents }, { data: dbRes }] = await Promise.all([
        dbFetch('events'),
        dbFetch('resources')
      ])

      let merged = [...eventResources]

      if (dbEvents && dbEvents.length > 0) {
        dbEvents.forEach(dbEv => {
          const idx = merged.findIndex(e => e.id === dbEv.id || e.title === dbEv.title)
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], ...dbEv }
          } else {
            merged.unshift({
              id: dbEv.id,
              title: dbEv.title,
              type: dbEv.type || 'Workshop',
              date: dbEv.date,
              color: dbEv.color || 'bg-primary',
              icon: 'event',
              description: dbEv.description || '',
              tags: dbEv.tags || [],
              image: dbEv.image,
              resources: []
            })
          }
        })
      }

      if (dbRes && dbRes.length > 0) {
        dbRes.forEach(r => {
          const ev = merged.find(e => e.id === r.event_id || e.title === r.event_id)
          if (ev) {
            if (!ev.resources) ev.resources = []
            if (!ev.resources.some(existing => existing.label === r.label && existing.url === r.url)) {
              ev.resources.push({
                label: r.label,
                icon: r.icon || 'slideshow',
                url: r.url
              })
            }
          }
        })
      }

      setAllEvents([...merged])
    }
    fetchDb()
  }, [])

  const eventTypes = ['All', ...new Set(allEvents.map((e) => e.type))]

  const filtered = allEvents.filter((ev) => {
    const matchType = activeType === 'All' || ev.type === activeType
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      (ev.description && ev.description.toLowerCase().includes(q)) ||
      (ev.tags && ev.tags.some((t) => t.toLowerCase().includes(q)))
    return matchType && matchSearch
  })

  return (
    <div className="grid-paper min-h-screen pt-24 md:pt-28 pb-24 md:pb-32 border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Hero */}
        <header className="mb-12 md:mb-20 bg-white border-4 border-black p-6 md:p-10 shadow-brutal-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-headline text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tighter text-black mb-6 leading-[1.0] uppercase"
            >
              Event{' '}
              <span className="bg-primary text-white px-3 md:px-4 py-1 md:py-2 border-2 md:border-4 border-black inline-block mt-2 -rotate-1 shadow-brutal">
                Resources
              </span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-black font-bold leading-relaxed max-w-xl bg-surface-dark p-4 border-2 border-black"
            >
              Slides, recordings &amp; guides from every GDG SKNCOE event — all in one place.
            </motion.p>
          </div>

          <motion.a
            href="#community"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 bg-success text-white text-xs font-black uppercase px-4 py-2 border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all"
          >
            <span className="material-symbols-outlined text-sm">forum</span>
            Jump to Community
          </motion.a>

          <div className="absolute top-0 right-0 opacity-5 pointer-events-none hidden md:block">
            <span className="material-symbols-outlined text-[16rem]">library_books</span>
          </div>
        </header>

        {/* Filters */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row gap-4 items-start md:items-center bg-white border-4 border-black p-4 md:p-5 shadow-brutal">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black/40 text-xl pointer-events-none">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, tags..."
              className="w-full pl-10 pr-4 py-3 border-2 border-black text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all placeholder:text-black/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-2 border-black transition-all ${
                  activeType === type
                    ? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5'
                    : 'bg-white text-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <section>
          {filtered.length === 0 ? (
            <div className="bg-white border-4 border-black p-16 text-center shadow-brutal">
              <span className="material-symbols-outlined text-5xl text-black/20 mb-3 block">search_off</span>
              <p className="font-black uppercase text-black/40">No events match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((event, idx) => (
                <ResourceCard key={event.id} event={event} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* Community */}
        <CommunitySection />

      </main>
    </div>
  )
}

export default Resources
