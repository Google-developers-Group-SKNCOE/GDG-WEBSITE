import { useState } from 'react';
import supabase from '../../lib/supabase';
import { useContent } from '../../context/ContentContext';
import ImageInput from '../../components/ImageInput';

const RES_TYPES = ['photos', 'videos', 'ppt', 'link', 'document', 'github', 'other'];

const ResourcesManager = () => {
  const { content } = useContent();
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ event_id: '', name: '', link: '', type: 'link' });
  const [editing, setEditing] = useState(null);

  const fetchResources = async () => {
    const { data } = await supabase.from('resources').select('*').order('sort_order');
    setResources(data || []);
  };

  useState(() => { fetchResources(); }, []);

  const handleSave = async () => {
    if (editing) {
      await supabase.from('resources').update(form).eq('id', editing);
    } else {
      await supabase.from('resources').insert({ ...form, sort_order: resources.length + 1 });
    }
    setForm({ event_id: '', name: '', link: '', type: 'link' });
    setEditing(null);
    fetchResources();
  };

  const handleDelete = async (id) => {
    await supabase.from('resources').delete().eq('id', id);
    fetchResources();
  };

  const startEdit = (resource) => {
    setEditing(resource.id);
    setForm({ event_id: resource.event_id, name: resource.name, link: resource.link, type: resource.type });
  };

  return (
    <div>
      <div className="bg-primary text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Resources</h1>
      </div>

      <div className="bg-white border-2 border-black p-6 shadow-brutal mb-6">
        <h2 className="text-xl font-headline font-black uppercase mb-4">{editing ? 'Edit Resource' : 'Add Resource'}</h2>
        <div className="space-y-3">
          <select value={form.event_id} onChange={e => setForm({...form, event_id: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold">
            <option value="">Select Event</option>
            {content.events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
          <input type="text" placeholder="Resource Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
          <ImageInput label="Link" placeholder="Link URL or upload file image" value={form.link} onChange={v => setForm({...form, link: v})} />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold">
            {RES_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary text-white px-6 py-2 border-2 border-black font-bold uppercase">Save</button>
            {editing && <button onClick={() => { setEditing(null); setForm({ event_id: '', name: '', link: '', type: 'link' }); }} className="bg-gray-300 px-6 py-2 border-2 border-black font-bold uppercase">Cancel</button>}
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Name</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Type</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Event</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Link</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {resources.map(resource => (
              <tr key={resource.id} className="hover:bg-surface-dark">
                <td className="px-4 py-3 text-sm font-bold">{resource.name}</td>
                <td className="px-4 py-3 text-sm font-bold">{resource.type}</td>
                <td className="px-4 py-3 text-sm font-bold max-w-xs truncate">{content.events.find(e => e.id === resource.event_id)?.title || '-'}</td>
                <td className="px-4 py-3 text-sm text-blue-600 truncate max-w-xs">{resource.link}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => startEdit(resource)} className="text-primary font-bold uppercase mr-3">Edit</button>
                  <button onClick={() => handleDelete(resource.id)} className="text-danger font-bold uppercase">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourcesManager;
