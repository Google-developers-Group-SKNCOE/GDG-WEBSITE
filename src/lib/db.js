import { supabase, isSupabaseConfigured } from './supabase'

// ── Default initial seeds for local fallback ──
const SEEDS = {
  events: [
    {
      id: 'synthera-2026',
      title: 'Synthera 2026',
      type: 'Flagship Event',
      date: 'Feb 23–25, 2026',
      color: 'bg-primary',
      description: 'A 3-day collaborative mega-event uniting GDG SKNCOE, SCOE, and NBNSSOE. Workshops, hackathons, and speaker sessions across every tech domain.',
      tags: ['Hackathon', 'Workshop', 'Networking', 'Multi-College'],
      created_at: new Date('2026-02-01').toISOString()
    },
    {
      id: 'cloud-study-jams-2025',
      title: 'Google Cloud Study Jams: Hands-on Workshop',
      type: 'Workshop',
      date: 'Oct 26, 2025',
      color: 'bg-primary',
      description: 'Hands-on Google Cloud workshop covering compute, storage, and ML APIs. Participants earned free Qwiklabs credits and cloud skill badges.',
      tags: ['GCP', 'Qwiklabs', 'Cloud', 'Badges'],
      created_at: new Date('2025-10-26').toISOString()
    },
    {
      id: 'cyber-threat-2025',
      title: 'Cyber Threat Intelligence Workshop',
      type: 'Speaker Session',
      date: 'Oct 3, 2025',
      color: 'bg-danger',
      description: 'An industry expert-led deep dive into threat hunting, OSINT, and defensive security strategies applicable in real-world SOC environments.',
      tags: ['Cybersecurity', 'OSINT', 'Threat Intel', 'SOC'],
      created_at: new Date('2025-10-03').toISOString()
    },
    {
      id: 'orientation-2025',
      title: 'GDGoC Member Orientation 2025',
      type: 'Info Session',
      date: 'Sep 19, 2025',
      color: 'bg-warning',
      description: 'Welcome session for new members covering GDG On-Campus structure, how to get involved, domain overview, and upcoming event roadmap.',
      tags: ['Community', 'Roadmap', 'Domains'],
      created_at: new Date('2025-09-19').toISOString()
    }
  ],
  resources: [
    {
      id: 'res-1',
      event_id: 'synthera-2026',
      label: 'Event Recap & Guide',
      icon: 'article',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-02-26').toISOString()
    },
    {
      id: 'res-2',
      event_id: 'synthera-2026',
      label: 'Photo Gallery',
      icon: 'photo_library',
      url: 'https://photos.google.com',
      created_at: new Date('2026-02-26').toISOString()
    },
    {
      id: 'res-3',
      event_id: 'cloud-study-jams-2025',
      label: 'Workshop Slides',
      icon: 'slideshow',
      url: 'https://docs.google.com/presentation',
      created_at: new Date('2025-10-27').toISOString()
    },
    {
      id: 'res-4',
      event_id: 'cyber-threat-2025',
      label: 'Resource Kit & OSINT Tools',
      icon: 'folder_zip',
      url: 'https://github.com',
      created_at: new Date('2025-10-04').toISOString()
    }
  ],
  sponsors: [
    {
      id: 'sp-1',
      name: 'Google for Developers',
      tier: 'Title Partner',
      logo: 'https://www.gstatic.com/devrel-devsite/prod/v2b6942b918f62fae5264b3017a0d01ec4cfad699e232fe56e9c1db457ea59416/developers/images/touchicon-180.png',
      url: 'https://developers.google.com',
      created_at: new Date().toISOString()
    }
  ],
  team: [
    {
      id: 'tm-1',
      name: 'Swarnim Shamgaonkar',
      roleTag: 'Organizer',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/organizer.jpeg',
      linkedin: 'https://www.linkedin.com/in/swarnim-shamgaonkar-b725472b1/',
      created_at: new Date().toISOString()
    },
    {
      id: 'tm-2',
      name: 'Pratham Jadhav',
      roleTag: 'Co-Organizer',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/co-organizer.jpg',
      linkedin: 'https://www.linkedin.com/in/jadhavprathammm/',
      created_at: new Date().toISOString()
    }
  ],
  comments: []
}

// ── Local Storage Helper ──
const getLocalData = (table) => {
  try {
    const raw = localStorage.getItem(`gdg_db_${table}`)
    if (raw) return JSON.parse(raw)
    const initial = SEEDS[table] || []
    localStorage.setItem(`gdg_db_${table}`, JSON.stringify(initial))
    return initial
  } catch (e) {
    console.warn('LocalStorage error:', e)
    return SEEDS[table] || []
  }
}

const setLocalData = (table, data) => {
  try {
    localStorage.setItem(`gdg_db_${table}`, JSON.stringify(data))
  } catch (e) {
    console.error('LocalStorage write error:', e)
  }
}

// ── Upload image to Supabase Storage bucket or fallback to Base64 ──
export const uploadImage = async (file, bucket = 'gdg-media') => {
  if (isSupabaseConfigured) {
    try {
      const ext = file.name.split('.').pop()
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        if (data?.publicUrl) return data.publicUrl
      }
      console.warn('Supabase storage upload error, falling back to Data URL')
    } catch (e) {
      console.warn('Supabase storage exception, falling back to Data URL:', e)
    }
  }

  // Fallback to Base64 Data URL so image upload works instantly without extra config
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

// ── Generic CRUD helpers with dual Supabase + Local Storage support ──

export const dbFetch = async (table, order = 'created_at', ascending = false) => {
  if (isSupabaseConfigured) {
    try {
      const res = await supabase.from(table).select('*').order(order, { ascending })
      if (!res.error && res.data) {
        return res
      }
      console.warn(`Supabase query for ${table} had an error, using local data:`, res.error?.message)
    } catch (e) {
      console.warn(`Supabase fetch failed for ${table}:`, e)
    }
  }

  // Fallback
  const list = getLocalData(table)
  const sorted = [...list].sort((a, b) => {
    const va = a[order] ?? ''
    const vb = b[order] ?? ''
    if (ascending) return va > vb ? 1 : -1
    return va < vb ? 1 : -1
  })
  return { data: sorted, error: null }
}

export const dbInsert = async (table, row) => {
  const newRow = {
    ...row,
    id: row.id || `row_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString()
  }

  if (isSupabaseConfigured) {
    try {
      const res = await supabase.from(table).insert(row).select().single()
      if (!res.error && res.data) {
        return res
      }
      console.warn(`Supabase insert failed for ${table}:`, res.error?.message)
    } catch (e) {
      console.warn(`Supabase insert exception:`, e)
    }
  }

  const list = getLocalData(table)
  const updated = [newRow, ...list]
  setLocalData(table, updated)
  return { data: newRow, error: null }
}

export const dbUpdate = async (table, id, row) => {
  if (isSupabaseConfigured) {
    try {
      const res = await supabase.from(table).update(row).eq('id', id).select().single()
      if (!res.error && res.data) {
        return res
      }
    } catch (e) {
      console.warn(`Supabase update exception:`, e)
    }
  }

  const list = getLocalData(table)
  const updated = list.map((item) => (item.id === id ? { ...item, ...row } : item))
  setLocalData(table, updated)
  const found = updated.find((item) => item.id === id) || null
  return { data: found, error: null }
}

export const dbDelete = async (table, id) => {
  if (isSupabaseConfigured) {
    try {
      const res = await supabase.from(table).delete().eq('id', id)
      if (!res.error) {
        return res
      }
    } catch (e) {
      console.warn(`Supabase delete exception:`, e)
    }
  }

  const list = getLocalData(table)
  const updated = list.filter((item) => item.id !== id)
  setLocalData(table, updated)
  return { error: null }
}
