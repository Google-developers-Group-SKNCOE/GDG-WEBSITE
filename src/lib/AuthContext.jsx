import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

const AuthContext = createContext({})

const LOCAL_ADMIN_KEY = 'gdg_local_admin_session'

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
    if (isSupabaseConfigured) {
      const res = await supabase.auth.signInWithPassword({ email, password })
      return res
    }

    // Local / Demo Admin authentication fallback
    // Accept admin / gdg2026 or any email if demo
    if ((email === 'admin@gdg.org' || email === 'admin@gdgskncoe.com' || email.includes('admin')) && password.length >= 4) {
      const demoUser = {
        id: 'local-admin-1',
        email: email,
        user_metadata: { name: 'GDG Admin' },
        isDemo: true,
      }
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      return { data: { user: demoUser }, error: null }
    } else {
      return {
        data: null,
        error: { message: 'Invalid credentials. For quick demo login, use admin@gdgskncoe.com and password: admin' }
      }
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
