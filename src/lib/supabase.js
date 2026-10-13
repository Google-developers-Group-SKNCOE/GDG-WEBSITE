import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isValidUrl = (url) => {
  try {
    return Boolean(url && new URL(url).protocol.startsWith('http') && !url.includes('your_supabase_project_url'))
  } catch {
    return false
  }
}

export const isSupabaseConfigured = isValidUrl(supabaseUrl) && Boolean(supabaseAnonKey && !supabaseAnonKey.includes('your_supabase_anon_key'))

// Safe Supabase client: uses real credentials if provided, otherwise safe placeholder client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://gdg-demo-project.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo')
