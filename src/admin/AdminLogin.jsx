import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { motion } from 'framer-motion'

const AdminLogin = () => {
  const { signIn, isSupabaseConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen grid-paper flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border-4 border-black shadow-brutal-lg p-8 md:p-10">
          <div className="flex items-center justify-between mb-8 pb-6 border-b-4 border-black">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm">
                <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">GDG SKNCOE</p>
                <h1 className="font-headline font-black text-black text-2xl uppercase leading-none">Admin Panel</h1>
              </div>
            </div>
            <Link
              to="/"
              className="text-black/50 hover:text-black hover:underline text-xs font-black uppercase flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              Site
            </Link>
          </div>

          {/* Mode Badge */}
          <div className="mb-6 p-3 bg-surface-dark border-2 border-black flex items-center justify-between text-xs font-black uppercase">
            <span className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? 'bg-success' : 'bg-warning animate-pulse'}`} />
              {isSupabaseConfigured ? 'Supabase Live' : 'Local Dev Mode'}
            </span>
            <span className="text-[10px] text-black/50">
              {isSupabaseConfigured ? 'DB + Direct Upload' : 'Ready to use'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-black">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full border-2 border-black px-4 py-3 text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all placeholder:text-black/25"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-black">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border-2 border-black px-4 py-3 text-sm font-bold text-black bg-white focus:outline-none focus:border-primary transition-all placeholder:text-black/25"
              />
            </div>

            {error && (
              <div className="bg-danger text-white border-2 border-black px-4 py-3 text-xs font-black uppercase shadow-brutal-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 font-black uppercase tracking-wider text-sm border-2 border-black shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
