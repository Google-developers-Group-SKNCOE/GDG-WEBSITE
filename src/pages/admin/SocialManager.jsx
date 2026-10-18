import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

export default function SocialManager() {
  const { content, insertContent, updateContent, deleteContent } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startNew = () => {
    setEditing('new');
    setForm({ platform: '', url: '', sort_order: content.socialLinks.length + 1 });
  };

  const startEdit = (link) => {
    setEditing(link.id);
    setForm({ ...link });
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await insertContent('social_links', form);
    } else {
      await updateContent('social_links', editing, form);
    }
    setEditing(null);
    setForm({});
  };

  return (
    <div>
      <div className="bg-danger text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Social Links</h1>
      </div>
      <div className="flex justify-end mb-4">
        <button onClick={startNew} className="bg-primary text-white px-6 py-2 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm transition-all">+ Add</button>
      </div>

      <div className="space-y-3">
        {content.socialLinks.map(link => (
          <div key={link.id} className="bg-white border-2 border-black p-4 flex justify-between items-center shadow-brutal">
            <div>
              <p className="font-black uppercase">{link.platform}</p>
              <p className="text-sm text-gray-500 font-bold truncate max-w-md">{link.url}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => startEdit(link)} className="text-primary font-bold uppercase text-sm">Edit</button>
              <button onClick={() => deleteContent('social_links', link.id)} className="text-danger font-bold uppercase text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-brutal-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-headline font-black uppercase mb-4">{editing === 'new' ? 'Add Social Link' : 'Edit Social Link'}</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Platform" value={form.platform || ''} onChange={e => setForm({...form, platform: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <input type="text" placeholder="URL" value={form.url || ''} onChange={e => setForm({...form, url: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
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
