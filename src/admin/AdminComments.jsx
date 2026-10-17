import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminHeader, AdminBtn, Spinner, EmptyState } from './AdminUI'
import { dbFetch, dbDelete, subscribeToTable } from '../lib/db'

// Anti-URL detector for highlighting legacy or suspicious entries to admins
const URL_REGEX = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*|\b[a-zA-Z0-9-]+\.(com|org|net|xyz|io|in|me|co|app|dev|gg|link|top|club|live|info|online|tech|ai|site)\b|(?:t\.me|wa\.me|bit\.ly|tinyurl\.com)\/[^\s]+/i

const formatAdminDate = (timestamp) => {
  if (!timestamp) return 'Unknown date'
  const d = new Date(timestamp)
  if (isNaN(d.getTime())) return 'Unknown date'
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

const formatAdminRelative = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  if (isNaN(d.getTime())) return ''
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diffSec < 60) return 'just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  return `${Math.floor(diffSec / 86400)}d ago`
}

const AdminComments = () => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [filterEvent, setFilterEvent] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')

  const load = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    try {
      const { data } = await dbFetch('comments', 'created_at', false)
      if (data) {
        // Exclude soft-deleted items
        const active = data.filter((c) => !c.is_deleted)
        setComments(active)
      }
    } catch (e) {
      console.error('Error fetching admin comments:', e)
    } finally {
      setLoading(false)
      if (isManual) {
        setTimeout(() => setRefreshing(false), 500)
      }
    }
  }, [])

  useEffect(() => {
    load()

    // Real-time live subscription for incoming community comments
    const unsubscribe = subscribeToTable('comments', () => {
      load()
    })

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [load])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this comment from the community feed?')) return
    setDeletingId(id)
    try {
      // Optimistic update
      setComments((prev) => prev.filter((c) => c.id !== id))
      const { error } = await dbDelete('comments', id)
      if (error) {
        alert('Failed to delete comment: ' + (error.message || 'Unknown error'))
        load()
      } else {
        setStatusMsg('Comment removed successfully.')
        setTimeout(() => setStatusMsg(''), 3000)
      }
    } finally {
      setDeletingId(null)
    }
  }

  const handleClearAll = async () => {
    if (comments.length === 0) return
    const phrase = prompt(
      `⚠️ PERMANENT DELETION WARNING:\nThis will delete all ${comments.length} comments from the database.\nType "CONFIRM" to proceed:`
    )
    if (phrase !== 'CONFIRM') return

    setLoading(true)
    try {
      for (const c of comments) {
        await dbDelete('comments', c.id)
      }
      setComments([])
      setStatusMsg(`All ${comments.length} comments were successfully cleared.`)
      setTimeout(() => setStatusMsg(''), 4000)
    } catch (err) {
      alert('Error clearing comments: ' + err.message)
    } finally {
      setLoading(false)
      load()
    }
  }

  // Extract unique events for filtering
  const uniqueEvents = useMemo(() => {
    const set = new Set()
    comments.forEach((c) => {
      const ev = c.event_ref || c.eventRef || c.eventId
      if (ev && ev !== 'General') set.add(ev)
    })
    return Array.from(set)
  }, [comments])

  // Filtered comments (by event & search query)
  const filtered = useMemo(() => {
    return comments.filter((c) => {
      const ev = c.event_ref || c.eventRef || c.eventId || 'General'
      const matchEvent = !filterEvent || ev === filterEvent

      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.message && c.message.toLowerCase().includes(q)) ||
        (ev && ev.toLowerCase().includes(q))

      return matchEvent && matchSearch
    })
  }, [comments, filterEvent, search])

  // Statistics
  const todayCommentsCount = useMemo(() => {
    const today = new Date().toDateString()
    return comments.filter((c) => {
      const ts = c.created_at || c.timestamp || c.createdAt
      return ts && new Date(ts).toDateString() === today
    }).length
  }, [comments])

  return (
    <div>
      <AdminHeader
        icon="forum"
        title="Community Comments"
        color="bg-primary"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              title="Refresh comments from live database"
              className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black font-black uppercase text-xs shadow-brutal-sm hover:bg-black hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-sm ${refreshing ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
            {comments.length > 0 && (
              <AdminBtn onClick={handleClearAll} color="bg-danger" icon="delete_sweep">
                Clear All ({comments.length})
              </AdminBtn>
            )}
          </div>
        }
      />

      {/* ── Status Notification ── */}
      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-success text-white border-2 border-black p-3 text-xs font-black uppercase shadow-brutal-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{statusMsg}</span>
        </motion.div>
      )}

      {/* ── Metrics Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-4 border-black p-4 shadow-brutal">
          <span className="text-[10px] font-black uppercase text-black/50 block">Total Notes</span>
          <span className="text-2xl font-black text-black">{comments.length}</span>
        </div>
        <div className="bg-white border-4 border-black p-4 shadow-brutal">
          <span className="text-[10px] font-black uppercase text-black/50 block">Today's Notes</span>
          <span className="text-2xl font-black text-primary">{todayCommentsCount}</span>
        </div>
        <div className="bg-white border-4 border-black p-4 shadow-brutal">
          <span className="text-[10px] font-black uppercase text-black/50 block">Showing Filtered</span>
          <span className="text-2xl font-black text-warning">{filtered.length}</span>
        </div>
        <div className="bg-white border-4 border-black p-4 shadow-brutal">
          <span className="text-[10px] font-black uppercase text-black/50 block">Live Status</span>
          <span className="text-xs font-black uppercase text-success flex items-center gap-1.5 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
            Supabase Synced
          </span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white border-4 border-black p-4 shadow-brutal mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black/40 text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by author name, message, or event..."
            className="w-full pl-9 pr-4 py-2 border-2 border-black text-xs font-bold text-black focus:outline-none focus:border-primary transition-all placeholder:text-black/30"
          />
        </div>

        {/* Clear Filters button */}
        {(search || filterEvent) && (
          <button
            onClick={() => {
              setSearch('')
              setFilterEvent('')
            }}
            className="px-3 py-2 text-xs font-black uppercase border-2 border-black bg-surface-dark hover:bg-black hover:text-white transition-all shrink-0 cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* ── Event Filter Chips ── */}
      {uniqueEvents.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black uppercase text-black/40 mr-1">Filter by Topic:</span>
          <button
            onClick={() => setFilterEvent('')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
              !filterEvent
                ? 'bg-primary text-white shadow-brutal-sm'
                : 'bg-white text-black hover:bg-black/5'
            }`}
          >
            All Topics ({comments.length})
          </button>
          {uniqueEvents.map((ev) => (
            <button
              key={ev}
              onClick={() => setFilterEvent(ev)}
              className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                filterEvent === ev
                  ? 'bg-primary text-white shadow-brutal-sm'
                  : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              {ev}
            </button>
          ))}
        </div>
      )}

      {/* ── Comments List ── */}
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="chat_bubble_outline"
          text={
            comments.length === 0
              ? 'No community comments recorded in the database yet.'
              : 'No comments match your search filter.'
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((c) => {
            const ev = c.event_ref || c.eventRef || c.eventId || 'General'
            const timestamp = c.created_at || c.timestamp || c.createdAt
            const hasSuspiciousLink = URL_REGEX.test(c.message || '') || URL_REGEX.test(c.name || '')

            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`bg-white border-4 border-black shadow-brutal p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  hasSuspiciousLink ? 'border-danger bg-danger/5' : ''
                }`}
              >
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  {/* Author Initial */}
                  <div className="w-10 h-10 bg-primary text-white border-2 border-black flex items-center justify-center font-black text-sm shrink-0 shadow-brutal-sm uppercase">
                    {c.name ? c.name.charAt(0) : '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-headline font-black text-black text-sm uppercase">
                        {c.name || 'Anonymous'}
                      </span>

                      {ev && ev !== 'General' && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-surface-dark border border-black text-black/80">
                          {ev}
                        </span>
                      )}

                      {hasSuspiciousLink && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-danger text-white border border-black flex items-center gap-1">
                          <span className="material-symbols-outlined text-[11px]">warning</span>
                          Contains URL
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-black/40 ml-auto md:ml-0">
                        {formatAdminDate(timestamp)}{' '}
                        {formatAdminRelative(timestamp) && (
                          <span className="text-black/30">({formatAdminRelative(timestamp)})</span>
                        )}
                      </span>
                    </div>

                    {/* Message Body */}
                    <p className="text-black text-sm font-bold leading-relaxed whitespace-pre-wrap break-words bg-surface-dark/40 p-3 border-2 border-black/10">
                      {c.message}
                    </p>

                    <div className="mt-2.5 flex items-center gap-3 text-xs font-black text-black/60">
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-sm">thumb_up</span>
                        <span>{c.likes || 0}</span>
                      </div>
                      <span className="text-[10px] text-black/30">•</span>
                      <span className="text-[10px] text-black/40 font-bold uppercase">
                        {(c.message || '').length} / 300 characters
                      </span>
                      <span className="text-[10px] text-black/30">•</span>
                      <span className="text-[10px] text-black/40 font-mono">ID: {c.id}</span>
                    </div>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="self-end md:self-center shrink-0 flex items-center gap-2">
                  <AdminBtn
                    small
                    onClick={() => handleDelete(c.id)}
                    color="bg-danger"
                    icon="delete"
                    disabled={deletingId === c.id}
                  >
                    {deletingId === c.id ? 'Deleting...' : 'Delete'}
                  </AdminBtn>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminComments
