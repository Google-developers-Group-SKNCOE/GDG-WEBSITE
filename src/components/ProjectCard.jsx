const ProjectCard = ({ project }) => {
  return (
    <div className="lg:col-span-4 bg-white rounded-lg brutal-card p-2 flex flex-col group relative z-10 hover:z-20">
      <div className="h-60 rounded overflow-hidden relative border-b-2 border-black">
        <img 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter grayscale group-hover:grayscale-0" 
          src={project.image} 
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded bg-white border-2 border-black text-black text-[10px] font-black uppercase tracking-widest shadow-brutal-sm">
            {project.badge}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-black mb-3 tracking-tight uppercase group-hover:text-primary transition-colors">{project.title}</h4>
        <p className="text-sm text-black font-medium leading-relaxed mb-8 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between pt-6 border-t-2 border-black mt-auto">
          <div className="flex -space-x-3">
            {project.avatars.map((avatar, idx) => (
              <div 
                key={idx} 
                className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-black ${avatar.colorClass} shadow-brutal-sm group-hover:-translate-y-1 transition-transform z-${10-idx}`}
              >
                {avatar.initials}
              </div>
            ))}
          </div>
          <a href="#" className="font-black text-[13px] uppercase flex items-center gap-1.5 hover:gap-2.5 transition-all text-black hover:text-danger brutal-btn bg-warning px-4 py-2 text-[10px]">
            View Code <span className="material-symbols-outlined text-[16px]">east</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
