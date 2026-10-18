import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

export default function AboutManager() {
  const { content, updateContent, insertContent, deleteContent } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({ heading: item.heading, body: item.body, section: item.section });
  };

  const handleSave = async () => {
    if (editing) {
      await updateContent('about_content', editing, form);
    } else {
      await insertContent('about_content', { ...form, sort_order: content.about.length + 1 });
    }
    setEditing(null);
    setForm({});
    setMessage('Saved');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <div className="bg-warning text-black border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">About & Domains</h1>
      </div>
      {message && <div className="p-4 border-2 border-black mb-4 font-bold bg-success text-white">{message}</div>}

      <div className="bg-white border-2 border-black p-6 shadow-brutal mb-6">
        <h2 className="text-xl font-headline font-black uppercase mb-4">About Content</h2>
        <div className="space-y-4">
          {content.about.map(item => (
            <div key={item.id} className="border-2 border-black p-4">
              {editing === item.id ? (
                <div className="space-y-3">
                  <input type="text" value={form.heading} onChange={e => setForm({...form, heading: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" placeholder="Heading" />
                  <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} rows={3} className="w-full border-2 border-black px-4 py-2 font-bold" placeholder="Body" />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="bg-primary text-white px-4 py-2 border-2 border-black font-bold uppercase">Save</button>
                    <button onClick={() => setEditing(null)} className="bg-gray-300 px-4 py-2 border-2 border-black font-bold uppercase">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black uppercase">{item.heading}</h3>
                    <p className="text-sm text-gray-600 font-bold">{item.body?.substring(0, 80)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="text-primary font-bold uppercase text-sm">Edit</button>
                    <button onClick={() => deleteContent('about_content', item.id)} className="text-danger font-bold uppercase text-sm">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={() => { setEditing('new'); setForm({ section: 'mission', heading: '', body: '' }); }} className="bg-surface-dark border-2 border-dashed border-black p-4 w-full text-gray-500 font-bold uppercase hover:border-primary">
            + Add Section
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-6 shadow-brutal">
        <h2 className="text-xl font-headline font-black uppercase mb-4">Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.domains.map(domain => (
            <DomainEditor key={domain.id} domain={domain} onSave={updateContent} onDelete={deleteContent} />
          ))}
        </div>
        <button onClick={() => insertContent('domains', { name: 'New Domain', icon: 'star', sort_order: content.domains.length + 1 })} className="mt-4 bg-surface-dark border-2 border-dashed border-black p-4 w-full text-gray-500 font-bold uppercase">
          + Add Domain
        </button>
      </div>
    </div>
  );
}

function DomainEditor({ domain, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(domain.name);
  const [icon, setIcon] = useState(domain.icon);

  const handleSave = async () => {
    await onSave('domains', domain.id, { name, icon });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="border-2 border-black p-4 space-y-2">
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-black px-4 py-2 font-bold" />
        <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="w-full border-2 border-black px-4 py-2 font-bold" />
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-primary text-white px-4 py-2 border-2 border-black font-bold uppercase">Save</button>
          <button onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 border-2 border-black font-bold uppercase">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-black p-4 flex justify-between items-center">
      <div>
        <p className="font-black uppercase">{domain.name}</p>
        <p className="text-sm text-gray-500 font-bold">{domain.icon}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setEditing(true)} className="text-primary font-bold uppercase text-sm">Edit</button>
        <button onClick={() => onDelete('domains', domain.id)} className="text-danger font-bold uppercase text-sm">Delete</button>
      </div>
    </div>
  );
}
