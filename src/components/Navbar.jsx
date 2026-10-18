import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContent } from '../context/ContentContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { content } = useContent()

  const defaultLinks = [
    { label: 'Resources', url: '/resources' },
    { label: 'Community', url: '/community' },
  ]
  const dbLinks = content.navLinks.filter(l => !defaultLinks.find(d => d.url === l.url))
  const links = [...dbLinks, ...defaultLinks]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-headline font-black text-lg md:text-xl tracking-tighter uppercase flex items-center gap-2">
          <span className="w-8 h-8 md:w-10 md:h-10 bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm">
            <span className="text-white font-black text-sm md:text-base">G</span>
          </span>
          GDG SKNCOE
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.id || link.label}
              to={link.url}
              className={`px-4 py-2 font-black uppercase text-sm tracking-wide transition-all border-2 ${
                isActive(link.url)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-transparent hover:border-black hover:bg-surface-dark'
              }`}
              target={link.type === 'external' ? '_blank' : undefined}
              rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://gdg.community.dev/gdg-on-campus-shrimati-kashibai-navale-college-of-engineering-pune-india/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-6 py-2 bg-primary text-white font-black uppercase text-sm border-2 border-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Join Now
          </a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-black bg-white shadow-brutal-sm">
          <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t-4 border-black">
          <div className="flex flex-col p-4 gap-2">
            {links.map(link => (
              <Link
                key={link.id || link.label}
                to={link.url}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 font-black uppercase text-sm border-2 ${
                  isActive(link.url)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-200'
                }`}
                target={link.type === 'external' ? '_blank' : undefined}
                rel={link.type === 'external' ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://gdg.community.dev/gdg-on-campus-shrimati-kashibai-navale-college-of-engineering-pune-india/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-3 bg-primary text-white font-black uppercase text-sm border-2 border-black text-center"
            >
              Join the Community
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
