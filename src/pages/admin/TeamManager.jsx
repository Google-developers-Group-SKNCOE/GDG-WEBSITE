import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import ImageInput from '../../components/ImageInput';

const CATEGORIES = ['lead', 'domain_lead', 'co_lead'];

export default function TeamManager() {
  const { content, insertContent, updateContent, deleteContent } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [filterCat, setFilterCat] = useState('all');

  const filtered = filterCat === 'all' ? content.team : content.team.filter(m => m.category === filterCat);

  const startNew = () => {
    setEditing('new');
    setForm({ name: '', role: '', category: 'domain_lead', domain: '', photo_url: '', linkedin_url: '', email: '', sort_order: content.team.length + 1 });
  };

  const startEdit = (member) => {
    setEditing(member.id);
    setForm({ ...member });
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await insertContent('team_members', form);
    } else {
      await updateContent('team_members', editing, form);
    }
    setEditing(null);
    setForm({});
  };

  return (
    <div>
      <div className="bg-danger text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Team</h1>
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex gap-2">
          <button onClick={() => setFilterCat('all')} className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm ${filterCat === 'all' ? 'bg-black text-white' : 'bg-white'}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilterCat(c)} className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm ${filterCat === c ? 'bg-black text-white' : 'bg-white'}`}>{c.replace('_', ' ')}</button>
          ))}
        </div>
        <button onClick={startNew} className="bg-primary text-white px-6 py-2 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm transition-all">+ Add</button>
      </div>

      <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Name</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Role</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Category</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Photo</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {filtered.map(member => (
              <tr key={member.id} className="hover:bg-surface-dark">
                <td className="px-4 py-3 text-sm font-bold">{member.name}</td>
                <td className="px-4 py-3 text-sm font-bold">{member.role}</td>
                <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-gray-100 border border-black text-xs font-bold uppercase">{member.category.replace('_', ' ')}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[150px]">{member.photo_url || '-'}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => startEdit(member)} className="text-primary font-bold uppercase mr-3">Edit</button>
                  <button onClick={() => deleteContent('team_members', member.id)} className="text-danger font-bold uppercase">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-brutal-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-headline font-black uppercase mb-4">{editing === 'new' ? 'Add Member' : 'Edit Member'}</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <input type="text" placeholder="Role" value={form.role || ''} onChange={e => setForm({...form, role: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <select value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
              <input type="text" placeholder="Domain" value={form.domain || ''} onChange={e => setForm({...form, domain: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <ImageInput label="Photo" placeholder="Photo URL or upload" value={form.photo_url || ''} onChange={v => setForm({...form, photo_url: v})} />
              <input type="text" placeholder="LinkedIn URL" value={form.linkedin_url || ''} onChange={e => setForm({...form, linkedin_url: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <input type="text" placeholder="Email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
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
