import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbFetch } from '../lib/db'

const defaultEventsData = {
  "2026": [
    {
      id: 'synthera-2026',
      date: 'February 23-25, 2026',
      type: 'Flagship Event - Synthera',
      title: '3 days collaborative event of GDG SKNCOE, SCOE, NBNSSOE',
      color: 'bg-primary'
    }
  ],
  "2025": [
    {
      id: 'cloud-2025',
      date: 'October 26, 2025',
      type: 'Workshop / Study Group',
      title: 'Google Cloud Study Jams: Hands-on Workshop',
      color: 'bg-primary'
    },
    {
      id: 'cyber-2025',
      date: 'October 3, 2025',
      type: 'Speaker Session / Tech Talk',
      title: 'Cyber Threat Intelligence Workshop',
      color: 'bg-danger'
    },
    {
      id: 'orient-2025',
      date: 'September 19, 2025',
      type: 'Info Session',
      title: 'GDGoC Member Orientation 2025',
      color: 'bg-warning'
    },
    {
      id: 'flutter-2025',
      date: 'March 25, 2025',
      type: 'Workshop / Study Group',
      title: 'FlutterFlow Masterclass: Build Flutter Apps Without Code',
      color: 'bg-success'
    },
    {
      id: 'sol-2025',
      date: 'Jan 27, 2025',
      type: 'Hackathon',
      title: 'Solution Series',
      color: 'bg-primary'
    }
  ],
  "2024": [
    {
      id: 'winintro-2024',
      date: 'Dec 25, 2024',
      type: 'Info Session',
      title: 'Tech Winter Break Introduction to Solutions Challenge – GDG On Campus SKNCOE',
      color: 'bg-primary'
    },
    {
      id: 'wint-2024',
      date: 'Dec 6, 2024',
      type: 'Workshop / Study Group',
      title: 'Tech Winter Break – GDG On Campus SKNCOE',
      color: 'bg-danger'
    },
    {
      id: 'orient-2024',
      date: 'Nov 14, 2024',
      type: 'Conference',
      title: 'GDG Orientation: Welcome to the Community!',
      color: 'bg-warning'
    },
    {
      id: 'genai-2024',
      date: 'Oct 4, 2024',
      type: 'Info Session',
      title: 'Gen-AI in Action: Tools, Techniques, and Trends',
      color: 'bg-success'
    }
  ]
}

const TimelineItem = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 md:mb-24"
    >
      {/* Dot */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-white z-10 absolute left-0 md:left-1/2 md:-translate-x-1/2 shadow-brutal-sm group-hover:scale-125 transition-transform">
        <div className={`w-3 h-3 rounded-full ${event.color || 'bg-primary'}`}></div>
      </div>

      {/* Content Card */}
      <div className="w-[calc(100%-3rem)] md:w-[45%] ml-12 md:ml-0 bg-white border-4 border-black p-6 md:p-8 shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1">
        {event.image && (
          <div className="mb-4 border-2 border-black overflow-hidden max-h-56 bg-surface-dark shadow-brutal-sm">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-black ${event.color || 'bg-primary'} text-white shadow-brutal-sm`}>
            {event.type}
          </span>
          <span className="text-sm font-bold text-black opacity-60 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            {event.date}
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-black uppercase leading-tight mb-2">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-sm font-bold text-black/70 leading-relaxed mt-2">
            {event.description}
          </p>
        )}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-black uppercase bg-surface-dark border border-black px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const Events = () => {
  const [selectedYear, setSelectedYear] = useState('2026')
  const [eventsByYear, setEventsByYear] = useState(defaultEventsData)

  useEffect(() => {
    const fetchDbEvents = async () => {
      const { data } = await dbFetch('events')
      if (data && data.length > 0) {
        // Group by extracted year or default
        const grouped = { ...defaultEventsData }
        data.forEach(item => {
          const match = item.date?.match(/\b(202\d)\b/)
          const year = match ? match[1] : '2026'
          if (!grouped[year]) grouped[year] = []

          // Avoid duplicate by id or title
          const exists = grouped[year].some(e => e.id === item.id || e.title === item.title)
          if (!exists) {
            grouped[year] = [item, ...grouped[year]]
          }
        })
        setEventsByYear(grouped)
      }
    }
    fetchDbEvents()
  }, [])

  const years = Object.keys(eventsByYear).sort((a, b) => b - a)
  const currentEvents = eventsByYear[selectedYear] || []

  return (
    <div className="grid-paper min-h-screen pt-24 md:pt-28 pb-24 md:pb-32 border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Hero Section */}
        <header className="mb-12 md:mb-20 text-center md:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12 bg-white border-4 border-black p-6 md:p-10 brutal-card shadow-brutal-lg relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-headline text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tighter text-black mb-6 md:mb-8 leading-[1.0] uppercase"
            >
              Journey <br className="hidden sm:block" /> <span className="bg-warning px-3 md:px-4 py-1 md:py-2 border-2 md:border-4 border-black inline-block mt-2 md:mt-4 -rotate-1 shadow-brutal">Timeline.</span>
            </motion.h1>
            <p className="text-lg md:text-xl text-black font-bold leading-relaxed max-w-xl bg-surface-dark p-4 border-2 border-black">
              From ideation to impact. Explore our community's growth across the years.
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 bg-white p-2 md:p-3 border-4 border-black shadow-brutal shrink-0 relative z-10 w-full lg:w-auto">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`flex-1 lg:flex-none px-4 md:px-8 py-2 md:py-3 font-black uppercase text-sm md:text-base transition-all border-2 border-black ${selectedYear === year
                    ? 'bg-primary text-white shadow-none translate-x-[4px] translate-y-[4px]'
                    : 'bg-white text-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px]'
                  }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 opacity-10 -rotate-12 pointer-events-none hidden md:block">
            <span className="material-symbols-outlined text-[15rem]">timeline</span>
          </div>
        </header>

        {/* Timeline Section */}
        <section className="relative py-12 md:py-20 min-h-[500px] md:min-h-[600px]">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-black"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <TimelineItem key={event.id || `${selectedYear}-${index}`} event={event} index={index} />
                ))
              ) : (
                <div className="bg-white border-4 border-black p-8 text-center max-w-md mx-auto shadow-brutal">
                  <p className="font-headline font-black uppercase text-xl">No events found for {selectedYear}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
    </div>
  )
}

export default Events
