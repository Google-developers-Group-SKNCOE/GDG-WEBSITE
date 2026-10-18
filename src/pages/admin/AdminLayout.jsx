import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/hero', label: 'Hero Section' },
  { path: '/admin/about', label: 'About & Domains' },
  { path: '/admin/events', label: 'Events' },
  { path: '/admin/projects', label: 'Projects' },
  { path: '/admin/team', label: 'Team Members' },
  { path: '/admin/sponsors', label: 'Sponsors' },
  { path: '/admin/faqs', label: 'FAQs' },
  { path: '/admin/navigation', label: 'Navigation' },
  { path: '/admin/social', label: 'Social Links' },
  { path: '/admin/contact', label: 'Contact Info' },
  { path: '/admin/resources', label: 'Resources' },
  { path: '/admin/community', label: 'Comments' },
  { path: '/admin/campaigns', label: 'Campaigns' },
];

export default function AdminLayout({ children }) {
  const { logout } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-surface-dark grid-paper">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-black text-white transition-all duration-300 flex flex-col border-r-4 border-black`}>
        <div className="p-4 border-b-4 border-white/20 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-lg font-headline font-black uppercase tracking-tight">Admin</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/60 hover:text-white font-black">
            {sidebarOpen ? '<<' : '>>'}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 text-sm font-bold uppercase tracking-wide hover:bg-white/10 transition-colors border-l-4 ${
                location.pathname === item.path ? 'bg-primary text-white border-white' : 'border-transparent'
              }`}
            >
              {sidebarOpen ? item.label : '•'}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t-4 border-white/20">
          <Link to="/" className="block text-sm text-white/60 hover:text-white mb-2 font-bold uppercase">
            {sidebarOpen ? 'View Site' : 'View'}
          </Link>
          <button onClick={logout} className="text-sm text-danger hover:text-red-400 font-bold uppercase">
            {sidebarOpen ? 'Logout' : 'Exit'}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
