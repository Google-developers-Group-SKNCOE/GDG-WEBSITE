import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbFetch, dbInsert, dbUpdate, dbDelete, subscribeToTable, sortEventsByDate } from '../lib/db'
import CommunityFeed from '../components/CommunityFeed'

// ─── Event Resources Data ─────────────────────────────────────────────────────
const eventResources = [
  {
    id: 'connecting-backend-engineering',
    title: 'Connecting To Backend Engineering',
    type: 'Workshop',
    date: 'Oct 13, 2026',
    color: 'bg-danger',
    icon: 'terminal',
    description:
      "Mastering Backend Engineering: An Interactive Workshop. Explore the essentials of backend engineering in 'Connecting to Backend Engineering.' Participants learn web request processes, HTTP, APIs, databases, and tools like Redis, RabbitMQ, and Kafka for scalable applications.",
    tags: ['HTTP/HTTPS', 'APIs', 'DB', 'Redis', 'Kafka'],
    resources: [
      { label: 'Workshop Notes', icon: 'article', url: '#' },
      { label: 'Resource Kit', icon: 'folder_zip', url: '#' },
    ],
  },
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


// ─── ResourceCard ─────────────────────────────────────────────────────────────
const ResourceCard = ({ event, index, onSelect }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.07 }}
    onClick={() => onSelect(event)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect(event)
      }
    }}
    tabIndex={0}
    role="button"
    aria-label={`Open ${event.title}`}
    className="bg-white border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-primary"
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
            href={r.url || '#'}
            target={r.url && r.url !== '#' ? '_blank' : undefined}
            rel={r.url && r.url !== '#' ? 'noopener noreferrer' : undefined}
            onClick={(e) => {
              e.stopPropagation()
              if (!r.url || r.url === '#') {
                e.preventDefault()
              }
            }}
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
const CommunitySection = ({ events = [], activeEvent = null }) => {
  const eventTitles = (events && events.length > 0 ? events : eventResources).map((e) => e.title)
  return <CommunityFeed eventFilterList={eventTitles} activeEvent={activeEvent} />
}

// ─── Main Resources Page ──────────────────────────────────────────────────────
const Resources = () => {
  const [allEvents, setAllEvents] = useState(() => sortEventsByDate(eventResources, true))
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const fetchDb = async () => {
      const [{ data: dbEvents }, { data: dbRes }] = await Promise.all([
        dbFetch('events', 'date', false),
        dbFetch('resources', 'created_at', false)
      ])

      let baseEvents = []
      if (dbEvents && dbEvents.length > 0) {
        baseEvents = [...dbEvents]
        // If eventResources has any events not yet in dbEvents, append them as fallback
        eventResources.forEach(hardcodedEv => {
          if (!baseEvents.some(e => e.id === hardcodedEv.id || e.title === hardcodedEv.title)) {
            baseEvents.push(hardcodedEv)
          }
        })
      } else {
        baseEvents = [...eventResources]
      }

      const resList = dbRes || []
      const hasDbResources = resList.length > 0

      const isMatch = (rEv, ev) => {
        if (!rEv || !ev) return false
        const rStr = String(rEv).trim().toLowerCase()
        const evId = String(ev.id || '').trim().toLowerCase()
        const evTitle = String(ev.title || '').trim().toLowerCase()
        const evSlug = evTitle.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        const rSlug = rStr.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

        return (
          rStr === evId ||
          rStr === evTitle ||
          rSlug === evSlug ||
          evTitle.includes(rStr) ||
          rStr.includes(evTitle)
        )
      }

      const mapped = baseEvents.map(ev => {
        // Collect resources from DB matching this event (by ID, title, or slug)
        const dbMatched = resList
          .filter(r => isMatch(r.event_id || r.related_event, ev))
          .map(r => ({
            label: r.label || r.resource_label || r.title,
            icon: r.icon || r.icon_type || 'slideshow',
            url: r.url || r.resource_url || r.link
          }))

        // If this specific event has custom resources in DB, use them!
        // Otherwise fallback to its default/seed resources so users always see the resource buttons!
        const finalResources = dbMatched.length > 0 ? dbMatched : (ev.resources || [])

        return {
          ...ev,
          icon: ev.icon || 'event',
          resources: finalResources
        }
      })

      setAllEvents(sortEventsByDate(mapped, true))
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
          {selectedEvent ? (
                <div className="mb-10 rounded-none border-4 border-black bg-white shadow-brutal overflow-hidden">
                  <div className={`${selectedEvent.color || 'bg-primary'} border-b-4 border-black p-5 md:p-6`}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-brutal-sm shrink-0">
                          <span className="material-symbols-outlined text-black text-2xl">{selectedEvent.icon || 'event'}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-widest text-white/80">{selectedEvent.type}</span>
                          <h3 className="font-headline font-black text-white text-2xl md:text-3xl uppercase leading-tight">{selectedEvent.title}</h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedEvent(null)}
                        className="bg-white text-black border-2 border-black px-3 py-2 text-[10px] font-black uppercase shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5"
                      >
                        Close Post
                      </button>
                    </div>
                  </div>

                  <div className="p-5 md:p-7">
                    <div className="mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-black/70">
                      <span>{selectedEvent.date}</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-black" />
                      <span>{(selectedEvent.resources || []).length} Resources</span>
                    </div>

                    <p className="text-base md:text-lg font-bold leading-relaxed text-black mb-6">
                      {selectedEvent.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(selectedEvent.tags || []).map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-surface-dark border-2 border-black text-black text-[10px] font-black uppercase shadow-brutal-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mb-8">
                      <h4 className="font-headline font-black text-xl uppercase text-black mb-4">Resources</h4>
                      <div className="flex flex-wrap gap-3">
                        {(selectedEvent.resources || []).map((r, i) => (
                          <a
                            key={`${r.label}-${i}`}
                            href={r.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-black text-xs font-black uppercase shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">{r.icon || 'link'}</span>
                            {r.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="border-t-4 border-black pt-6">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h4 className="font-headline font-black text-xl uppercase text-black">Comments</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
                          Dedicated discussion
                        </span>
                      </div>
                      <CommunitySection events={[selectedEvent]} activeEvent={selectedEvent} />
                    </div>
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white border-4 border-black p-16 text-center shadow-brutal">
                  <span className="material-symbols-outlined text-5xl text-black/20 mb-3 block">search_off</span>
                  <p className="font-black uppercase text-black/40">No events match your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filtered.map((event, idx) => (
                    <ResourceCard key={event.id} event={event} index={idx} onSelect={setSelectedEvent} />
                  ))}
                </div>
              )}
            </section>

            {!selectedEvent && <CommunitySection events={allEvents} />}

      </main>
    </div>
  )
}

export default Resources

