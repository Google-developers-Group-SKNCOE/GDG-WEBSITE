import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';

export default function HeroManager() {
  const { content, updateContent } = useContent();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (content.hero) {
      setForm({
        headline: content.hero.headline || '',
        subtitle: content.hero.subtitle || '',
        cta_primary_label: content.hero.cta_primary_label || '',
        cta_primary_url: content.hero.cta_primary_url || '',
        cta_secondary_label: content.hero.cta_secondary_label || '',
        cta_secondary_url: content.hero.cta_secondary_url || '',
      });
    }
  }, [content.hero]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const { error } = await updateContent('hero_content', content.hero.id, form);
    setSaving(false);
    setMessage(error ? 'Error saving changes' : 'Hero section updated');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <div className="bg-warning text-black border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Hero Section</h1>
      </div>
      {message && (
        <div className={`p-4 border-2 border-black mb-4 font-bold ${message.includes('Error') ? 'bg-danger text-white' : 'bg-success text-white'}`}>
          {message}
        </div>
      )}
      <div className="bg-white border-2 border-black p-6 shadow-brutal">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Headline</label>
            <input type="text" value={form.headline || ''} onChange={e => setForm({...form, headline: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Subtitle</label>
            <textarea value={form.subtitle || ''} onChange={e => setForm({...form, subtitle: e.target.value})} rows={3} className="w-full border-2 border-black px-4 py-3 font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1 uppercase">Primary CTA Label</label>
              <input type="text" value={form.cta_primary_label || ''} onChange={e => setForm({...form, cta_primary_label: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1 uppercase">Primary CTA URL</label>
              <input type="text" value={form.cta_primary_url || ''} onChange={e => setForm({...form, cta_primary_url: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1 uppercase">Secondary CTA Label</label>
              <input type="text" value={form.cta_secondary_label || ''} onChange={e => setForm({...form, cta_secondary_label: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1 uppercase">Secondary CTA URL</label>
              <input type="text" value={form.cta_secondary_url || ''} onChange={e => setForm({...form, cta_secondary_url: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-primary text-white px-8 py-3 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
