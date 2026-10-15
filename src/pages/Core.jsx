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

  useEffect(() => {
    dbFetch('team', 'created_at', true).then(({ data }) => {
      if (data && data.length > 0) setTeam(data)
    })
  }, [])

  // Dynamic categorization: single source of truth from SEEDS / DB
  const leaders = team.filter(m => m.category === 'Organizer' || m.roleTag?.toLowerCase().includes('organizer'))
  const domainLeads = team.filter(m => !leaders.includes(m) && m.category !== 'Core Member')
  const coreMembers = team.filter(m => !leaders.includes(m) && m.category === 'Core Member')

  return (
    <div className="grid-bg min-h-screen border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-24 md:pb-40">

        {/* Hero Section */}
        <section className="mb-16 md:mb-32 text-center bg-white border-4 border-black p-6 md:p-12 brutal-card shadow-brutal-lg rotate-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white border-2 border-black text-[10px] md:text-[12px] font-black uppercase tracking-widest mb-6 md:mb-8 shadow-brutal-sm">
            Meet the Team
          </div>
          <h1 className="font-headline text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 text-black leading-tight md:leading-none uppercase break-words">
            Building the future, <br className="hidden sm:block" />
            <span className="text-white bg-danger px-3 md:px-4 border-2 md:border-4 border-black inline-block mt-2 md:mt-4 shadow-brutal -rotate-2">Together.</span>
          </h1>
          <p className="text-base md:text-xl text-black font-bold max-w-2xl mx-auto leading-relaxed bg-surface-dark p-4 border-2 border-black">
            The GDG SKNCOE core team is a collective of visionary developers and designers committed to fostering a thriving tech ecosystem.
          </p>
        </section>

        {/* Leadership Section */}
        {leaders.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-4 md:gap-6 mb-12 md:mb-16">
              <h2 className="font-headline text-3xl md:text-5xl font-black text-black uppercase tracking-tighter bg-primary text-white border-4 border-black px-4 md:px-6 py-2 shadow-brutal">Leadership</h2>
              <div className="h-2 flex-1 bg-black hidden sm:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {leaders.map((leader, idx) => (
                <LeaderCard key={leader.id || leader.name} person={leader} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* Domain Sections */}
        {domainLeads.length > 0 && (
          <div className="space-y-8 md:space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {domainLeads.map((member, idx) => (
                <LeaderCard key={member.id || member.name} person={member} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Core Members (if added from Admin) */}
        {coreMembers.length > 0 && (
          <section className="mt-12 mb-10">
            <div className="flex items-center gap-4 md:gap-6 mb-10">
              <h2 className="font-headline text-2xl md:text-4xl font-black text-black uppercase tracking-tighter bg-success text-white border-4 border-black px-4 md:px-6 py-2 shadow-brutal">Core Members</h2>
              <div className="h-2 flex-1 bg-black hidden sm:block"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {coreMembers.map((member, idx) => (
                <LeaderCard key={member.id || member.name} person={member} index={idx} />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

export default Core
