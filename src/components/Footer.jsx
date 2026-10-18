import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'

const Footer = () => {
  const { content } = useContent()
  const { socialLinks } = content

  const defaultSocials = [
    { platform: 'WhatsApp', url: 'https://chat.whatsapp.com/FW4TdHTASgzGPJ4ZuxyJyD' },
    { platform: 'Instagram', url: 'https://www.instagram.com/gdg_skncoe' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/gdgoncampus/' },
  ]

  const socials = socialLinks.length > 0 ? socialLinks : defaultSocials

  const getSocialIcon = (platform) => {
    const icons = {
      WhatsApp: 'chat',
      Instagram: 'photo_camera',
      LinkedIn: 'work',
      Twitter: 'alternate_email',
      YouTube: 'play_circle',
    }
    return icons[platform] || 'link'
  }

  return (
    <footer className="bg-black text-white border-t-4 border-black">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div>
            <h3 className="font-headline font-black text-xl md:text-2xl uppercase tracking-tighter mb-4">GDG SKNCOE</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building a world-class developer ecosystem at SKNCOE. Join us to learn, grow, and build meaningful tech.
            </p>
          </div>

          <div>
            <h4 className="font-black uppercase text-sm tracking-widest mb-4 text-gray-300">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white text-sm transition-colors">Events</Link></li>
              <li><Link to="/core" className="text-gray-400 hover:text-white text-sm transition-colors">Our Community</Link></li>
              <li><a href="https://qubit-live.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">Qubit</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-sm tracking-widest mb-4 text-gray-300">Connect</h4>
            <div className="flex gap-3">
              {socials.map(social => (
                <a
                  key={social.id || social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white text-black border-2 border-white flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-lg">{getSocialIcon(social.platform)}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase text-sm tracking-widest mb-4 text-gray-300">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Code of Conduct</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs md:text-sm">
            2026 Google Developer Groups On-Campus SKNCOE.
          </p>
          <p className="text-gray-500 text-xs md:text-sm">
            Made with passion by the GDG SKNCOE Team.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
