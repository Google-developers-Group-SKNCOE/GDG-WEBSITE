import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { dbFetch, SEEDS, convertGoogleDriveUrl } from '../lib/db'

const LeaderCard = ({ person, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
    className="group relative bg-white p-8 border-4 border-black brutal-card shadow-brutal flex flex-col items-center md:items-start text-center md:text-left transition-all hover:bg-surface-dark"
  >
    <div className="flex flex-col md:flex-row gap-8 items-center w-full">
      <div className="relative shrink-0">
        <div className="w-48 h-48 rounded overflow-hidden border-4 border-black bg-white shadow-brutal">
          <img
            alt={person.name}
            className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
            src={convertGoogleDriveUrl(person.image)}
            onError={(e) => {
              const match = person.image?.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)
              if (match && match[1]) {
                e.target.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
              }
            }}
          />
        </div>
      </div>
      <div className="flex-1">
        <span className={`inline-block px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] border-2 border-black text-white ${person.roleColor || 'bg-primary'} mb-4 shadow-brutal-sm`}>
          {person.roleTag}
        </span>
        <h3 className="font-headline text-3xl font-black mb-6 text-black uppercase">{person.name}</h3>
        {person.linkedin && (
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2 font-black uppercase text-black bg-white border-2 border-black brutal-btn">
            <span className="material-symbols-outlined !text-base">link</span>
            LinkedIn
          </a>
        )}
      </div>
    </div>
  </motion.div>
)

const Core = () => {
  const [team, setTeam] = useState(SEEDS.team || [])

  useEffect(() => {
    dbFetch('team', 'created_at', true).then(({ data }) => {
      if (data && data.length > 0) setTeam(data)
    })
  }, [])

  // Universal ranking function for team hierarchy:
  // Rank 1: Mentors / Faculty Advisors (At the very top!)
  // Rank 2: Organizers (Organiser / Organizer)
  // Rank 3: Co-Organizers (Co-Organizer / Co-Organiser)
  // Rank 10: Domains (AI/ML, Web, UI/UX, Events, Android, Cloud...)
  const getRank = (m) => {
    const cat = (m.category || '').toLowerCase()
    const role = (m.roleTag || '').toLowerCase()
    const text = `${cat} ${role}`

    // 1. Mentors at the absolute top
    if (text.includes('mentor') || text.includes('advisor') || text.includes('faculty')) return 1

    // 2. Organizers
    if (text.includes('organ') && !text.includes('co')) return 2

    // 3. Co-Organizers
    if (text.includes('organ') && text.includes('co')) return 3

    return 10
  }

  const extractDomain = (m) => {
    const text = `${m.roleTag || ''} ${m.category || ''}`.toLowerCase()
    if (text.includes('ai') || text.includes('ml') || text.includes('machine learning')) return 'aiml'
    if (text.includes('web')) return 'web'
    if (text.includes('ui') || text.includes('ux') || text.includes('design')) return 'uiux'
    if (text.includes('event')) return 'events'
    if (text.includes('android') || text.includes('app')) return 'android'
    if (text.includes('cloud')) return 'cloud'
    if (text.includes('cyber') || text.includes('security')) return 'cyber'
    if (text.includes('competitive') || text.includes('cp')) return 'cp'
    if (text.includes('social')) return 'social'
    if (text.includes('sponsor')) return 'sponsorship'
    if (text.includes('women') || text.includes('wit')) return 'wit'
    return 'other'
  }

  const isCoLead = (m) => {
    const role = (m.roleTag || '').toLowerCase()
    const cat = (m.category || '').toLowerCase()
    return role.includes('co-') || role.includes('colead') || role.includes('co lead') || cat.includes('co-')
  }

  const domainOrder = [
    'aiml',
    'web',
    'uiux',
    'events',
    'android',
    'cloud',
    'cyber',
    'cp',
    'social',
    'sponsorship',
    'wit',
    'other'
  ]

  // Tier 1: Mentors
  const mentors = team
    .filter(m => getRank(m) === 1)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))

  // Tier 2: Organizers & Co-Organizers
  const organizers = team
    .filter(m => getRank(m) === 2 || getRank(m) === 3)
    .sort((a, b) => getRank(a) - getRank(b) || (a.name || '').localeCompare(b.name || ''))

  // Tier 3: Domain Leads & Co-Leads (AI/ML first, Web Dev second, then UI/UX, Events, Android, etc.)
  const domainMembers = team
    .filter(m => getRank(m) >= 10)
    .sort((a, b) => {
      const domA = extractDomain(a)
      const domB = extractDomain(b)
      const orderA = domainOrder.indexOf(domA)
      const orderB = domainOrder.indexOf(domB)
      if (orderA !== orderB) return orderA - orderB

      // Lead comes first, Co-Lead immediately follows side-by-side
      const coA = isCoLead(a) ? 1 : 0
      const coB = isCoLead(b) ? 1 : 0
      if (coA !== coB) return coA - coB

      return (a.name || '').localeCompare(b.name || '')
    })

  return (
    <div className="grid-bg min-h-screen border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-24 md:pb-40">

        {/* Hero Section */}
        <section className="mb-12 md:mb-20 text-center bg-white border-4 border-black p-6 md:p-12 brutal-card shadow-brutal-lg rotate-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white border-2 border-black text-[10px] md:text-[12px] font-black uppercase tracking-widest mb-6 md:mb-8 shadow-brutal-sm">
            Meet the Team
          </div>
          <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 text-black leading-tight md:leading-none uppercase break-words">
            Building the future, <br className="hidden sm:block" />
            <span className="text-white bg-danger px-3 md:px-4 border-2 md:border-4 border-black inline-block mt-2 md:mt-4 shadow-brutal -rotate-2">Together.</span>
          </h1>
          <p className="text-base md:text-xl text-black font-bold max-w-2xl mx-auto leading-relaxed bg-surface-dark p-4 border-2 border-black">
            The GDG SKNCOE core team is a collective of visionary developers, designers, and community leaders committed to fostering a thriving tech ecosystem.
          </p>
        </section>

        {/* Mentors (Top / Upside) */}
        {mentors.length > 0 && (
          <section className="mb-8 md:mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {mentors.map((person, idx) => (
                <LeaderCard key={person.id || person.name} person={person} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* Organizers & Co-Organizers (Directly Beneath Mentors) */}
        {organizers.length > 0 && (
          <section className="mb-8 md:mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {organizers.map((person, idx) => (
                <LeaderCard key={person.id || person.name} person={person} index={idx + mentors.length} />
              ))}
            </div>
          </section>
        )}

        {/* Domain Leads & Co-Leads: AI/ML, Web Dev, UI/UX, Events, Android... (Beneath Organizers) */}
        {domainMembers.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {domainMembers.map((person, idx) => (
                <LeaderCard key={person.id || person.name} person={person} index={idx + mentors.length + organizers.length} />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

export default Core
