import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

export default function NavigationManager() {
  const { content, insertContent, updateContent, deleteContent } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startNew = () => {
    setEditing('new');
    setForm({ label: '', url: '', type: 'internal', sort_order: content.navLinks.length + 1 });
  };

  const startEdit = (link) => {
    setEditing(link.id);
    setForm({ ...link });
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await insertContent('nav_links', form);
    } else {
      await updateContent('nav_links', editing, form);
    }
    setEditing(null);
    setForm({});
  };

  return (
    <div>
      <div className="bg-primary text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Navigation</h1>
      </div>
      <div className="flex justify-end mb-4">
        <button onClick={startNew} className="bg-primary text-white px-6 py-2 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm transition-all">+ Add</button>
      </div>

      <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Label</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">URL</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Type</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {content.navLinks.map(link => (
              <tr key={link.id} className="hover:bg-surface-dark">
                <td className="px-4 py-3 text-sm font-bold">{link.label}</td>
                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{link.url}</td>
                <td className="px-4 py-3 text-sm font-bold">{link.type}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => startEdit(link)} className="text-primary font-bold uppercase mr-3">Edit</button>
                  <button onClick={() => deleteContent('nav_links', link.id)} className="text-danger font-bold uppercase">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-brutal-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-headline font-black uppercase mb-4">{editing === 'new' ? 'Add Link' : 'Edit Link'}</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Label" value={form.label || ''} onChange={e => setForm({...form, label: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <input type="text" placeholder="URL" value={form.url || ''} onChange={e => setForm({...form, url: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <select value={form.type || 'internal'} onChange={e => setForm({...form, type: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold">
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="bg-primary text-white px-6 py-2 border-2 border-black font-bold uppercase">Save</button>
                <button onClick={() => setEditing(null)} className="bg-gray-300 px-6 py-2 border-2 border-black font-bold uppercase">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
