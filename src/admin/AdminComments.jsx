import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AdminHeader, AdminBtn, Spinner, EmptyState } from './AdminUI'

const STORAGE_KEY = 'gdg_community_comments'

const AdminComments = () => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setComments(raw ? JSON.parse(raw) : [])
    } catch {
      setComments([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    const updated = comments.filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setComments(updated)
  }

  const handleClearAll = () => {
    if (!confirm('⚠️ WARNING: This will delete ALL comments. Continue?')) return
    localStorage.removeItem(STORAGE_KEY)
    setComments([])
  }

  const filtered = filter ? comments.filter(c => c.eventId === filter) : comments

  const uniqueEvents = [...new Set(comments.map(c => c.eventId).filter(Boolean))]

  return (
    <div>
      <AdminHeader
        icon="forum"
        title="Community Comments"
        color="bg-primary"
        action={
          comments.length > 0 && (
            <AdminBtn onClick={handleClearAll} color="bg-danger" icon="delete_sweep">
              Clear All ({comments.length})
            </AdminBtn>
          )
        }
      />

      {/* Filter Chips */}
      {uniqueEvents.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black uppercase text-black/40 mr-2">Filter by Event:</span>
          <button
            onClick={() => setFilter('')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all ${
              !filter ? 'bg-primary text-white shadow-brutal-sm' : 'bg-white text-black hover:bg-black/5'
            }`}
          >
            All ({comments.length})
          </button>
          {uniqueEvents.map(evId => (
            <button
              key={evId}
              onClick={() => setFilter(evId)}
              className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all ${
                filter === evId ? 'bg-primary text-white shadow-brutal-sm' : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              {evId}
            </button>
          ))}
        </div>
      )}

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon="chat_bubble_outline" text="No community comments found." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(c => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-4 border-black shadow-brutal p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="flex gap-4 items-start flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary text-white border-2 border-black flex items-center justify-center font-black text-sm shrink-0 shadow-brutal-sm">
                  {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-headline font-black text-black text-sm uppercase">{c.name}</span>
                    {c.eventId && (
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-surface-dark border border-black text-black/70">
                        {c.eventId}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-black/40">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-black text-sm font-bold leading-relaxed whitespace-pre-wrap">{c.message}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs font-black text-black/50">
                    <span className="material-symbols-outlined text-sm text-primary">thumb_up</span>
                    <span>{c.likes || 0} likes</span>
                  </div>
                </div>
              </div>

              <div className="self-end md:self-center shrink-0">
                <AdminBtn small onClick={() => handleDelete(c.id)} color="bg-danger" icon="delete">
                  Delete
                </AdminBtn>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminComments
