import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-24 md:mt-40 bg-white border-t-4 border-black pt-16 md:pt-24 pb-8 md:pb-12 relative overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-50 z-0"></div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24 relative z-10">

        <div className="col-span-1 md:col-span-2 space-y-6 md:space-y-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="GDG Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight font-headline uppercase text-black">GDG SKNCOE</span>
          </div>
          <p className="text-sm md:text-black font-medium max-w-sm mx-auto md:mx-0 leading-relaxed border-l-0 md:border-l-4 border-warning md:pl-4">
            Building a world-class developer ecosystem at SKNCOE. Join us to learn, grow, and build meaningful tech.
          </p>
        </div>

        <div className="text-center md:text-left">
          <h5 className="font-headline font-black text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-black mb-4 md:mb-6">Explore</h5>
          <ul className="space-y-3 md:space-y-4 text-xs md:text-sm font-bold text-black uppercase">
            <li><Link to="/" className="hover:text-primary hover:underline transition-colors">Home</Link></li>
            <li><Link to="/events" className="hover:text-primary hover:underline transition-colors">Events</Link></li>
            <li><Link to="/resources" className="hover:text-primary hover:underline transition-colors">Resources</Link></li>
            <li><Link to="/core" className="hover:text-primary hover:underline transition-colors">Our Community</Link></li>
            <li><a href="https://qubit-live.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline transition-colors">Qubit</a></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h5 className="font-headline font-black text-[14px] md:text-[13px] uppercase tracking-[0.2em] text-black mb-6 md:mb-6">Connect</h5>
          <div className="flex justify-center md:justify-start gap-4 md:gap-4">
            <a href="https://chat.whatsapp.com/FW4TdHTASgzGPJ4ZuxyJyD" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-12 md:h-12 bg-white brutal-btn rounded flex items-center justify-center p-2.5">
              <img src="https://www.svgrepo.com/show/475692/whatsapp-color.svg" alt="WhatsApp" className="w-full h-full object-contain" />
            </a>
            <a href="https://www.instagram.com/gdg_skncoe?igsh=MWNrcmlha2NzejJmag%3D%3D" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-12 md:h-12 bg-white brutal-btn rounded flex items-center justify-center p-2.5">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="w-full h-full object-contain" />
            </a>
            <a href="https://www.linkedin.com/company/gdgoncampus/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-12 md:h-12 bg-white brutal-btn rounded flex items-center justify-center p-2.5">
              <img src="https://www.svgrepo.com/show/475661/linkedin-color.svg" alt="LinkedIn" className="w-full h-full object-contain" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-12 border-t-2 border-black flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 relative z-10 bg-white text-center">
        <p className="text-black text-[10px] md:text-[12px] font-black uppercase">© 2026 Google Developer Groups On-Campus SKNCOE.</p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[10px] md:text-[12px] font-black uppercase text-black">
          <a href="#" className="hover:underline hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-danger">Code of Conduct</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
