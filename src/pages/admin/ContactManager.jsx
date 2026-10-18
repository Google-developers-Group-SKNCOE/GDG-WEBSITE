import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';

export default function ContactManager() {
  const { content, updateContent } = useContent();
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (content.contact) {
      setForm({
        address: content.contact.address || '',
        email: content.contact.email || '',
        map_embed_url: content.contact.map_embed_url || '',
        location_badge: content.contact.location_badge || '',
      });
    }
  }, [content.contact]);

  const handleSave = async () => {
    if (!content.contact) return;
    const { error } = await updateContent('contact_info', content.contact.id, form);
    setMessage(error ? 'Error saving' : 'Contact info updated');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <div className="bg-success text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Contact Info</h1>
      </div>
      {message && (
        <div className={`p-4 border-2 border-black mb-4 font-bold ${message.includes('Error') ? 'bg-danger text-white' : 'bg-success text-white'}`}>{message}</div>
      )}
      <div className="bg-white border-2 border-black p-6 shadow-brutal">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Address</label>
            <input type="text" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Email</label>
            <input type="text" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Map Embed URL</label>
            <textarea value={form.map_embed_url || ''} onChange={e => setForm({...form, map_embed_url: e.target.value})} rows={3} className="w-full border-2 border-black px-4 py-3 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Location Badge</label>
            <input type="text" value={form.location_badge || ''} onChange={e => setForm({...form, location_badge: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
          </div>
          <button onClick={handleSave} className="bg-primary text-white px-8 py-3 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Save</button>
        </div>
      </div>
    </div>
  );
}
