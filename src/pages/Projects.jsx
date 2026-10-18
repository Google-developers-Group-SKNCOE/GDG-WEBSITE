import { useState } from 'react'
import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext'

const Projects = () => {
  const { content } = useContent()
  const { projects } = content
  const [activeFilter, setActiveFilter] = useState('All')

  const featuredProject = projects.find(p => p.featured) || projects[0]
  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(p => p.badge === activeFilter)
  const filters = ['All', ...new Set(projects.map(p => p.badge).filter(Boolean))]

  return (
    <div className="grid-paper min-h-screen pt-24 md:pt-28 pb-24 md:pb-32 border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Hero Section */}
        <header className="mb-12 md:mb-20 text-center bg-white border-4 border-black p-6 md:p-10 brutal-card shadow-brutal-lg relative overflow-hidden">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10"
          >
            <span className="inline-block bg-success text-white px-4 py-1 border-2 border-black font-black uppercase text-xs md:text-sm tracking-widest mb-4 md:mb-6 shadow-brutal-sm">
              Innovation Showcase
            </span>
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black mb-4 md:mb-6 uppercase">
              Built for the <span className="bg-primary px-3 md:px-4 py-1 border-2 md:border-4 border-black inline-block mt-2 -rotate-1 shadow-brutal text-white">Community.</span>
            </h1>
            <p className="text-base md:text-lg text-black font-bold leading-relaxed max-w-2xl mx-auto bg-surface-dark p-4 border-2 border-black">
              A curated collection of impactful projects developed by GDG SKNCOE students. We explore artificial intelligence, cloud infrastructure, and modern web architectures.
            </p>
          </motion.div>
        </header>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 md:px-6 py-2 font-black uppercase text-xs md:text-sm border-2 border-black transition-all ${activeFilter === filter
                  ? 'bg-black text-white shadow-none'
                  : 'bg-white text-black shadow-brutal hover:shadow-brutal-sm'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Featured Project */}
        {featuredProject && activeFilter === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16 bg-white border-4 border-black shadow-brutal-lg overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              <div className="p-6 md:p-12 flex flex-col justify-center">
                <span className="inline-block bg-warning text-black px-3 py-1 border-2 border-black font-black uppercase text-xs tracking-widest mb-4 shadow-brutal-sm w-fit">
                  Featured Project
                </span>
                <h2 className="text-3xl md:text-4xl font-headline font-black text-black uppercase tracking-tight mb-4">{featuredProject.title}</h2>
                <p className="text-base md:text-lg text-black font-bold leading-relaxed mb-6">{featuredProject.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(featuredProject.tags || []).map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-xs px-3 py-1 border border-black font-bold">{tag}</span>
                  ))}
                </div>
                {featuredProject.demo_url && (
                  <a href={featuredProject.demo_url} target="_blank" rel="noopener noreferrer" className="w-fit px-8 py-3 bg-primary text-white font-black uppercase border-2 border-black shadow-brutal hover:shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] inline-block">
                    View Demo
                  </a>
                )}
              </div>
              <div className="bg-gray-100 border-t-4 lg:border-t-0 lg:border-l-4 border-black min-h-[300px] flex items-center justify-center p-8">
                {featuredProject.image_url ? (
                  <img src={featuredProject.image_url} alt={featuredProject.title} className="w-full h-full object-cover border-2 border-black" />
                ) : (
                  <span className="material-symbols-outlined text-[10rem] text-gray-300">code</span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.filter(p => activeFilter !== 'All' || !p.featured).map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border-4 border-black shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className="h-48 bg-gray-100 border-b-4 border-black flex items-center justify-center overflow-hidden">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-gray-300">code</span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="inline-block bg-primary text-white px-2 py-1 border border-black font-black uppercase text-xs tracking-widest mb-3 w-fit">
                  {project.badge || 'Project'}
                </span>
                <h3 className="text-xl font-headline font-black text-black uppercase tracking-tight mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 font-bold leading-relaxed flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-4">
                  {(project.tags || []).slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className="bg-gray-100 text-xs px-2 py-1 border border-gray-300">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join CTA */}
        <section className="mt-16 md:mt-24">
          <div className="bg-success border-4 border-black p-8 md:p-16 text-center shadow-brutal-lg -rotate-1">
            <h2 className="text-3xl md:text-4xl font-headline font-black text-black uppercase tracking-tight mb-4">Build with us.</h2>
            <p className="text-base md:text-lg text-black font-bold leading-relaxed max-w-xl mx-auto mb-6">
              Have a vision for the next big thing? We provide the resources, mentorship, and community to turn your idea into code.
            </p>
            <a
              href="https://gdg.community.dev/gdg-on-campus-shrimati-kashibai-navale-college-of-engineering-pune-india/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 md:px-12 py-3 md:py-4 bg-black text-white font-black text-base md:text-lg uppercase border-2 border-black hover:bg-warning hover:text-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] transition-all inline-block"
            >
              Join the community
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}

export default Projects
