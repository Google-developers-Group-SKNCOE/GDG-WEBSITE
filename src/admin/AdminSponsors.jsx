import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbFetch, dbInsert, dbUpdate, dbDelete } from '../lib/db'
import { AdminHeader, AdminBtn, AdminInput, AdminSelect, ImageUpload, StatusBadge, Spinner, EmptyState } from './AdminUI'

const TIERS = ['Title Partner', 'Gold Partner', 'Silver Partner', 'Community Partner', 'Media Partner']

const BLANK_SPONSOR = {
  name: '',
  tier: 'Community Partner',
  logo: '',
  url: ''
}

const SponsorForm = ({ initial = BLANK_SPONSOR, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const setLogo = (url) => setForm(f => ({ ...f, logo: url }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="bg-white border-4 border-black shadow-brutal p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput label="Sponsor / Partner Name *" value={form.name} onChange={set('name')} required placeholder="e.g. Google Cloud" />
        <AdminSelect label="Sponsorship Tier" value={form.tier} onChange={set('tier')}>
          {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
        </AdminSelect>
      </div>

      <ImageUpload
        label="Sponsor Logo / Picture *"
        value={form.logo}
        onChange={setLogo}
      />

      <AdminInput
        label="Website URL"
        value={form.url}
        onChange={set('url')}
        placeholder="https://example.com"
      />

      <div className="flex gap-3 pt-2">
        <AdminBtn type="submit" color="bg-warning" icon="save" disabled={saving}>{saving ? 'Saving...' : 'Save Sponsor'}</AdminBtn>
        <AdminBtn onClick={onCancel} color="bg-black" icon="close">Cancel</AdminBtn>
      </div>
    </form>
  )
}

const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await dbFetch('sponsors', 'created_at', false)
    setSponsors(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const flash = (ok) => { setStatus(ok); setTimeout(() => setStatus(null), 3000) }

  const handleSave = async (form) => {
    setSaving(true)
    const { error } = editing ? await dbUpdate('sponsors', editing.id, form) : await dbInsert('sponsors', form)
    setSaving(false)
    if (error) { flash(false); return }
    flash(true); setShowForm(false); setEditing(null); load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this sponsor?')) return
    await dbDelete('sponsors', id)
    load()
  }

  return (
    <div>
      <AdminHeader
        icon="handshake"
        title="Sponsors & Partners"
        color="bg-warning"
        action={
          <div className="flex items-center gap-3">
            <StatusBadge ok={status} />
            <AdminBtn onClick={() => { setEditing(null); setShowForm(true) }} color="bg-warning" icon="add">Add Sponsor</AdminBtn>
          </div>
        }
      />

      <AnimatePresence>
        {(showForm || editing) && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8">
            <SponsorForm
              initial={editing || undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditing(null) }}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <Spinner /> : sponsors.length === 0 ? (
        <EmptyState icon="storefront" text="No sponsors yet. Add your first sponsor or partner!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map(sp => (
            <motion.div
              key={sp.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-4 border-black shadow-brutal p-5 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 border-2 border-black p-2 flex items-center justify-center shrink-0 bg-surface-dark shadow-brutal-sm">
                  {sp.logo ? (
                    <img src={sp.logo} alt={sp.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-black/30 text-2xl">handshake</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase text-black bg-warning/30 border border-black mb-1">
                    {sp.tier}
                  </span>
                  <h3 className="font-headline font-black text-black text-base uppercase truncate leading-tight">{sp.name}</h3>
                  {sp.url && (
                    <a href={sp.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold hover:underline block truncate mt-0.5">
                      {sp.url}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t-2 border-black/10 justify-end">
                <AdminBtn small onClick={() => setEditing(sp)} color="bg-warning" icon="edit">Edit</AdminBtn>
                <AdminBtn small onClick={() => handleDelete(sp.id)} color="bg-danger" icon="delete">Delete</AdminBtn>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminSponsors
