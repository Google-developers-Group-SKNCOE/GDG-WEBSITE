import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { dbFetch } from '../lib/db'

const domains = [
  { icon: 'html', title: 'Web Development', classColor: 'text-primary' },
  { icon: 'smartphone', title: 'App Development', classColor: 'text-success' },
  { icon: 'cloud', title: 'Cloud Computing', classColor: 'text-primary' },
  { icon: 'shield', title: 'Cybersecurity', classColor: 'text-danger' },
  { icon: 'terminal', title: 'Comp. Programming', classColor: 'text-black' },
  { icon: 'palette', title: 'UI/UX Design', classColor: 'text-danger' },
  { icon: 'alternate_email', title: 'Social media', classColor: 'text-warning' },
  { icon: 'calendar_today', title: 'Events Ops', classColor: 'text-primary' },
  { icon: 'diversity_2', title: 'WIT Community', classColor: 'text-warning' },
  { icon: 'psychology', title: 'AI / ML', classColor: 'text-success' },
  { icon: '💰', title: 'Sponsorship', classColor: 'text-black', isEmoji: true },
  { icon: '😊', title: 'Wanna Join Us ?', classColor: 'text-primary', isEmoji: true }
]

const partners = [
  "/sponsors/WhatsApp Image 2026-05-01 at 3.07.58 PM.jpeg",
  "/sponsors/WhatsApp Image 2026-05-01 at 3.09.10 PM.jpeg",
  "/sponsors/WhatsApp Image 2026-05-01 at 3.10.14 PM.jpeg",
  "/sponsors/WhatsApp Image 2026-05-01 at 3.11.00 PM.jpeg",
  "/sponsors/WhatsApp Image 2026-05-01 at 3.12.41 PM.jpeg",
  "/sponsors/imresizer-Soli.jpeg"
]

const Home = () => {
  const [sponsors, setSponsors] = useState([])

  useEffect(() => {
    dbFetch('sponsors').then(({ data }) => {
      if (data && data.length > 0) setSponsors(data)
    })
  }, [])

  // Use DB sponsor logos if available, otherwise fall back to hardcoded partner images
  const displayPartners = sponsors.length > 0
    ? sponsors.map(s => ({ src: s.logo, name: s.name, url: s.url }))
    : partners.map(src => ({ src, name: '', url: null }))

  return (
    <main className="relative pt-24 md:pt-32 space-y-24 md:space-y-40 grid-paper min-h-screen border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">

      {/* Hero Section */}
      <section className="px-6 max-w-full mx-auto">
        <div className="relative w-full pt-8 pb-8 md:pt-16 md:pb-12 flex flex-col items-center text-center">

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-headline font-black text-black leading-[1.1] md:leading-none mb-8 max-w-4xl tracking-tighter uppercase break-words">
            Empowering <br className="hidden sm:block" />
            <span className="text-white bg-primary px-3 md:px-4 border-2 md:border-4 border-black inline-block mt-4 shadow-brutal -rotate-2 transform">Innovators</span>
          </h1>
          <p className="text-base md:text-lg text-black mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-bold bg-white p-4 border-2 border-black shadow-brutal-sm relative z-10">
            Google Developer Groups On-Campus at SKNCOE is where technical excellence meets collaborative spirit. Join 500+ students building the future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mt-4 w-full sm:w-auto px-4 sm:px-0">
            <Link to="/events" className="bg-primary text-white px-8 md:px-10 py-4 md:py-5 rounded-none text-lg md:text-xl brutal-btn w-full sm:w-auto">
              Explore Events
            </Link>
            <a 
              href="https://qubit-live.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white text-black px-8 md:px-10 py-4 md:py-5 rounded-none text-lg md:text-xl brutal-btn flex items-center justify-center w-full sm:w-auto"
            >
              Qubit For Quiz ❤️
            </a>
          </div>
        </div>
      </section>

      {/* Vision & Ethics */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-10">
          <motion.div
            className="bg-white p-8 md:p-14 brutal-card rounded-none relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 md:w-12 md:h-12 bg-warning border-2 border-black shadow-brutal-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-black font-black text-xl md:text-2xl">visibility</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-headline font-black text-black mb-4 md:mb-5 tracking-tight uppercase">Our Mission</h2>
            <div className="w-12 md:w-16 h-2 bg-black mb-6"></div>
            <p className="text-sm md:text-base text-black font-bold leading-relaxed">
              To bridge the gap between academic theory and industry practice. We provide SKNCOE developers with access to Google's cutting-edge technologies, fostering an environment where curiosity thrives and real-world impact is the benchmark.
            </p>
          </motion.div>
          <motion.div
            className="bg-white p-8 md:p-14 brutal-card rounded-none relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 md:w-12 md:h-12 bg-success border-2 border-black shadow-brutal-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-black font-black text-xl md:text-2xl">auto_awesome</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-headline font-black text-black mb-4 md:mb-5 tracking-tight uppercase">Core Principles</h2>
            <div className="w-12 md:w-16 h-2 bg-black mb-6"></div>
            <p className="text-sm md:text-base text-black font-bold leading-relaxed">
              We value radically open collaboration. Our community is built on the belief that technology should be accessible, inclusive, and built ethically. We don't just write code; we cultivate a culture of shared growth and mentorship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Domains Bento Grid */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6 bg-white p-6 md:p-8 border-4 border-black shadow-brutal text-center md:text-left translate-y-2 md:translate-y-4 translate-x-2 md:translate-x-4 rotate-1 max-w-4xl mx-auto relative z-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-headline font-black text-black mb-2 tracking-tight uppercase">Technical Ecosystem</h2>
            <p className="text-black font-bold text-base md:text-lg">Dive into specialized domains led by campus experts and industry veterans.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mt-16">
          {domains.map((item, idx) => (
            <div key={idx} className="brutal-card bg-white p-4 md:p-6 rounded flex flex-col justify-between h-32 md:h-40 group">
              <span className={`${item.isEmoji ? '' : 'material-symbols-outlined'} ${item.classColor} text-3xl md:text-4xl group-hover:scale-110 transition-transform`}>{item.icon}</span>
              <h3 className="font-headline font-black text-xs md:text-sm text-black uppercase mt-3 md:mt-4">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-8 pb-20 md:pb-24 -mt-8 md:-mt-16 border-y-4 border-black bg-white overflow-hidden">
        <div className="px-6 max-w-7xl mx-auto flex flex-col items-center">
          <div className="bg-black text-white px-4 py-2 border-2 border-black font-black uppercase tracking-widest mb-10 md:mb-12 shadow-brutal-sm -rotate-2 relative z-10 text-xs md:text-sm">
            Proudly Supported By
          </div>
        </div>
        <div className="w-full py-3">
          <div className="flex animate-marquee items-center" style={{ width: 'max-content' }}>
            {[...displayPartners, ...displayPartners].map((partner, idx) => (
              <div key={idx} className="brutal-card bg-white p-2 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center shrink-0 mx-4 md:mx-6">
                {partner.url ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" title={partner.name}>
                    <img
                      className="w-full h-full object-contain filter grayscale contrast-200 hover:grayscale-0 transition-all duration-300 hover:scale-[1.04] cursor-pointer"
                      alt={partner.name || `Partner ${idx + 1}`}
                      src={partner.src}
                    />
                  </a>
                ) : (
                  <img
                    className="w-full h-full object-contain filter grayscale contrast-200 hover:grayscale-0 transition-all duration-300 hover:scale-[1.04] cursor-pointer"
                    alt={partner.name || `Partner ${idx + 1}`}
                    src={partner.src}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="px-6 max-w-7xl mx-auto mb-24 md:mb-32">
        <div className="brutal-card bg-white flex flex-col lg:flex-row overflow-hidden">
          <div className="lg:w-1/3 p-8 md:p-16 flex flex-col justify-center bg-white border-b-4 lg:border-b-0 lg:border-r-4 border-black">
            <h2 className="text-3xl md:text-4xl font-headline font-black text-black mb-4 md:mb-6 uppercase tracking-tight">Our Base</h2>
            <p className="text-base md:text-lg text-black font-bold mb-8 md:mb-10 leading-relaxed">
              Visit us at the Technical Block. Weekly coffee chats and rapid-prototyping every Friday.
            </p>
            <div className="space-y-4 md:space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white flex items-center justify-center border-2 border-black shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-2xl">location_on</span>
                </div>
                <span className="text-sm md:text-base font-black uppercase tracking-tight">SKNCOE Campus, Block A, 402</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white flex items-center justify-center border-2 border-black shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-2xl">mail</span>
                </div>
                <span className="text-sm md:text-base font-black uppercase tracking-tight overflow-hidden text-ellipsis">gdg.skncoe@gmail.com</span>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 h-[300px] md:h-[500px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.092770281643!2d73.8122393750005!3d18.472719271959724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc29532822a758d%3A0x679412117565362e!2sSmt.%20Kashibai%20Navale%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1714400000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="SKNCOE Location"
              className="grayscale contrast-125"
            ></iframe>
            <div className="absolute top-4 md:top-8 right-4 md:right-8 bg-warning border-2 md:border-4 border-black p-2 md:p-4 font-black uppercase shadow-brutal text-xs md:text-sm rotate-3">
              SKNCOE Pune
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 max-w-4xl mx-auto pb-20 md:pb-32">
        <div className="bg-primary text-white border-4 border-black p-3 md:p-4 mb-8 md:mb-12 shadow-brutal inline-block rotate-2">
          <h2 className="text-3xl md:text-4xl font-headline font-black tracking-tight uppercase m-0">Questions?</h2>
        </div>
        <div className="space-y-4 md:space-y-6">
          <details className="group bg-white rounded-none border-4 border-black brutal-card" open>
            <summary className="list-none px-6 md:px-8 py-4 md:py-6 cursor-pointer flex justify-between items-center bg-surface-dark border-b-4 border-black font-headline font-black text-black text-base md:text-lg uppercase transition-colors group-hover:bg-warning">
              Who can join GDG On-Campus SKNCOE?
              <span className="material-symbols-outlined text-black group-open:-rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="px-6 md:px-8 py-4 md:py-6 text-black text-sm md:text-base font-bold leading-relaxed bg-white">
              Open to all students across all branches and years. Whether you're a designer, coder, or community builder, there's a place for you.
            </div>
          </details>
          <details className="group bg-white rounded-none border-4 border-black brutal-card">
            <summary className="list-none px-6 md:px-8 py-4 md:py-6 cursor-pointer flex justify-between items-center bg-surface-dark border-b-4 border-transparent group-open:border-black font-headline font-black text-black text-base md:text-lg uppercase transition-colors group-hover:bg-warning">
              How can I become a core team member?
              <span className="material-symbols-outlined text-black group-open:-rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="px-6 md:px-8 py-4 md:py-6 text-black text-sm md:text-base font-bold leading-relaxed bg-white border-t-0 hidden group-open:block">
              Applications for the core team open once per academic year. Stay tuned to our social channels for recruitment updates.
            </div>
          </details>
          <details className="group bg-white rounded-none border-4 border-black brutal-card">
            <summary className="list-none px-6 md:px-8 py-4 md:py-6 cursor-pointer flex justify-between items-center bg-surface-dark border-b-4 border-transparent group-open:border-black font-headline font-black text-black text-base md:text-lg uppercase transition-colors group-hover:bg-warning">
              What technologies do you cover?
              <span className="material-symbols-outlined text-black group-open:-rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="px-6 md:px-8 py-4 md:py-6 text-black text-sm md:text-base font-bold leading-relaxed bg-white hidden group-open:block">
              We focus primarily on Google ecosystems like Firebase, Flutter, GCP, and Android, but also explore modern stacks like React, Next.js, and PyTorch.
            </div>
          </details>
        </div>
      </section>

    </main>
  )
}

export default Home
