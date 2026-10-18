import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

const EVENT_TYPES = [
  'Workshop / Study Group',
  'Speaker Session / Tech Talk',
  'Info Session',
  'Hackathon',
  'Conference',
  'Flagship Event',
  'Meetup',
  'Webinar',
];

const EVENT_COLORS = [
  { label: 'Blue', value: '#4285F4' },
  { label: 'Green', value: '#34A853' },
  { label: 'Red', value: '#EA4335' },
  { label: 'Yellow', value: '#FBBC04' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const EventsManager = () => {
  const { content, insertContent, updateContent, deleteContent } = useContent();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [filterYear, setFilterYear] = useState('all');

  const years = [...new Set(content.events.map(e => e.year))].sort((a, b) => b - a);
  const filtered = filterYear === 'all' ? content.events : content.events.filter(e => e.year === parseInt(filterYear));

  const startNew = () => {
    setEditing('new');
    setForm({ date: '', year: new Date().getFullYear(), type: EVENT_TYPES[0], title: '', color: '#4285F4', sort_order: content.events.length + 1 });
  };

  const startEdit = (event) => {
    setEditing(event.id);
    setForm({ ...event });
  };

  const handleSave = async () => {
    if (editing === 'new') {
      await insertContent('events', form);
    } else {
      await updateContent('events', editing, form);
    }
    setEditing(null);
    setForm({});
  };

  return (
    <div>
      <div className="bg-success text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
        <h1 className="text-3xl font-headline font-black uppercase tracking-tight m-0">Events</h1>
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex gap-2">
          <button onClick={() => setFilterYear('all')} className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm ${filterYear === 'all' ? 'bg-black text-white' : 'bg-white'}`}>All</button>
          {years.map(y => (
            <button key={y} onClick={() => setFilterYear(y.toString())} className={`px-4 py-2 border-2 border-black font-bold uppercase text-sm ${filterYear === y.toString() ? 'bg-black text-white' : 'bg-white'}`}>{y}</button>
          ))}
        </div>
        <button onClick={startNew} className="bg-primary text-white px-6 py-2 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm transition-all">+ Add Event</button>
      </div>

      <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Date</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Year</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Type</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Title</th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {filtered.map(event => (
              <tr key={event.id} className="hover:bg-surface-dark">
                <td className="px-4 py-3 text-sm font-bold">{formatDate(event.date)}</td>
                <td className="px-4 py-3 text-sm font-bold">{event.year}</td>
                <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-primary text-white border border-black text-xs font-bold uppercase">{event.type}</span></td>
                <td className="px-4 py-3 text-sm font-bold max-w-xs truncate">{event.title}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => startEdit(event)} className="text-primary font-bold uppercase mr-3">Edit</button>
                  <button onClick={() => deleteContent('events', event.id)} className="text-danger font-bold uppercase">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black shadow-brutal-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-headline font-black uppercase mb-4">{editing === 'new' ? 'Add Event' : 'Edit Event'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1 uppercase">Date</label>
                <input type="date" value={form.date || ''} onChange={e => setForm({...form, date: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1 uppercase">Year</label>
                <input type="number" placeholder="Year" value={form.year || ''} onChange={e => setForm({...form, year: parseInt(e.target.value)})} className="w-full border-2 border-black px-4 py-3 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1 uppercase">Event Type</label>
                <select value={form.type || ''} onChange={e => setForm({...form, type: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold">
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1 uppercase">Title</label>
                <input type="text" placeholder="Event title" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full border-2 border-black px-4 py-3 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2 uppercase">Color</label>
                <div className="flex gap-2">
                  {EVENT_COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setForm({...form, color: c.value})}
                      className={`w-10 h-10 border-2 border-black ${form.color === c.value ? 'ring-2 ring-black ring-offset-2' : ''}`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
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
};

export default EventsManager;
