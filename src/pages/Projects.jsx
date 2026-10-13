import ProjectCard from '../components/ProjectCard'

const projectList = [
  {
    title: 'EcoTrack Mobile',
    description: 'A Flutter-based application that helps students calculate and offset their carbon footprint through campus initiatives.',
    badge: 'Mobile App',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnR2TgHL_ymVCFUBm-iwcLoD4ELhZjU0MQfy9qSk1rq8-Km_d1Cuw60OAg-26HJkz8LBRow4qgqrCXDXw1PlscFOtXEdTBWIJr1_xg6IT1IrcmL-zGnDGpCQtjD3GXpyssnwARGwTQc54iNt7yzOwMt7ph1GstztjWrPFUrZ3p-3OX0DC6CyfieBrAJc_Gf4OIHdEnWNxX5vyuWYGEF8ulmsHMNs1sDTNkac6Z1uYf0DuUVDx-cOj0G2VbDQ7MzsIxHdcEXFDBFQ',
    avatars: [
      { initials: 'JD', colorClass: 'bg-white text-black' },
      { initials: 'AS', colorClass: 'bg-primary text-white' }
    ]
  },
  {
    title: 'SyllabusBot AI',
    description: 'Using LangChain and OpenAI to create a RAG-based chatbot that answers student queries directly from department PDFs.',
    badge: 'AI / ML',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHMnOZDhlR56_bgN6aCOGbm4FpBGOVcZ1cLGuxqdGP7E4YMfXRBs-sJsduihZVUVWCJ4Rbueh3HFhsAGz5Rjd5jTCGOS_BKlUcK_xp5ivGTiuZcdb5tg7lSZvASbpUhSbJJJABdNJWjNSb_pb1sYTS_KpzEdIYhO2YMq9qPevYBIpqcLIVCZGaNGCWmaHwabyfmFI6neqOr84W6w_Wi1RObbeLFNiYwv2Ig3TtQrBNIO4ElZyqHv1kWOITldijrVQkBl0RNbVVSg',
    avatars: [
      { initials: 'MK', colorClass: 'bg-success text-white' }
    ]
  },
  {
    title: 'Alumni Connect',
    description: 'A comprehensive portal for alumni networking built with Next.js, featuring real-time job boards and mentorship matching.',
    badge: 'Web App',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIb2o9aLt6SnHFOPiLqu69IBI_LzIgWDIxjAWyxGutJvB-PbPEkF_ljnTcTSW4rl-OEOv2Jm9ymRql2UpkvXb8Z_E3TWDvZc2CUIJ9rZ3SJUW16GEkU-kgfWsGVdT0DaOGJR3iBDJbtchU6poc71qFjqICC_Ed3pis2M95Pso2kvlqv6V2p6QA9ftQhgVbbR9UjoL5NB0_PYavs811cd4Tr1NRynuU-OVTpFjfV5u4kgNAagAXqXih-92jw5a--UZa4fSYBBgKPw',
    avatars: [
      { initials: 'PR', colorClass: 'bg-danger text-white' },
      { initials: '+3', colorClass: 'bg-warning text-black' }
    ]
  }
]

const Projects = () => {
  return (
    <div className="bg-surface text-on-surface grid-paper min-h-screen border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-24 pb-20 md:pb-32">

        {/* Hero Section */}
        <header className="mb-16 md:mb-24">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 md:gap-12">
            <div className="max-w-3xl bg-white border-4 border-black p-6 md:p-10 brutal-card shadow-brutal-lg">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white border-2 border-black text-[10px] font-black uppercase tracking-widest mb-6 shadow-brutal-sm">
                Innovation Showcase
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter mb-8 leading-tight md:leading-none uppercase break-words">
                Built for the <br /><span className="bg-warning px-3 md:px-4 inline-block mt-2 md:mt-4 border-2 md:border-4 border-black shadow-brutal rotate-1">Community.</span>
              </h1>
              <p className="text-lg md:text-xl text-black font-bold leading-relaxed max-w-xl bg-surface-dark p-4 border-2 border-black">
                A curated collection of impactful projects developed by GDG SKNCOE students. We explore artificial intelligence, cloud infrastructure, and modern web architectures.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3 pb-2 bg-white p-6 border-4 border-black shadow-brutal shrink-0 w-full lg:max-w-sm h-fit">
              <h3 className="w-full text-black font-black uppercase mb-2 border-b-2 border-black pb-2 text-sm">Filter Projects</h3>
              <button className="flex-1 lg:flex-none px-4 md:px-6 py-2 bg-black text-white border-2 border-black font-black uppercase brutal-btn text-xs md:text-sm">All</button>
              <button className="flex-1 lg:flex-none px-4 md:px-6 py-2 bg-white text-black border-2 border-black font-black uppercase brutal-btn text-xs md:text-sm">Web</button>
              <button className="flex-1 lg:flex-none px-4 md:px-6 py-2 bg-white text-black border-2 border-black font-black uppercase brutal-btn text-xs md:text-sm">AI/ML</button>
              <button className="flex-1 lg:flex-none px-4 md:px-6 py-2 bg-white text-black border-2 border-black font-black uppercase brutal-btn text-xs md:text-sm">Mobile</button>
              <button className="flex-1 lg:flex-none px-4 md:px-6 py-2 bg-white text-black border-2 border-black font-black uppercase brutal-btn text-xs md:text-sm">Cloud</button>
            </div>
          </div>
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

          {/* Featured Project */}
          <div className="lg:col-span-8 group bg-white border-4 border-black shadow-brutal-lg hover:shadow-brutal transition-all duration-300 flex flex-col z-20 overflow-hidden">
            <div className="relative h-[400px] md:h-[480px] overflow-hidden border-b-4 border-black">
              <img alt="Featured Project" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 filter grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI8nfVXhTS016nwEu-afrNPZYiPz8cXIgJaeWzEn7ieLKeFXc3EDe_BbEhhnY7TuIwxco41i0y3gTP6oP7VWXMbV9mDu8uW9uP5F2Q-MzPscSZPLPYgOj2K457qUvpnuYkYU98DoAfETzVJSKwW4I4v-UCKzlOH-cpGFV9ABHMwTdsnorcEkxiSqB-h_puUgtv072UtInrn5KUolcS1ph75RtE8LyfhjyOSHZYqDSolO-SP3xIcb_QAaiK69mkyh-wbL8qR71SGQ" />
              <div className="absolute inset-0 bg-primary opacity-60 mix-blend-multiply"></div>
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                  <span className="px-3 md:px-4 py-1.5 md:py-2 bg-white text-black border-2 border-black text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-brutal-sm">Cloud Native</span>
                  <span className="px-3 md:px-4 py-1.5 md:py-2 bg-success text-white border-2 border-black text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-brutal-sm">AI Integration</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white px-4 py-2 bg-black border-2 md:border-4 border-black inline-block mb-4 tracking-tighter uppercase leading-tight w-fit">
                  Project Sentinel:<br />Campus Hub
                </h3>
                <p className="text-black bg-white p-3 md:p-4 font-bold text-base md:text-lg leading-relaxed border-2 border-black max-w-2xl shadow-brutal-sm hidden sm:block">
                  An automated campus monitoring system utilizing TensorFlow and Google Cloud Platform to optimize student facility usage in real-time.
                </p>
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-dark mt-auto gap-6 sm:gap-0">
              <div className="flex flex-wrap gap-2 md:gap-3">
                <span className="px-3 md:px-4 py-1.5 md:py-2 bg-white border-2 border-black text-black text-[10px] md:text-xs font-black uppercase shadow-brutal-sm">React</span>
                <span className="px-3 md:px-4 py-1.5 md:py-2 bg-white border-2 border-black text-black text-[10px] md:text-xs font-black uppercase shadow-brutal-sm">Python</span>
                <span className="px-3 md:px-4 py-1.5 md:py-2 bg-white border-2 border-black text-black text-[10px] md:text-xs font-black uppercase shadow-brutal-sm">GCP</span>
              </div>
              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                <button className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center brutal-btn shrink-0">
                  <span className="material-symbols-outlined font-black">terminal</span>
                </button>
                <button className="flex-1 sm:flex-none px-6 md:px-8 py-3 bg-danger text-white border-2 border-black font-black uppercase text-xs md:text-sm flex items-center justify-center gap-2 brutal-btn whitespace-nowrap">
                  View Demo <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Join Card */}
          <div className="lg:col-span-4 bg-primary border-4 border-black shadow-brutal-lg p-6 md:p-10 flex flex-col justify-between relative overflow-hidden group min-h-[500px]">
            <div className="relative z-10 bg-white p-6 md:p-8 border-4 border-black shadow-brutal-sm h-full flex flex-col">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-warning border-4 border-black flex items-center justify-center mb-6 md:mb-8 shadow-brutal-sm -rotate-6">
                <span className="material-symbols-outlined text-black font-black text-2xl md:text-3xl">rocket_launch</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-black mb-4 md:mb-6 tracking-tighter uppercase leading-none">Build<br />with us.</h3>
              <p className="text-sm md:text-base text-black font-bold mb-8 md:mb-10 leading-relaxed border-l-4 border-primary pl-4">
                Have a vision for the next big thing? We provide the resources, mentorship, and community to turn your idea into code.
              </p>
              <ul className="space-y-4 mb-8 md:mb-10 text-xs md:text-sm">
                <li className="flex items-center gap-3 text-black font-black uppercase">
                  <span className="material-symbols-outlined text-success text-xl md:text-2xl">verified</span>
                  GCP Credits & Infra
                </li>
                <li className="flex items-center gap-3 text-black font-black uppercase">
                  <span className="material-symbols-outlined text-success text-xl md:text-2xl">verified</span>
                  Expert Mentorship
                </li>
                <li className="flex items-center gap-3 text-black font-black uppercase">
                  <span className="material-symbols-outlined text-success text-xl md:text-2xl">verified</span>
                  Github Orgs
                </li>
              </ul>

              <a 
                href="https://gdg.community.dev/gdg-on-campus-shrimati-kashibai-navale-college-of-engineering-pune-india/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-4 mt-auto border-2 border-black bg-black text-white font-black uppercase brutal-btn hover:bg-warning hover:text-black text-sm md:text-base flex items-center justify-center"
              >
                Join the community
              </a>
            </div>
          </div>

          {/* Regular Projects Map */}
          {projectList.map((p, idx) => (
            <div key={idx} className="lg:col-span-4">
              <ProjectCard project={p} />
            </div>
          ))}

        </div>

        {/* Pagination */}
        <div className="mt-16 md:mt-24 flex justify-center pb-12 md:pb-20">
          <button className="group flex flex-col items-center gap-3 md:gap-4 text-black font-black uppercase bg-white p-5 md:p-6 border-4 border-black brutal-btn shadow-brutal w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined group-hover:animate-bounce">keyboard_double_arrow_down</span>
              Load more builds
            </div>
          </button>
        </div>

      </main>
    </div>
  )
}

export default Projects
