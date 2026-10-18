import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext'

const Core = () => {
  const { content } = useContent()
  const { team } = content

  const leaders = team.filter(m => m.category === 'lead')
  const domainLeads = team.filter(m => m.category === 'domain_lead')
  const coLeads = team.filter(m => m.category === 'co_lead')

  const getPhotoUrl = (member) => {
    if (member.photo_url) return member.photo_url
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=000&color=fff&size=200&font-size=0.33`
  }

  const getDomainKey = (role) => {
    return role.replace(' Lead', '').replace(' Co-Lead', '').replace(' Development', '').trim().toLowerCase()
  }

  const coLeadsByDomain = coLeads.reduce((acc, cl) => {
    const key = getDomainKey(cl.role)
    if (!acc[key]) acc[key] = []
    acc[key].push(cl)
    return acc
  }, {})

  return (
    <div className="grid-paper min-h-screen pt-24 md:pt-28 pb-24 md:pb-32 border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-7xl mx-auto px-4 md:px-6">

        <header className="mb-12 md:mb-20 text-center bg-white border-4 border-black p-6 md:p-10 shadow-brutal-lg relative overflow-hidden">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10"
          >
            <span className="inline-block bg-primary text-white px-4 py-1 border-2 border-black font-black uppercase text-xs md:text-sm tracking-widest mb-4 md:mb-6 shadow-brutal-sm">
              Meet the Team
            </span>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black mb-4 md:mb-6 uppercase">
              Building the future, <span className="bg-success px-3 md:px-4 py-1 border-2 md:border-4 border-black inline-block mt-2 -rotate-1 shadow-brutal">Together.</span>
            </h1>
            <p className="text-base md:text-lg text-black font-bold leading-relaxed max-w-2xl mx-auto bg-surface-dark p-4 border-2 border-black">
              The GDG SKNCOE core team is a collective of visionary developers and designers committed to fostering a thriving tech ecosystem.
            </p>
          </motion.div>
        </header>

        {leaders.length > 0 && (
          <section className="mb-12 md:mb-20">
            <div className="flex items-center gap-4 mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-headline font-black text-black uppercase tracking-tight">Leadership</h2>
              <div className="flex-1 h-1 bg-black"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {leaders.map((leader, idx) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white border-4 border-black p-6 md:p-8 shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-black overflow-hidden mb-4 md:mb-6 shadow-brutal-sm bg-gray-100">
                    <img src={getPhotoUrl(leader)} alt={leader.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-headline font-black text-black uppercase tracking-tight mb-1">{leader.name}</h3>
                  <p className="text-sm md:text-base font-bold text-gray-600 uppercase tracking-wide">{leader.role}</p>
                  {leader.linkedin_url && (
                    <a href={leader.linkedin_url} target="_blank" rel="noopener noreferrer" className="mt-3 text-primary hover:underline text-sm flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-sm">link</span> LinkedIn
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 md:mb-20">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-headline font-black text-black uppercase tracking-tight">Domain Teams</h2>
            <div className="flex-1 h-1 bg-black"></div>
          </div>

          {domainLeads.map((lead) => {
            const domainKey = getDomainKey(lead.role)
            const domainCoLeads = coLeadsByDomain[domainKey] || []
            const domainName = lead.role.replace(' Lead', '').replace(' Development', '')

            return (
              <div key={lead.id} className="mb-8 md:mb-12">
                <div className="bg-primary text-white border-4 border-black p-3 md:p-4 inline-block mb-4 md:mb-6 shadow-brutal-sm -rotate-1">
                  <h3 className="text-lg md:text-xl font-headline font-black uppercase tracking-tight">{domainName}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border-4 border-black p-4 md:p-6 shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-black overflow-hidden shrink-0 shadow-brutal-sm bg-gray-100">
                      <img src={getPhotoUrl(lead)} alt={lead.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base md:text-lg font-headline font-black text-black uppercase tracking-tight truncate">{lead.name}</h4>
                      <p className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wide">{lead.role}</p>
                      {lead.linkedin_url && (
                        <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="mt-1 text-primary hover:underline text-xs flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-xs">link</span> LinkedIn
                        </a>
                      )}
                    </div>
                  </motion.div>
                  {domainCoLeads.map((coLead) => (
                    <motion.div
                      key={coLead.id}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="bg-white border-4 border-black p-4 md:p-6 shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1 flex items-center gap-4"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-black overflow-hidden shrink-0 shadow-brutal-sm bg-gray-100">
                        <img src={getPhotoUrl(coLead)} alt={coLead.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base md:text-lg font-headline font-black text-black uppercase tracking-tight truncate">{coLead.name}</h4>
                        <p className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wide">{coLead.role}</p>
                        {coLead.linkedin_url && (
                          <a href={coLead.linkedin_url} target="_blank" rel="noopener noreferrer" className="mt-1 text-primary hover:underline text-xs flex items-center gap-1 font-bold">
                            <span className="material-symbols-outlined text-xs">link</span> LinkedIn
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

      </main>
    </div>
  )
}

export default Core
