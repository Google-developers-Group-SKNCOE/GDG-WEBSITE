import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { dbFetch } from '../lib/db'
import { isSupabaseConfigured } from '../lib/supabase'

const leaders = [
  { id: 'leader-1', name: 'Swarnim Shamgaonkar', roleTag: 'Organizer', roleColor: 'bg-primary', category: 'Organizer', image: '/core-images/organizer.jpeg', linkedin: 'https://www.linkedin.com/in/swarnim-shamgaonkar-b725472b1/' },
  { id: 'leader-2', name: 'Pratham Jadhav', roleTag: 'Co-Organizer', roleColor: 'bg-success', category: 'Organizer', image: '/core-images/co-organizer.jpg', linkedin: 'https://www.linkedin.com/in/jadhavprathammm/' },
]

const domains = [
  {
    lead: { name: 'Sudeep Sakpal', roleTag: 'Web Development Lead', roleColor: 'bg-primary', image: '/core-images/leads/Web Dev Lead.jpg', linkedin: 'https://www.linkedin.com/in/sudeep-sakpal/' },
    coLead: { name: 'Hritika Gupta', roleTag: 'Web Development Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Web dev Colead.jpg', linkedin: 'https://www.linkedin.com/in/hritika3/' },
  },
  {
    lead: { name: 'Niranjan Sonawane', roleTag: 'AI/ML Lead', roleColor: 'bg-primary', image: '/core-images/leads/AIML Lead.jpg', linkedin: 'https://www.linkedin.com/in/niranjan-sonawane-59079728a/' },
    coLead: { name: 'Manasvi Bhandarkar', roleTag: 'AI/ML Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Aiml Co-lead.jpg', linkedin: 'https://www.linkedin.com/in/manasvi-bhandarkar-3a32282a7/' },
  },
  {
    lead: { name: 'Srushti Dawkhar', roleTag: 'Android Development Lead', roleColor: 'bg-primary', image: '/core-images/leads/Android Lead.jpg', linkedin: 'https://www.linkedin.com/in/srushti-d-179146220/' },
    coLead: { name: 'Aditya Khawale', roleTag: 'Android Development Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Android Co lead.jpg', linkedin: 'https://www.linkedin.com/in/aditya-khawale/' },
  },
  {
    lead: { name: 'Tvisha Ghiya', roleTag: 'Competitive Programming Lead', roleColor: 'bg-primary', image: '/core-images/leads/Competitive Lead.jpg', linkedin: 'https://www.linkedin.com/in/tvisha-ghiya-387062314/' },
    coLead: { name: 'Kaiwalya Gunjal', roleTag: 'Competitive Programming Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Competitive Co-lead.jpg', linkedin: 'https://www.linkedin.com/in/kaiwlya-gunjal-561aa828a/' },
  },
  {
    lead: { name: 'Elton Fernandes', roleTag: 'Cyber Security Lead', roleColor: 'bg-primary', image: '/core-images/leads/Cyber Security Lead.jpg', linkedin: 'https://www.linkedin.com/in/elton-fernandes18/' },
    coLead: { name: 'Priyal Sathe', roleTag: 'Cyber Security Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Cyber Security Co lead.jpg', linkedin: 'https://www.linkedin.com/in/priyal-sathe/' },
  },
  {
    lead: { name: 'Vinayak Kapkar', roleTag: 'Event Management Lead', roleColor: 'bg-primary', image: '/core-images/leads/Event Management Lead.jpeg', linkedin: 'https://www.linkedin.com/in/vinayak-kapkar-109b16230/' },
    coLead: { name: 'Shreya Kadam', roleTag: 'Event Management Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Event Management Co-lead.jpg', linkedin: 'https://www.linkedin.com/in/shreya-kadam-b30881355/' },
  },
  {
    lead: { name: 'Aditi Deshpande', roleTag: 'Social Media Lead', roleColor: 'bg-primary', image: '/core-images/leads/Social Media Lead.jpg', linkedin: 'https://www.linkedin.com/in/aditi-deshpande-9aba32274/' },
    coLead: { name: 'Parth Karpe', roleTag: 'Social Media Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Social Media Colead.jpeg', linkedin: null },
  },
  {
    lead: { name: 'Avishkar Choundkar', roleTag: 'Sponsorship Lead', roleColor: 'bg-primary', image: '/core-images/leads/Sponsorship lead.jpg', linkedin: 'https://www.linkedin.com/in/avishkarchoundkar/' },
    coLead: { name: 'Alphiya Kazi', roleTag: 'Sponsorship Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Sponsorship Colead.jpg', linkedin: 'https://www.linkedin.com/in/alphiya-kazi-1609b12a1/' },
  },
  {
    lead: { name: 'Aarya Anekar', roleTag: 'Cloud Computing Lead', roleColor: 'bg-primary', image: '/core-images/leads/Cloud Lead.jpg', linkedin: 'https://www.linkedin.com/in/aaryaa2005/' },
    coLead: { name: 'Harsh Dharmawat', roleTag: 'Cloud Computing Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Cloud Computing Co lead.jpg', linkedin: 'https://www.linkedin.com/in/harsh-dharmawat/' },
  },
  {
    lead: { name: 'Dhanashree Labhe', roleTag: 'Women Tech Lead', roleColor: 'bg-primary', image: '/core-images/leads/Women Tech Lead.jpg', linkedin: 'https://www.linkedin.com/in/dhanashree-labhe-232344281/' },
    coLead: { name: 'Dynanada Thuse', roleTag: 'Women Tech Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/Women Tech Colead.jpg', linkedin: 'https://www.linkedin.com/in/dnyanada-thuse-992654317/' },
  },
  {
    lead: { name: 'Madhura Gore', roleTag: 'UI/UX Lead', roleColor: 'bg-primary', image: '/core-images/leads/UIUX Lead.jpg', linkedin: 'https://www.linkedin.com/in/madhuragore/' },
    coLead: { name: 'Divya Bhandari', roleTag: 'UI/UX Co-Lead', roleColor: 'bg-success', image: '/core-images/coleads/UIUX Colead.jpg', linkedin: 'https://www.linkedin.com/in/divya-bhandari-14b4a1308/' },
  },
]

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
          <img alt={person.name} className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300" src={person.image} />
        </div>
      </div>
      <div className="flex-1">
        <span className={`inline-block px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] border-2 border-black text-white ${person.roleColor} mb-4 shadow-brutal-sm`}>
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
  const [team, setTeam] = useState([...leaders, ...domains.flatMap((domain) => [domain.lead, domain.coLead])])

  useEffect(() => {
    const loadTeam = async () => {
      const { data } = await dbFetch('team')
      const hasLocalAdminChanges = (data || []).some((member) => !['tm-1', 'tm-2'].includes(member.id))
      if (data && data.length > 0 && (isSupabaseConfigured || hasLocalAdminChanges)) {
        setTeam(data)
      }
    }

    loadTeam()
  }, [])

  const leadership = team.filter((member) => ['Organizer', 'Co-Organizer'].includes(member.category) || /organizer/i.test(member.roleTag || ''))
  const coreMembers = team.filter((member) => !leadership.some((leader) => leader.id === member.id))

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
        <section className="mb-10">
          <div className="flex items-center gap-4 md:gap-6 mb-12 md:mb-16">
            <h2 className="font-headline text-3xl md:text-5xl font-black text-black uppercase tracking-tighter bg-warning border-4 border-black px-4 md:px-6 py-2 shadow-brutal">Leadership</h2>
            <div className="h-2 flex-1 bg-black hidden sm:block"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {leadership.map((leader, idx) => (
              <LeaderCard key={leader.id || leader.name} person={leader} index={idx} />
            ))}
          </div>
        </section>

        {/* Domain Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {coreMembers.map((member, idx) => (
            <LeaderCard key={member.id || member.name} person={member} index={idx} />
          ))}
        </div>

      </main>
    </div>
  )
}

export default Core
