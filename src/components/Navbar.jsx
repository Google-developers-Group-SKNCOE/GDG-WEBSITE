import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const themeClasses = {
    '/': { text: 'text-primary', hover: 'hover:text-primary', bg: 'bg-primary' },
    '/events': { text: 'text-success', hover: 'hover:text-success', bg: 'bg-success' },
    '/core': { text: 'text-warning', hover: 'hover:text-warning', bg: 'bg-warning' },
    '/resources': { text: 'text-primary', hover: 'hover:text-primary', bg: 'bg-primary' },
  }

  const currentTheme = themeClasses[location.pathname] || themeClasses['/']

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Core Team', path: '/core' },
    { label: 'Resources', path: '/resources' },
    { label: 'Qubit', path: 'https://qubit-live.vercel.app/', isExternal: true }
  ]

  return (
    <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] max-w-4xl">
      <div className="brutal-nav rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="GDG Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-[11px] md:text-sm font-black tracking-tight font-headline uppercase text-black">GDG SKNCOE</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 font-headline text-[13px] font-black tracking-widest uppercase">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            const linkTheme = themeClasses[link.path] || themeClasses['/']
            
            if (link.isExternal) {
              return (
                <a
                  key={link.label}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-danger transition-colors"
                >
                  {link.label}
                </a>
              )
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors relative pb-1 ${isActive
                    ? linkTheme.text
                    : `text-black ${linkTheme.hover}`
                  }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className={`absolute -bottom-2 left-0 w-full h-1 ${currentTheme.bg} rounded-full`}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <a 
            href="https://gdg.community.dev/gdg-on-campus-shrimati-kashibai-navale-college-of-engineering-pune-india/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden sm:block bg-warning text-black text-[10px] md:text-xs px-4 md:px-5 py-2 md:py-2.5 rounded-full brutal-btn font-black uppercase tracking-widest"
          >
            Join Now
          </a>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-black font-black">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-full left-0 w-full mt-2 md:hidden"
          >
            <div className="bg-white border-4 border-black p-6 shadow-brutal-lg flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                const linkTheme = themeClasses[link.path] || themeClasses['/']
                
                return (
                  <Link
                    key={link.label}
                    to={link.isExternal ? '#' : link.path}
                    onClick={() => {
                      if (link.isExternal) window.open(link.path, '_blank')
                    }}
                    className={`text-xl font-headline font-black uppercase tracking-widest transition-colors ${
                      isActive ? linkTheme.text : 'text-black'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <hr className="border-2 border-black" />
              <a 
                href="https://gdg.community.dev/gdg-on-campus-shrimati-kashibai-navale-college-of-engineering-pune-india/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full text-center bg-warning text-black text-sm px-6 py-4 border-2 border-black brutal-btn font-black uppercase tracking-widest"
              >
                Join the Community
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
