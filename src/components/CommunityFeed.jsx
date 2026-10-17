import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dbFetch, dbInsert, dbUpdate, subscribeToTable } from '../lib/db'

// ── Rate Limiting Storage Key (60-second cooldown) ──────────────────────────
const COOLDOWN_KEY = 'gdg_community_cooldown_until'
const COOLDOWN_DURATION_SEC = 60
const LIKES_KEY = 'gdg_community_liked_ids'

// ── Anti-URL & Link Detection Pattern ───────────────────────────────────────
// Detects protocols, standard TLDs, URL shorteners, messaging handles, and IP addresses
const URL_REGEX = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*|\b[a-zA-Z0-9-]+\.(com|org|net|xyz|io|in|me|co|app|dev|gg|link|top|club|live|info|online|tech|ai|site|ru|cn|biz|tv|cc|to)\b|(?:t\.me|wa\.me|bit\.ly|tinyurl\.com|is\.gd|cutt\.ly|goo\.gl)\/[^\s]+|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/i

// ── XSS Sanitizer: Strips raw HTML tags & trims whitespace ──────────────────
export const sanitizeInput = (text) => {
  if (!text) return ''
  return String(text)
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
}

// ── Raw Safe Text (un-escapes entities purely for safe React textContent) ────
export const cleanRawText = (text) => {
  if (!text) return ''
  return String(text).replace(/<[^>]*>?/gm, '').trim()
}

// ── Avatar Color Palette (Modern Google GDG Colors) ─────────────────────────
const AVATAR_COLORS = [
  'bg-[#4285F4] text-white', // Google Blue
  'bg-[#EA4335] text-white', // Google Red
  'bg-[#FBBC04] text-black', // Google Yellow
  'bg-[#34A853] text-white', // Google Green
  'bg-black text-white',
]

export const getAuthorColor = (name = '') => {
  const code = (name || '?').charCodeAt(0) || 0
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

// ── Dynamic Relative Time Formatter ─────────────────────────────────────────
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'just now'
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return 'just now'

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 45) return 'just now'
  if (diffSec < 3600) {
    const mins = Math.max(1, Math.floor(diffSec / 60))
    return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Open, Lightweight GDG Community Feed Component
 * - 100% open: NO authentication required
 * - Anti-bot Honeypot field
 * - 60-second client-side rate limit with ticking button countdown
 * - Strict Anti-URL and domain detection
 * - XSS protection via safe text rendering
 * - Supabase real-time listener + manual refresh
 * - Modern GDG Neo-brutalist styling
 */
const CommunityFeed = ({ eventFilterList = [], activeEvent = null }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(Date.now())

  // Form Fields
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [eventRef, setEventRef] = useState('')
  const [honeypot, setHoneypot] = useState('') // Hidden spam trap field

  // Status & Validation
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')

  // Rate Limiting (60s cooldown countdown)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  // Track liked comments per user/device (1 like per person limit)
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(LIKES_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // ── Cooldown Timer Setup ──────────────────────────────────────────────────
  const calculateCooldown = useCallback(() => {
    try {
      const until = Number(localStorage.getItem(COOLDOWN_KEY) || 0)
      const now = Date.now()
      if (until > now) {
        return Math.ceil((until - now) / 1000)
      }
    } catch {}
    return 0
  }, [])

  useEffect(() => {
    // Initial check
    setCooldownRemaining(calculateCooldown())

    // Tick countdown every second
    const interval = setInterval(() => {
      setCooldownRemaining(calculateCooldown())
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateCooldown])

  // Periodic tick for live relative time updates (every 30s)
  const [, setTick] = useState(0)
  useEffect(() => {
    const tickInterval = setInterval(() => setTick((t) => t + 1), 30000)
    return () => clearInterval(tickInterval)
  }, [])

  // ── Fetch Comments from Database ──────────────────────────────────────────
  const loadComments = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true)
    try {
      const { data, error: fetchErr } = await dbFetch('comments', 'created_at', false)
      if (fetchErr) {
        console.warn('Community comments fetch warning:', fetchErr)
      }
      if (data) {
        // Exclude soft-deleted items
        const visible = data.filter((c) => !c.is_deleted)
        setComments(visible)
        setLastRefreshed(Date.now())
      }
    } catch (err) {
      console.error('Failed to load comments:', err)
    } finally {
      setLoading(false)
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }, [])

  // Realtime subscription + fallback polling
  useEffect(() => {
    loadComments()

    // 1. Supabase Realtime channel
    const unsubscribe = subscribeToTable('comments', () => {
      loadComments()
    })

    // 2. Fallback polling every 12 seconds
    const pollInterval = setInterval(() => {
      loadComments()
    }, 12000)

    return () => {
      clearInterval(pollInterval)
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [loadComments])

  // If component receives an activeEvent prop, pre-select it
  useEffect(() => {
    if (activeEvent) {
      setEventRef(activeEvent)
    }
  }, [activeEvent])

  // ── Handle Post Submission with Security Guardrails ───────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // 1. Honeypot check (Spam Bot Protection)
    // If the invisible CSS honeypot is filled out, reject immediately
    if (honeypot && honeypot.trim().length > 0) {
      console.warn('Spam bot intercepted by Honeypot trap.')
      // Simulated fake success so bots do not retry with alternative tactics
      setSuccess('Message submitted successfully!')
      setName('')
      setMessage('')
      setHoneypot('')
      setTimeout(() => setSuccess(''), 4000)
      return
    }

    // 2. Client-Side Rate Limiting (60-second cooldown)
    const currentCooldown = calculateCooldown()
    if (currentCooldown > 0) {
      setError(`⏱️ Cooldown active: Please wait ${currentCooldown}s before posting again.`)
      return
    }

    // 3. XSS Sanitization & Stripping
    const cleanName = cleanRawText(name)
    const cleanMsg = cleanRawText(message)

    // 4. Character Length Validation
    if (cleanName.length < 2 || cleanName.length > 30) {
      setError('Author name must be between 2 and 30 characters.')
      return
    }

    if (cleanMsg.length < 5 || cleanMsg.length > 300) {
      setError('Message must be between 5 and 300 characters.')
      return
    }

    // 5. Anti-URL Rule (No links, domains, shorteners, or protocols)
    if (URL_REGEX.test(cleanName) || URL_REGEX.test(cleanMsg)) {
      setError('🚫 Links, URLs, and web domains are strictly blocked to prevent spam and keep the community secure.')
      return
    }

    // 6. Proceed to Post
    setSubmitting(true)
    const payload = {
      name: cleanName,
      message: cleanMsg,
      event_ref: eventRef ? eventRef.trim() : 'General',
      eventRef: eventRef ? eventRef.trim() : 'General',
      likes: 0,
      is_deleted: false,
      created_at: new Date().toISOString(),
    }

    const { error: insertErr } = await dbInsert('comments', payload)
    setSubmitting(false)

    if (insertErr) {
      setError('Could not publish comment. Please check your connection and try again.')
      return
    }

    // 7. Enforce 60-Second Cooldown in LocalStorage
    try {
      const cooldownUntil = Date.now() + COOLDOWN_DURATION_SEC * 1000
      localStorage.setItem(COOLDOWN_KEY, String(cooldownUntil))
      setCooldownRemaining(COOLDOWN_DURATION_SEC)
    } catch {}

    // 8. Reset Form State
    setName('')
    setMessage('')
    setSuccess('✓ Note shared live to the GDG Community!')
    setTimeout(() => setSuccess(''), 4000)

    // Reload feed
    loadComments()
  }

  // ── Handle Like / Reaction (1 like per person with toggle) ───────────────
  const handleLike = async (comment) => {
    const commentIdStr = String(comment.id)
    const isAlreadyLiked = likedIds.some((id) => String(id) === commentIdStr)
    const currentLikes = Number(comment.likes) || 0
    const newLikes = isAlreadyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1

    const updatedLikedIds = isAlreadyLiked
      ? likedIds.filter((id) => String(id) !== commentIdStr)
      : [...likedIds, comment.id]

    setLikedIds(updatedLikedIds)
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(updatedLikedIds))
    } catch {}

    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => (String(c.id) === commentIdStr ? { ...c, likes: newLikes } : c))
    )

    await dbUpdate('comments', comment.id, { likes: newLikes })
  }

  // ── Dynamic Filters ───────────────────────────────────────────────────────
  const filterOptions = useMemo(() => {
    const tags = new Set(['All'])
    comments.forEach((c) => {
      const ref = c.event_ref || c.eventRef
      if (ref && ref !== 'General') tags.add(ref)
    })
    if (eventFilterList.length > 0) {
      eventFilterList.forEach((ev) => tags.add(ev))
    }
    tags.add('General')
    return Array.from(tags)
  }, [comments, eventFilterList])

  const filteredComments = useMemo(() => {
    if (activeFilter === 'All') return comments
    return comments.filter(
      (c) => (c.event_ref || c.eventRef || 'General') === activeFilter
    )
  }, [comments, activeFilter])

  // Character countdown calculations
  const charsLeft = 300 - message.length
  const isNearLimit = charsLeft <= 30
  const isOverLimit = charsLeft < 0

  return (
    <section id="community" className="mt-20 md:mt-28 scroll-mt-24">
      {/* ── Community Banner & Live Status ── */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black pb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="bg-[#4285F4] text-white px-3.5 py-1 text-xs font-black uppercase tracking-widest border-2 border-black shadow-brutal-sm -rotate-1">
              Open Discussion
            </span>
            <div className="flex items-center gap-2 bg-white px-3 py-1 border-2 border-black text-[11px] font-black uppercase shadow-brutal-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse inline-block" />
              <span>Live Community Feed</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-black uppercase tracking-tight">
            Community <span className="text-[#4285F4]">Notes</span> &amp; Feed
          </h2>
          <p className="text-black font-bold text-sm md:text-base max-w-2xl mt-2 leading-relaxed">
            No account required. Connect with GDG SKNCOE peers, discuss workshops, share insights, or ask questions instantly.
          </p>
        </div>

        {/* Counter & Refresh Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => loadComments(true)}
            disabled={isRefreshing}
            title="Refresh community feed"
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border-2 border-black font-black uppercase text-xs shadow-brutal-sm hover:bg-black hover:text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-sm ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span className="hidden sm:inline">{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
          <div className="bg-black text-white px-4 py-2.5 border-2 border-black font-black uppercase tracking-widest text-xs shadow-brutal-sm">
            {comments.length} {comments.length === 1 ? 'Post' : 'Posts'}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* ── Column 1: Input Post Card (5 Cols) ── */}
        <div className="lg:col-span-5">
          <div className="bg-white border-4 border-black shadow-brutal p-6 md:p-8 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b-4 border-black">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FBBC04] border-2 border-black flex items-center justify-center shadow-brutal-sm text-black">
                  <span className="material-symbols-outlined text-xl font-black">edit_note</span>
                </div>
                <div>
                  <h3 className="font-headline font-black text-black text-lg md:text-xl uppercase leading-none">
                    Leave a Message
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-black/50">
                    Instant &amp; Public
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#4285F4] border border-black" />
                <span className="w-3 h-3 rounded-full bg-[#EA4335] border border-black" />
                <span className="w-3 h-3 rounded-full bg-[#FBBC04] border border-black" />
                <span className="w-3 h-3 rounded-full bg-[#34A853] border border-black" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* 🛡️ HONEYPOT SPAM TRAP FIELD (Invisible to humans, catches automated bots) */}
              <div
                style={{
                  position: 'absolute',
                  opacity: 0,
                  zIndex: -50,
                  pointerEvents: 'none',
                  height: 0,
                  width: 0,
                  overflow: 'hidden',
                  margin: 0,
                  padding: 0,
                }}
                aria-hidden="true"
                tabIndex={-1}
              >
                <label htmlFor="gdg_hp_website_contact">Leave this blank</label>
                <input
                  id="gdg_hp_website_contact"
                  type="text"
                  name="website_contact_verify_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-1">
                    <span>Name or Alias</span>
                    <span className="text-[#EA4335]">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-black/40 uppercase">2–30 chars</span>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name or Alias"
                  maxLength={30}
                  required
                  className="w-full border-2 border-black px-4 py-3 text-sm font-bold text-black bg-white focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all placeholder:text-black/30 shadow-inner"
                />
              </div>

              {/* Related Event / Topic */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-1">
                  <span>Topic / Related Event</span>
                  <span className="text-black/40 text-[10px] font-bold">(Optional)</span>
                </label>
                <select
                  value={eventRef}
                  onChange={(e) => setEventRef(e.target.value)}
                  className="w-full border-2 border-black px-4 py-3 text-sm font-bold text-black bg-white focus:outline-none focus:border-[#4285F4] transition-all cursor-pointer"
                >
                  <option value="">General Discussion</option>
                  {eventFilterList.map((evTitle) => (
                    <option key={evTitle} value={evTitle}>
                      {evTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Field with Live Character Countdown */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-black flex items-center gap-1">
                    <span>Message</span>
                    <span className="text-[#EA4335]">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 border border-black ${
                      isOverLimit
                        ? 'bg-[#EA4335] text-white'
                        : isNearLimit
                        ? 'bg-[#FBBC04] text-black'
                        : 'bg-black/5 text-black/60'
                    }`}
                  >
                    {charsLeft} / 300
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts, ask a question, or give a shoutout! (No links allowed)"
                  rows={4}
                  maxLength={300}
                  required
                  className="w-full border-2 border-black px-4 py-3 text-sm font-bold text-black bg-white focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all resize-none placeholder:text-black/30 shadow-inner leading-relaxed"
                />
              </div>

              {/* Anti-URL Notice */}
              <div className="flex items-start gap-2 bg-[#FBBC04]/20 border-2 border-black p-3 text-[11px] font-bold text-black leading-tight">
                <span className="material-symbols-outlined text-[#EA4335] text-sm shrink-0">shield</span>
                <span>Links &amp; URLs are strictly filtered out to ensure spam-free discussions.</span>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#EA4335] text-white border-2 border-black p-3 text-xs font-black uppercase shadow-brutal-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Alert */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#34A853] text-white border-2 border-black p-3 text-xs font-black uppercase shadow-brutal-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button with Live Rate-Limit Timer */}
              <button
                type="submit"
                disabled={submitting || cooldownRemaining > 0 || isOverLimit}
                className={`w-full py-4 px-6 font-black uppercase tracking-wider text-sm border-2 border-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  cooldownRemaining > 0
                    ? 'bg-black/20 text-black/60 border-black/40 cursor-not-allowed shadow-none'
                    : 'bg-[#4285F4] text-white shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none'
                }`}
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    <span>Posting...</span>
                  </>
                ) : cooldownRemaining > 0 ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-pulse">timer</span>
                    <span>Wait {cooldownRemaining}s to Post</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Post Note</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Column 2: Live Feed Display (7 Cols) ── */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Filter Chips Bar */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <span className="text-[10px] font-black uppercase text-black/50 tracking-wider mr-1">
              Filter:
            </span>
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5'
                    : 'bg-white text-black shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="bg-white border-4 border-black p-12 text-center shadow-brutal">
              <div className="w-8 h-8 border-4 border-black border-t-[#4285F4] rounded-full animate-spin mx-auto mb-4" />
              <p className="font-black uppercase text-black/50 text-xs tracking-widest">
                Loading community notes...
              </p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="bg-white border-4 border-black p-12 md:p-16 text-center shadow-brutal">
              <div className="w-16 h-16 bg-[#FBBC04]/20 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-black/40">forum</span>
              </div>
              <h4 className="font-headline font-black uppercase text-black text-lg mb-1">
                No Notes Found
              </h4>
              <p className="font-bold text-black/50 text-xs md:text-sm max-w-sm mx-auto">
                {activeFilter === 'All'
                  ? 'Be the first to leave a community note! Use the form on the left to start the discussion.'
                  : `No community notes filed under "${activeFilter}" yet.`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {filteredComments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white border-4 border-black shadow-brutal p-5 md:p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Author Initial Avatar */}
                        <div
                          className={`w-10 h-10 border-2 border-black flex items-center justify-center font-black text-sm uppercase shadow-brutal-sm shrink-0 ${getAuthorColor(
                            comment.name
                          )}`}
                        >
                          {(comment.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-headline font-black text-black text-sm uppercase tracking-wide">
                              {comment.name || 'Anonymous'}
                            </span>
                            {(comment.event_ref || comment.eventRef) &&
                              (comment.event_ref || comment.eventRef) !== 'General' && (
                                <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[#FBBC04]/30 border border-black text-black">
                                  {comment.event_ref || comment.eventRef}
                                </span>
                              )}
                          </div>
                          <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider block">
                            {formatRelativeTime(comment.created_at || comment.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Safe Text Message (XSS immune React textContent node) */}
                    <p className="text-black text-sm font-bold leading-relaxed border-l-4 border-black pl-3.5 my-1 whitespace-pre-wrap break-words">
                      {comment.message}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t-2 border-black/10">
                      {(() => {
                        const isLiked = likedIds.some((id) => String(id) === String(comment.id))
                        return (
                          <button
                            onClick={() => handleLike(comment)}
                            title={isLiked ? 'Unlike this note' : 'Like this note (1 like per person)'}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                              isLiked
                                ? 'bg-[#4285F4] text-white shadow-none translate-x-0.5 translate-y-0.5'
                                : 'bg-white text-black shadow-brutal-sm hover:bg-[#FBBC04] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-sm ${
                                isLiked ? 'text-white' : 'text-[#4285F4]'
                              }`}
                              style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              thumb_up
                            </span>
                            <span>{comment.likes || 0}</span>
                            {isLiked && (
                              <span className="text-[10px] font-bold uppercase ml-0.5 opacity-90">• Liked</span>
                            )}
                          </button>
                        )
                      })()}

                      <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">
                        GDG Community Note
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CommunityFeed
