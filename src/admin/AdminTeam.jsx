import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbFetch, dbInsert, dbUpdate, dbDelete } from '../lib/db'
import { AdminHeader, AdminBtn, AdminInput, AdminSelect, ImageUpload, StatusBadge, Spinner, EmptyState } from './AdminUI'

const COLORS = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger']
const CATEGORIES = ['Organizer', 'Co-Organizer', 'Lead', 'Co-Lead', 'Mentor', 'Core Member']

const BLANK_MEMBER = {
  name: '',
  roleTag: '',
  roleColor: 'bg-primary',
  category: 'Lead',
  image: '',
  linkedin: ''
}

const TeamForm = ({ initial = BLANK_MEMBER, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const setImage = (url) => setForm(f => ({ ...f, image: url }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="bg-white border-4 border-black shadow-brutal p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput label="Full Name *" value={form.name} onChange={set('name')} required placeholder="e.g. Jane Doe" />
        <AdminInput label="Role / Title *" value={form.roleTag} onChange={set('roleTag')} required placeholder="e.g. AI/ML Lead or Mentor" />
        <AdminSelect label="Section / Category *" value={form.category} onChange={set('category')}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </AdminSelect>
        <AdminSelect label="Badge Color" value={form.roleColor} onChange={set('roleColor')}>
          {COLORS.map(c => <option key={c} value={c}>{c.replace('bg-', '')}</option>)}
        </AdminSelect>
      </div>

      <ImageUpload
        label="Profile Picture / Image *"
        value={form.image}
        onChange={setImage}
      />

      <AdminInput
        label="LinkedIn Profile URL"
        value={form.linkedin}
        onChange={set('linkedin')}
        placeholder="https://www.linkedin.com/in/..."
      />

      <div className="flex gap-3 pt-2">
        <AdminBtn type="submit" color="bg-success" icon="save" disabled={saving}>{saving ? 'Saving...' : 'Save Member'}</AdminBtn>
        <AdminBtn onClick={onCancel} color="bg-black" icon="close">Cancel</AdminBtn>
      </div>
    </form>
  )
}

const AdminTeam = () => {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await dbFetch('team', 'created_at', false)
    setTeam(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const flash = (ok) => { setStatus(ok); setTimeout(() => setStatus(null), 3000) }

  const handleSave = async (form) => {
    setSaving(true)
    const { error } = editing ? await dbUpdate('team', editing.id, form) : await dbInsert('team', form)
    setSaving(false)
    if (error) { flash(false); return }
    flash(true); setShowForm(false); setEditing(null); load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this team member?')) return
    await dbDelete('team', id)
    load()
  }

  const categoryOptions = ['All', ...CATEGORIES]
  const filteredTeam = selectedCategory === 'All'
    ? team
    : team.filter(m => m.category === selectedCategory || (selectedCategory === 'Organizer' && m.roleTag?.toLowerCase().includes('organizer')))

  return (
    <div>
      <AdminHeader
        icon="group"
        title="Core Team"
        color="bg-success"
        action={
          <div className="flex items-center gap-3">
            <StatusBadge ok={status} />
            <AdminBtn onClick={() => { setEditing(null); setShowForm(true) }} color="bg-success" icon="add">Add Member</AdminBtn>
          </div>
        }
      />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryOptions.map(cat => {
          const count = cat === 'All' ? team.length : team.filter(m => m.category === cat).length
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-brutal-sm'
                  : 'bg-white text-black hover:bg-surface-dark'
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {(showForm || editing) && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
            <TeamForm
              initial={editing || undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditing(null) }}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <Spinner /> : filteredTeam.length === 0 ? (
        <EmptyState icon="person_off" text={`No team members found in "${selectedCategory}".`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeam.map(member => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-4 border-black shadow-brutal p-5 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 border-2 border-black overflow-hidden shrink-0 bg-surface-dark shadow-brutal-sm">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-black/30 text-xl">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase text-black bg-surface-dark border border-black/30">
                      {member.category || 'Member'}
                    </span>
                    <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase text-white border border-black ${member.roleColor || 'bg-primary'}`}>
                      {member.roleTag}
                    </span>
                  </div>
                  <h3 className="font-headline font-black text-black text-base uppercase truncate leading-tight">{member.name}</h3>
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold hover:underline block truncate mt-0.5">
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t-2 border-black/10 justify-end">
                <AdminBtn small onClick={() => setEditing(member)} color="bg-warning" icon="edit">Edit</AdminBtn>
                <AdminBtn small onClick={() => handleDelete(member.id)} color="bg-danger" icon="delete">Delete</AdminBtn>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminTeam
