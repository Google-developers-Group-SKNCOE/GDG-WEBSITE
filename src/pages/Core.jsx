import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    dbFetch('team', 'created_at', true).then(({ data }) => {
      if (data && data.length > 0) setTeam(data)
    })
  }, [])

  // Structured categorization
  const organizers = team.filter(m => m.category === 'Organizer' || m.roleTag?.toLowerCase() === 'organizer')
  const coOrganizers = team.filter(m => (m.category === 'Co-Organizer' || m.roleTag?.toLowerCase() === 'co-organizer') && !organizers.includes(m))
  const mentors = team.filter(m => m.category === 'Mentor' || m.roleTag?.toLowerCase().includes('mentor'))
  const leads = team.filter(m => (m.category === 'Lead' || (m.roleTag?.toLowerCase().includes('lead') && !m.roleTag?.toLowerCase().includes('co-lead'))) && !organizers.includes(m) && !coOrganizers.includes(m) && !mentors.includes(m))
  const coLeads = team.filter(m => (m.category === 'Co-Lead' || m.roleTag?.toLowerCase().includes('co-lead')) && !organizers.includes(m) && !coOrganizers.includes(m) && !mentors.includes(m))
  const coreMembers = team.filter(m => !organizers.includes(m) && !coOrganizers.includes(m) && !mentors.includes(m) && !leads.includes(m) && !coLeads.includes(m))

  const FILTER_TABS = [
    { id: 'All', label: 'All Members', count: team.length },
    { id: 'Leadership', label: 'Organizers', count: organizers.length + coOrganizers.length },
    ...(mentors.length > 0 ? [{ id: 'Mentors', label: 'Mentors', count: mentors.length }] : []),
    { id: 'Leads', label: 'Leads', count: leads.length },
    { id: 'Co-Leads', label: 'Co-Leads', count: coLeads.length },
    ...(coreMembers.length > 0 ? [{ id: 'Core', label: 'Core Members', count: coreMembers.length }] : []),
  ]

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

          {/* Quick Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-black text-white shadow-brutal-sm'
                    : 'bg-white text-black hover:bg-surface-dark'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </section>

        {/* 1. Leadership: Organizers & Co-Organizers */}
        {(filter === 'All' || filter === 'Leadership') && (organizers.length > 0 || coOrganizers.length > 0) && (
          <section className="mb-16">
            <div className="flex items-center gap-4 md:gap-6 mb-10">
              <h2 className="font-headline text-2xl md:text-4xl font-black text-white bg-primary border-4 border-black px-4 md:px-6 py-2 shadow-brutal uppercase">
                Leadership & Organizers
              </h2>
              <div className="h-2 flex-1 bg-black hidden sm:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {[...organizers, ...coOrganizers].map((person, idx) => (
                <LeaderCard key={person.id || person.name} person={person} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 2. Mentors Section */}
        {(filter === 'All' || filter === 'Mentors') && mentors.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 md:gap-6 mb-10">
              <h2 className="font-headline text-2xl md:text-4xl font-black text-black bg-warning border-4 border-black px-4 md:px-6 py-2 shadow-brutal uppercase">
                Mentors & Advisors
              </h2>
              <div className="h-2 flex-1 bg-black hidden sm:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {mentors.map((person, idx) => (
                <LeaderCard key={person.id || person.name} person={person} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 3. Domain Leads Section */}
        {(filter === 'All' || filter === 'Leads') && leads.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 md:gap-6 mb-10">
              <h2 className="font-headline text-2xl md:text-4xl font-black text-white bg-danger border-4 border-black px-4 md:px-6 py-2 shadow-brutal uppercase">
                Domain Leads
              </h2>
              <div className="h-2 flex-1 bg-black hidden sm:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {leads.map((person, idx) => (
                <LeaderCard key={person.id || person.name} person={person} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Domain Co-Leads Section */}
        {(filter === 'All' || filter === 'Co-Leads') && coLeads.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 md:gap-6 mb-10">
              <h2 className="font-headline text-2xl md:text-4xl font-black text-white bg-success border-4 border-black px-4 md:px-6 py-2 shadow-brutal uppercase">
                Domain Co-Leads
              </h2>
              <div className="h-2 flex-1 bg-black hidden sm:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {coLeads.map((person, idx) => (
                <LeaderCard key={person.id || person.name} person={person} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Core Members Section (if any) */}
        {(filter === 'All' || filter === 'Core') && coreMembers.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 md:gap-6 mb-10">
              <h2 className="font-headline text-2xl md:text-4xl font-black text-black bg-surface-dark border-4 border-black px-4 md:px-6 py-2 shadow-brutal uppercase">
                Core Members
              </h2>
              <div className="h-2 flex-1 bg-black hidden sm:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {coreMembers.map((person, idx) => (
                <LeaderCard key={person.id || person.name} person={person} index={idx} />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

export default Core
