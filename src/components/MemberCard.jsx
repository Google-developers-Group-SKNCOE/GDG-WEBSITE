const MemberCard = ({ member }) => {
  return (
    <div className="group bg-white p-4 brutal-card rounded flex flex-col items-center">
      <div className="relative aspect-square w-full mb-5 rounded overflow-hidden border-2 border-black">
        <img 
          alt={member.name} 
          className="w-full h-full object-cover filter saturate-0 contrast-125 group-hover:saturate-100 transition-all duration-500 group-hover:scale-110" 
          src={member.image} 
        />
        <div className="absolute inset-0 bg-primary mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity"></div>
      </div>
      <div className="text-center w-full">
        <h4 className="font-black text-lg text-black mb-1 uppercase tracking-tight">{member.name}</h4>
        <div className="border-t-2 border-black w-12 mx-auto my-2"></div>
        <p className={`text-[11px] ${member.colorClass || 'text-black'} font-black uppercase tracking-widest mb-4 bg-surface-dark py-1 border-2 border-black`}>
          {member.role}
        </p>
        <a href="#" className="w-10 h-10 mx-auto bg-white border-2 border-black flex items-center justify-center brutal-btn rounded text-black hover:bg-black hover:text-white">
          <span className="material-symbols-outlined !text-sm">alternate_email</span>
        </a>
      </div>
    </div>
  )
}

export default MemberCard
