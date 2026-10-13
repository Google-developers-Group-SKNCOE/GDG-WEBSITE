const EventCard = ({ event, index }) => {
  const isRight = index % 2 === 0
  const colorMap = {
    primary: {
      border: 'border-primary',
      text: 'text-primary',
      bgSolid: 'bg-primary'
    },
    danger: {
      border: 'border-danger',
      text: 'text-danger',
      bgSolid: 'bg-danger'
    },
    warning: {
      border: 'border-warning',
      text: 'text-warning',
      bgSolid: 'bg-warning'
    },
    success: {
      border: 'border-success',
      text: 'text-success',
      bgSolid: 'bg-success'
    }
  }

  const tw = colorMap[event.color] || colorMap['primary']

  return (
    <div className={`relative flex flex-col ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-center group z-10 hover:z-20`}>
      <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-none bg-white border-4 border-black z-10 shadow-brutal transition-all group-hover:scale-125 group-hover:bg-black`}></div>
      
      <div className={`w-full md:w-1/2 ${isRight ? 'md:pr-20 md:text-right' : 'md:pl-20 md:text-left'} hidden md:block`}>
        <span className={`bg-black text-white px-3 py-1 font-black tracking-[0.2em] text-[10px] uppercase border-2 border-black inline-block shadow-brutal-sm`}>{event.label}</span>
        <h3 className="text-4xl font-black font-headline mt-4 text-black uppercase tracking-tight">{event.title}</h3>
      </div>
      
      <div className={`w-full md:w-1/2 ${isRight ? 'md:pl-20' : 'md:pr-20'}`}>
        <article className={`bg-white p-8 rounded brutal-card overflow-hidden`}>
          <div className="relative overflow-hidden rounded mb-8 border-2 border-black z-0">
            <img alt={event.title} className="w-full h-64 object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 hover:scale-105" src={event.image} />
          </div>
          
          <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-4">
            <time className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
              <span className={`w-3 h-3 border-2 border-black ${tw.bgSolid}`}></span> {event.date}
            </time>
            <span className={`px-4 py-1 bg-white border-2 border-black text-black text-[10px] font-black uppercase shadow-brutal-sm`}>{event.type}</span>
          </div>
          
          <h3 className="text-3xl font-black font-headline mb-4 text-black uppercase tracking-tight md:hidden">{event.title}</h3>
          
          <p className="text-black font-medium leading-relaxed text-sm">
            {event.description}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            {event.tags.map(tag => (
              <span key={tag} className={`px-4 py-2 ${tw.bgSolid} text-white border-2 border-black text-[11px] font-black uppercase shadow-brutal-sm hover:translate-y-1 hover:shadow-none transition-all cursor-default`}>
                {tag}
              </span>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}

export default EventCard
