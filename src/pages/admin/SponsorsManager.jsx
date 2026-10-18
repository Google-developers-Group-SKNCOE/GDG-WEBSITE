import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import ImageInput from '../../components/ImageInput';

export default function SponsorsManager() {
  const { content, insertContent, updateContent, deleteContent } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startNew = () => {
    setEditing('new');
    setForm({ name: '', logo_url: '', website_url: '', sort_order: content.sponsors.length + 1 });
  };

  const startEdit = (sponsor) => {
    setEditing(sponsor.id);
    setForm({ ...sponsor });
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await insertContent('sponsors', form);
    } else {
      await updateContent('sponsors', editing, form);
    }
    setEditing(null);
    setForm({});
  };

  return (
    <div>
      <div className="bg-success text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Sponsors</h1>
      </div>
      <div className="flex justify-end mb-4">
        <button onClick={startNew} className="bg-primary text-white px-6 py-2 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm transition-all">+ Add</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {content.sponsors.map(sponsor => (
          <div key={sponsor.id} className="bg-white border-2 border-black p-4 text-center shadow-brutal">
            <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-24 object-contain mb-2" />
            <p className="font-black uppercase text-sm">{sponsor.name}</p>
            <div className="flex justify-center gap-3 mt-2">
              <button onClick={() => startEdit(sponsor)} className="text-primary font-bold uppercase text-xs">Edit</button>
              <button onClick={() => deleteContent('sponsors', sponsor.id)} className="text-danger font-bold uppercase text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-brutal-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-headline font-black uppercase mb-4">{editing === 'new' ? 'Add Sponsor' : 'Edit Sponsor'}</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Sponsor Name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
              <ImageInput label="Logo" placeholder="Logo URL or upload" value={form.logo_url || ''} onChange={v => setForm({...form, logo_url: v})} />
              <input type="text" placeholder="Website URL" value={form.website_url || ''} onChange={e => setForm({...form, website_url: e.target.value})} className="w-full border-2 border-black px-4 py-2 font-bold" />
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
