import { useContent } from '../../context/ContentContext';

export default function Dashboard() {
  const { content } = useContent();

  const stats = [
    { label: 'Events', count: content.events.length, color: 'bg-primary' },
    { label: 'Projects', count: content.projects.length, color: 'bg-success' },
    { label: 'Team Members', count: content.team.length, color: 'bg-warning' },
    { label: 'Sponsors', count: content.sponsors.length, color: 'bg-danger' },
    { label: 'FAQs', count: content.faqs.length, color: 'bg-primary' },
    { label: 'Nav Links', count: content.navLinks.length, color: 'bg-success' },
    { label: 'Social Links', count: content.socialLinks.length, color: 'bg-warning' },
    { label: 'Domains', count: content.domains.length, color: 'bg-danger' },
  ];

  return (
    <div>
      <div className="bg-primary text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Dashboard</h1>
      </div>
      <p className="text-gray-600 font-bold mb-8 uppercase">Manage all content for the GDG SKNCOE website</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white border-2 border-black p-6 shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1">
            <div className={`w-3 h-3 ${stat.color} border border-black mb-3`}></div>
            <p className="text-sm text-gray-500 font-bold uppercase">{stat.label}</p>
            <p className="text-4xl font-headline font-black text-black">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-black p-6 shadow-brutal">
        <h2 className="text-xl font-headline font-black uppercase mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/admin/events" className="p-4 border-2 border-black hover:bg-surface-dark transition-colors">
            <h3 className="font-black uppercase">Add Event</h3>
            <p className="text-sm text-gray-500 font-bold">Create a new event</p>
          </a>
          <a href="/admin/projects" className="p-4 border-2 border-black hover:bg-surface-dark transition-colors">
            <h3 className="font-black uppercase">Add Project</h3>
            <p className="text-sm text-gray-500 font-bold">Showcase a new project</p>
          </a>
          <a href="/admin/team" className="p-4 border-2 border-black hover:bg-surface-dark transition-colors">
            <h3 className="font-black uppercase">Add Member</h3>
            <p className="text-sm text-gray-500 font-bold">Add a team member</p>
          </a>
          <a href="/admin/sponsors" className="p-4 border-2 border-black hover:bg-surface-dark transition-colors">
            <h3 className="font-black uppercase">Add Sponsor</h3>
            <p className="text-sm text-gray-500 font-bold">Add a sponsor logo</p>
          </a>
        </div>
      </div>
    </div>
  );
}
