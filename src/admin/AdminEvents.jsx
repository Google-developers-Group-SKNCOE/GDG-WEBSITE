import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbFetch, dbInsert, dbUpdate, dbDelete, sortEventsByDate } from '../lib/db'
import { AdminHeader, AdminBtn, AdminInput, AdminSelect, AdminTextarea, ImageUpload, StatusBadge, Spinner, EmptyState } from './AdminUI'

const COLORS = ['bg-primary', 'bg-danger', 'bg-warning', 'bg-success']
const TYPES  = ['Flagship Event', 'Workshop', 'Speaker Session', 'Info Session', 'Hackathon', 'Conference']

const ICONS = [
  { id: 'terminal', label: 'Terminal / Backend' },
  { id: 'rocket_launch', label: 'Rocket / Flagship' },
  { id: 'cloud', label: 'Cloud / DevOps' },
  { id: 'shield', label: 'Shield / Security' },
  { id: 'smartphone', label: 'Smartphone / Mobile' },
  { id: 'emoji_events', label: 'Trophy / Hackathon' },
  { id: 'waving_hand', label: 'Hand / Orientation' },
  { id: 'lightbulb', label: 'Lightbulb / Ideas' },
  { id: 'psychology', label: 'Brain / AI' },
  { id: 'ac_unit', label: 'Winter / Snowflake' },
  { id: 'event', label: 'Calendar / General' }
]

const BLANK = { title: '', type: 'Workshop', date: '', color: 'bg-primary', icon: 'terminal', description: '', tags: '', image: '' }

const EventForm = ({ initial = BLANK, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const setImage = (url) => setForm(f => ({ ...f, image: url }))

  const handleSubmit = (e) => { e.preventDefault(); onSave(form) }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-4 border-black shadow-brutal p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput label="Event Title *" value={form.title} onChange={set('title')} required placeholder="e.g. FlutterFlow Masterclass" />
        <AdminSelect label="Type *" value={form.type} onChange={set('type')}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </AdminSelect>
        <AdminInput label="Date *" value={form.date} onChange={set('date')} required placeholder="e.g. Oct 26, 2025" />
        <AdminSelect label="Color Theme" value={form.color} onChange={set('color')}>
          {COLORS.map(c => <option key={c} value={c}>{c.replace('bg-', '')}</option>)}
        </AdminSelect>
        <AdminSelect label="Icon" value={form.icon || 'event'} onChange={set('icon')}>
          {ICONS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
        </AdminSelect>
      </div>

      <ImageUpload
        label="Event Poster / Picture / Banner"
        value={form.image}
        onChange={setImage}
      />

      <AdminTextarea label="Description *" value={form.description} onChange={set('description')} required rows={3} placeholder="What happened at this event?" />
      <AdminInput label="Tags (comma-separated)" value={form.tags} onChange={set('tags')} placeholder="Flutter, Firebase, No-Code" />

      <div className="flex gap-3 pt-2">
        <AdminBtn type="submit" color="bg-primary" icon="save" disabled={saving}>{saving ? 'Saving...' : 'Save Event'}</AdminBtn>
        <AdminBtn onClick={onCancel} color="bg-black" icon="close">Cancel</AdminBtn>
      </div>
    </form>
  )
}

const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await dbFetch('events', 'date', false)
    setEvents(sortEventsByDate(data || [], true))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const flash = (ok) => { setStatus(ok); setTimeout(() => setStatus(null), 3000) }

  const handleSave = async (form) => {
    setSaving(true)
    const tagsArray = typeof form.tags === 'string'
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : (form.tags || [])

    const row = { ...form, tags: tagsArray }
    const { error } = editing
      ? await dbUpdate('events', editing.id, row)
      : await dbInsert('events', row)
    setSaving(false)
    if (error) { flash(false); return }
    flash(true)
    setShowForm(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    await dbDelete('events', id)
    load()
  }

  return (
    <div>
      <AdminHeader
        icon="calendar_month"
        title="Events"
        color="bg-primary"
        action={
          <div className="flex items-center gap-3">
            <StatusBadge ok={status} />
            <AdminBtn onClick={() => { setEditing(null); setShowForm(true) }} icon="add">Add Event</AdminBtn>
          </div>
        }
      />

      <AnimatePresence>
        {(showForm || editing) && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
            <EventForm
              initial={editing ? { ...editing, tags: Array.isArray(editing.tags) ? editing.tags.join(', ') : (editing.tags || '') } : undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditing(null) }}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <Spinner /> : events.length === 0 ? (
        <EmptyState icon="event_busy" text="No events yet. Add your first one!" />
      ) : (
        <div className="flex flex-col gap-4">
          {events.map(ev => (
            <motion.div key={ev.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white border-4 border-black shadow-brutal flex flex-col md:flex-row md:items-center gap-4 p-5"
            >
              <div className={`w-3 h-full min-h-[2rem] md:h-auto md:w-2 self-stretch shrink-0 ${ev.color || 'bg-primary'}`} />

              {ev.image && (
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover border-2 border-black shrink-0 shadow-brutal-sm"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-black ${ev.color || 'bg-primary'} text-white`}>{ev.type}</span>
                  <span className="text-xs font-bold text-black/50">{ev.date}</span>
                </div>
                <h3 className="font-headline font-black text-black uppercase text-lg leading-tight">{ev.title}</h3>
                <p className="text-xs font-bold text-black/50 mt-1 line-clamp-1">{ev.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <AdminBtn small onClick={() => { setEditing(ev); setShowForm(false) }} color="bg-warning" icon="edit">Edit</AdminBtn>
                <AdminBtn small onClick={() => handleDelete(ev.id)} color="bg-danger" icon="delete">Delete</AdminBtn>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminEvents
