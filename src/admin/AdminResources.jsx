import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbFetch, dbInsert, dbUpdate, dbDelete, parseEventDate, sortEventsByDate } from '../lib/db'
import { AdminHeader, AdminBtn, AdminInput, AdminSelect, ImageUpload, StatusBadge, Spinner, EmptyState } from './AdminUI'

const BLANK_RESOURCE = { event_id: '', label: '', icon: 'slideshow', url: '' }

const ICONS = [
  { id: 'slideshow', label: 'Slides' },
  { id: 'videocam', label: 'Video / Recording' },
  { id: 'menu_book', label: 'Guide / Docs' },
  { id: 'folder_zip', label: 'Resource Kit / Zip' },
  { id: 'photo_library', label: 'Gallery / Photos' },
  { id: 'article', label: 'Article / Recap / Notes' },
  { id: 'code', label: 'Source Code / Project' },
  { id: 'assignment', label: 'Problem Statements / Tasks' },
  { id: 'emoji_events', label: 'Winning Projects / Trophy' },
  { id: 'link', label: 'Link / Website' }
]

const ResourceForm = ({ events, initial = BLANK_RESOURCE, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(() => ({
    ...BLANK_RESOURCE,
    ...initial,
    event_id: initial.event_id || initial.related_event || '',
    label: initial.label || initial.resource_label || initial.title || '',
    icon: initial.icon || initial.icon_type || 'slideshow',
    url: initial.url || initial.resource_url || initial.link || ''
  }))
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="bg-white border-4 border-black shadow-brutal p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminSelect label="Related Event *" value={form.event_id} onChange={set('event_id')} required>
          <option value="">-- Select Event --</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title} ({ev.date})
            </option>
          ))}
        </AdminSelect>
        <AdminInput label="Resource Label *" value={form.label} onChange={set('label')} required placeholder="e.g. Slides, Recording, Resource Kit" />
        <AdminSelect label="Icon Type" value={form.icon} onChange={set('icon')}>
          {ICONS.map(i => <option key={i.id} value={i.id}>{i.label} ({i.id})</option>)}
        </AdminSelect>
        <AdminInput label="Resource URL *" value={form.url} onChange={set('url')} required placeholder="https://..." />
      </div>

      <ImageUpload
        label="Or Upload Picture / Resource Asset (Auto-sets URL)"
        value={(form.url || '').startsWith('http') || (form.url || '').startsWith('data:') ? form.url : ''}
        onChange={(url) => setForm(f => ({ ...f, url }))}
      />

      <div className="flex gap-3 pt-2">
        <AdminBtn type="submit" color="bg-danger" icon="save" disabled={saving}>{saving ? 'Saving...' : 'Save Resource'}</AdminBtn>
        <AdminBtn onClick={onCancel} color="bg-black" icon="close">Cancel</AdminBtn>
      </div>
    </form>
  )
}

const AdminResources = () => {
  const [events, setEvents] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [filterEvent, setFilterEvent] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [{ data: evData }, { data: resData }] = await Promise.all([
      dbFetch('events', 'date', false),
      dbFetch('resources', 'created_at', false)
    ])
    setEvents(sortEventsByDate(evData || [], true))
    setResources(resData || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const flash = (ok) => { setStatus(ok); setTimeout(() => setStatus(null), 3000) }

  const handleSave = async (form) => {
    setSaving(true)
    const { error } = editing ? await dbUpdate('resources', editing.id, form) : await dbInsert('resources', form)
    setSaving(false)
    if (error) { flash(false); return }
    flash(true); setShowForm(false); setEditing(null); load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return
    await dbDelete('resources', id)
    load()
  }

  const getEventTitle = (eventId) => {
    const ev = events.find(e => String(e.id) === String(eventId) || e.title === eventId)
    return ev ? ev.title : eventId
  }

  const getEventDate = (eventId) => {
    const ev = events.find(e => String(e.id) === String(eventId) || e.title === eventId)
    return ev ? ev.date : ''
  }

  const filtered = filterEvent
    ? resources.filter(r => {
        const evId = r.event_id || r.related_event
        return String(evId) === String(filterEvent) || events.find(e => String(e.id) === String(filterEvent))?.title === evId
      })
    : resources

  // Sort resources by related event date descending (newest event first)
  const sortedResources = [...filtered].sort((a, b) => {
    const evIdA = a.event_id || a.related_event
    const evIdB = b.event_id || b.related_event
    const evA = events.find(e => String(e.id) === String(evIdA) || e.title === evIdA)
    const evB = events.find(e => String(e.id) === String(evIdB) || e.title === evIdB)
    const da = parseEventDate(evA?.date || a.created_at)
    const db = parseEventDate(evB?.date || b.created_at)
    if (da !== db) return db - da
    return (a.label || a.resource_label || a.title || '').localeCompare(b.label || b.resource_label || b.title || '')
  })

  return (
    <div>
      <AdminHeader
        icon="library_books"
        title="Resources"
        color="bg-danger"
        action={
          <div className="flex items-center gap-3">
            <StatusBadge ok={status} />
            <AdminBtn onClick={() => { setEditing(null); setShowForm(true) }} color="bg-danger" icon="add">Add Resource</AdminBtn>
          </div>
        }
      />

      {/* Filter */}
      <div className="mb-6 flex gap-3 items-center">
        <select
          value={filterEvent}
          onChange={e => setFilterEvent(e.target.value)}
          className="border-2 border-black px-3 py-2 text-xs font-black bg-white uppercase cursor-pointer focus:outline-none shadow-brutal-sm"
        >
          <option value="">All Events ({resources.length})</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title} ({ev.date})
            </option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {(showForm || editing) && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
            <ResourceForm
              events={events}
              initial={editing || undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditing(null) }}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <Spinner /> : sortedResources.length === 0 ? (
        <EmptyState icon="folder_off" text="No resources found. Add one above!" />
      ) : (
        <div className="flex flex-col gap-3">
          {sortedResources.map(res => (
            <motion.div
              key={res.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-4 border-black shadow-brutal flex flex-col md:flex-row md:items-center gap-4 p-5"
            >
              <div className="w-12 h-12 bg-surface-dark border-2 border-black flex items-center justify-center shrink-0 shadow-brutal-sm">
                <span className="material-symbols-outlined text-black text-2xl">{res.icon || res.icon_type || 'link'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase text-danger tracking-wider">{getEventTitle(res.event_id || res.related_event)}</span>
                  {getEventDate(res.event_id || res.related_event) && (
                    <span className="text-[10px] font-bold text-black/40">({getEventDate(res.event_id || res.related_event)})</span>
                  )}
                </div>
                <p className="font-headline font-black uppercase text-black text-base">{res.label || res.resource_label || res.title}</p>
                <a href={res.url || res.resource_url || res.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold truncate block hover:underline mt-0.5">
                  {res.url || res.resource_url || res.link}
                </a>
              </div>
              <div className="flex gap-2 shrink-0">
                <AdminBtn small onClick={() => setEditing(res)} color="bg-warning" icon="edit">Edit</AdminBtn>
                <AdminBtn small onClick={() => handleDelete(res.id)} color="bg-danger" icon="delete">Delete</AdminBtn>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminResources
