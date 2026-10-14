import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

const AuthContext = createContext({})

const LOCAL_ADMIN_KEY = 'gdg_local_admin_session'
const RATE_LIMIT_KEY = 'gdg_login_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

const getRateLimit = () => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    return raw ? JSON.parse(raw) : { count: 0, since: Date.now() }
  } catch { return { count: 0, since: Date.now() } }
}

const bumpRateLimit = () => {
  const current = getRateLimit()
  const now = Date.now()
  // Reset window if lockout period has passed
  if (now - current.since > LOCKOUT_MS) {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, since: now }))
    return false
  }
  const updated = { count: current.count + 1, since: current.since }
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(updated))
  return updated.count >= MAX_ATTEMPTS
}

const isLockedOut = () => {
  const { count, since } = getRateLimit()
  if (count >= MAX_ATTEMPTS && Date.now() - since < LOCKOUT_MS) return true
  return false
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      return () => subscription?.unsubscribe?.()
    } else {
      // Local session check
      try {
        const stored = localStorage.getItem(LOCAL_ADMIN_KEY)
        if (stored) {
          setUser(JSON.parse(stored))
        }
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
  }, [])

  const signIn = async (email, password) => {
    // Check rate limiting first
    if (isLockedOut()) {
      return {
        data: null,
        error: { message: 'Too many failed login attempts. Please wait 15 minutes before trying again.' }
      }
    }

    if (isSupabaseConfigured) {
      const res = await supabase.auth.signInWithPassword({ email, password })
      if (res.error) bumpRateLimit()
      return res
    }

    // Local fallback: only allow if VITE_LOCAL_ADMIN_EMAIL and VITE_LOCAL_ADMIN_PASSWORD are set in .env
    const allowedEmail = import.meta.env.VITE_LOCAL_ADMIN_EMAIL
    const allowedPassword = import.meta.env.VITE_LOCAL_ADMIN_PASSWORD

    if (
      allowedEmail && allowedPassword &&
      email === allowedEmail &&
      password === allowedPassword
    ) {
      // Reset rate limit on success
      localStorage.removeItem(RATE_LIMIT_KEY)
      const adminUser = {
        id: 'local-admin-1',
        email: email,
        user_metadata: { name: 'GDG Admin' },
        isLocal: true,
      }
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser))
      setUser(adminUser)
      return { data: { user: adminUser }, error: null }
    }

    bumpRateLimit()
    return {
      data: null,
      error: { message: 'Invalid credentials. Please check your email and password.' }
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
