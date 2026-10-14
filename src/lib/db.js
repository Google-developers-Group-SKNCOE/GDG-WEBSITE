import { supabase, isSupabaseConfigured } from './supabase'

// ── Default initial seeds for local fallback & bootstrapping ──
const SEEDS = {
  events: [
    {
      id: 'connecting-backend-engineering',
      title: 'Connecting To Backend Engineering',
      type: 'Workshop',
      date: 'Oct 13, 2026',
      color: 'bg-danger',
      icon: 'terminal',
      description:
        "Mastering Backend Engineering: An Interactive Workshop. Explore the essentials of backend engineering in 'Connecting to Backend Engineering.' Participants learn web request processes, HTTP, APIs, databases, and tools like Redis, RabbitMQ, and Kafka for scalable applications.",
      tags: ['HTTP/HTTPS', 'APIs', 'DB', 'Redis', 'Kafka'],
      created_at: new Date('2026-10-13T10:00:00Z').toISOString()
    },
    {
      id: 'synthera-2026',
      title: 'Synthera 2026',
      type: 'Flagship Event',
      date: 'Feb 23–25, 2026',
      color: 'bg-primary',
      icon: 'rocket_launch',
      description: 'A 3-day collaborative mega-event uniting GDG SKNCOE, SCOE, and NBNSSOE. Workshops, hackathons, and speaker sessions across every tech domain.',
      tags: ['Hackathon', 'Workshop', 'Networking', 'Multi-College'],
      created_at: new Date('2026-02-23T10:00:00Z').toISOString()
    },
    {
      id: 'cloud-study-jams-2025',
      title: 'Google Cloud Study Jams: Hands-on Workshop',
      type: 'Workshop',
      date: 'Oct 26, 2025',
      color: 'bg-primary',
      icon: 'cloud',
      description: 'Hands-on Google Cloud workshop covering compute, storage, and ML APIs. Participants earned free Qwiklabs credits and cloud skill badges.',
      tags: ['GCP', 'Qwiklabs', 'Cloud', 'Badges'],
      created_at: new Date('2025-10-26T10:00:00Z').toISOString()
    },
    {
      id: 'cyber-threat-2025',
      title: 'Cyber Threat Intelligence Workshop',
      type: 'Speaker Session',
      date: 'Oct 3, 2025',
      color: 'bg-danger',
      icon: 'shield',
      description: 'An industry expert-led deep dive into threat hunting, OSINT, and defensive security strategies applicable in real-world SOC environments.',
      tags: ['Cybersecurity', 'OSINT', 'Threat Intel', 'SOC'],
      created_at: new Date('2025-10-03T10:00:00Z').toISOString()
    },
    {
      id: 'orientation-2025',
      title: 'GDGoC Member Orientation 2025',
      type: 'Info Session',
      date: 'Sep 19, 2025',
      color: 'bg-warning',
      icon: 'waving_hand',
      description: 'Welcome session for new members covering GDG On-Campus structure, how to get involved, domain overview, and upcoming event roadmap for the year.',
      tags: ['Onboarding', 'Community', 'Roadmap'],
      created_at: new Date('2025-09-19T10:00:00Z').toISOString()
    },
    {
      id: 'flutterflow-2025',
      title: 'FlutterFlow Masterclass: Build Flutter Apps Without Code',
      type: 'Workshop',
      date: 'Mar 25, 2025',
      color: 'bg-success',
      icon: 'smartphone',
      description: 'Build production-ready Flutter apps visually with no code required. Covered Firebase integration, responsive layouts, and deployment to the Play Store.',
      tags: ['Flutter', 'FlutterFlow', 'Firebase', 'No-Code'],
      created_at: new Date('2025-03-25T10:00:00Z').toISOString()
    },
    {
      id: 'solution-series-2025',
      title: 'Solution Series Hackathon',
      type: 'Hackathon',
      date: 'Jan 27, 2025',
      color: 'bg-primary',
      icon: 'emoji_events',
      description: 'A 24-hour hackathon challenging teams to solve real-world problems using Google technologies. Winners received cloud credits and mentorship opportunities.',
      tags: ['Hackathon', '24hr', 'Google Tech', 'Prizes'],
      created_at: new Date('2025-01-27T10:00:00Z').toISOString()
    },
    {
      id: 'solutions-challenge-2024',
      title: 'Solutions Challenge Intro',
      type: 'Info Session',
      date: 'Dec 25, 2024',
      color: 'bg-primary',
      icon: 'lightbulb',
      description: 'Introduction to Google Solutions Challenge — what it is, how to form a team, past winning ideas, and tips to build an impactful submission.',
      tags: ['Solutions Challenge', 'Google', 'Ideation'],
      created_at: new Date('2024-12-25T10:00:00Z').toISOString()
    },
    {
      id: 'tech-winter-break-2024',
      title: 'Tech Winter Break',
      type: 'Workshop',
      date: 'Dec 6, 2024',
      color: 'bg-danger',
      icon: 'ac_unit',
      description: 'A series of winter break workshops covering APIs, open-source contributions, and beginner-friendly projects to keep the momentum going.',
      tags: ['APIs', 'Open Source', 'Projects', 'Beginner'],
      created_at: new Date('2024-12-06T10:00:00Z').toISOString()
    },
    {
      id: 'gen-ai-2024',
      title: 'Gen-AI in Action',
      type: 'Speaker Session',
      date: 'Oct 4, 2024',
      color: 'bg-success',
      icon: 'psychology',
      description: 'Tools, techniques, and trends in Generative AI — covering prompt engineering, LLM APIs, Vertex AI, and responsible AI practices.',
      tags: ['AI', 'ML', 'Gemini', 'Prompt Engineering'],
      created_at: new Date('2024-10-04T10:00:00Z').toISOString()
    }
  ],
  resources: [
    // Connecting To Backend Engineering
    {
      id: 'res-cbe-1',
      event_id: 'connecting-backend-engineering',
      label: 'Workshop Notes',
      icon: 'article',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-10-13T12:00:00Z').toISOString()
    },
    {
      id: 'res-cbe-2',
      event_id: 'connecting-backend-engineering',
      label: 'Resource Kit',
      icon: 'folder_zip',
      url: 'https://github.com',
      created_at: new Date('2026-10-13T12:05:00Z').toISOString()
    },
    // Synthera 2026
    {
      id: 'res-1',
      event_id: 'synthera-2026',
      label: 'Event Recap & Guide',
      icon: 'article',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-02-26T10:00:00Z').toISOString()
    },
    {
      id: 'res-2',
      event_id: 'synthera-2026',
      label: 'Photo Gallery',
      icon: 'photo_library',
      url: 'https://photos.google.com',
      created_at: new Date('2026-02-26T10:05:00Z').toISOString()
    },
    // Google Cloud Study Jams
    {
      id: 'res-3',
      event_id: 'cloud-study-jams-2025',
      label: 'Workshop Slides',
      icon: 'slideshow',
      url: 'https://docs.google.com/presentation',
      created_at: new Date('2025-10-27T10:00:00Z').toISOString()
    },
    {
      id: 'res-3b',
      event_id: 'cloud-study-jams-2025',
      label: 'Lab Guide',
      icon: 'menu_book',
      url: 'https://cloud.google.com',
      created_at: new Date('2025-10-27T10:05:00Z').toISOString()
    },
    {
      id: 'res-3c',
      event_id: 'cloud-study-jams-2025',
      label: 'Recording',
      icon: 'videocam',
      url: 'https://youtube.com',
      created_at: new Date('2025-10-27T10:10:00Z').toISOString()
    },
    // Cyber Threat Intelligence
    {
      id: 'res-4',
      event_id: 'cyber-threat-2025',
      label: 'Slides',
      icon: 'slideshow',
      url: 'https://docs.google.com/presentation',
      created_at: new Date('2025-10-04T10:00:00Z').toISOString()
    },
    {
      id: 'res-4b',
      event_id: 'cyber-threat-2025',
      label: 'Resource Kit & OSINT Tools',
      icon: 'folder_zip',
      url: 'https://github.com',
      created_at: new Date('2025-10-04T10:05:00Z').toISOString()
    },
    // Orientation 2025
    {
      id: 'res-5',
      event_id: 'orientation-2025',
      label: 'Presentation Slides',
      icon: 'slideshow',
      url: 'https://docs.google.com/presentation',
      created_at: new Date('2025-09-20T10:00:00Z').toISOString()
    },
    {
      id: 'res-5b',
      event_id: 'orientation-2025',
      label: 'Orientation Recording',
      icon: 'videocam',
      url: 'https://youtube.com',
      created_at: new Date('2025-09-20T10:05:00Z').toISOString()
    },
    // FlutterFlow Masterclass
    {
      id: 'res-6',
      event_id: 'flutterflow-2025',
      label: 'Slides',
      icon: 'slideshow',
      url: 'https://docs.google.com/presentation',
      created_at: new Date('2025-03-26T10:00:00Z').toISOString()
    },
    {
      id: 'res-6b',
      event_id: 'flutterflow-2025',
      label: 'Starter Project',
      icon: 'code',
      url: 'https://github.com',
      created_at: new Date('2025-03-26T10:05:00Z').toISOString()
    },
    {
      id: 'res-6c',
      event_id: 'flutterflow-2025',
      label: 'Recording',
      icon: 'videocam',
      url: 'https://youtube.com',
      created_at: new Date('2025-03-26T10:10:00Z').toISOString()
    },
    // Solution Series Hackathon
    {
      id: 'res-7',
      event_id: 'solution-series-2025',
      label: 'Problem Statements',
      icon: 'assignment',
      url: 'https://gdg.community.dev',
      created_at: new Date('2025-01-28T10:00:00Z').toISOString()
    },
    {
      id: 'res-7b',
      event_id: 'solution-series-2025',
      label: 'Winning Projects',
      icon: 'emoji_events',
      url: 'https://github.com',
      created_at: new Date('2025-01-28T10:05:00Z').toISOString()
    },
    // Solutions Challenge Intro
    {
      id: 'res-8',
      event_id: 'solutions-challenge-2024',
      label: 'Intro Slides',
      icon: 'slideshow',
      url: 'https://docs.google.com/presentation',
      created_at: new Date('2024-12-26T10:00:00Z').toISOString()
    },
    // Tech Winter Break
    {
      id: 'res-9',
      event_id: 'tech-winter-break-2024',
      label: 'Workshop Notes',
      icon: 'article',
      url: 'https://gdg.community.dev',
      created_at: new Date('2024-12-07T10:00:00Z').toISOString()
    },
    // Gen-AI in Action
    {
      id: 'res-10',
      event_id: 'gen-ai-2024',
      label: 'Slides',
      icon: 'slideshow',
      url: 'https://docs.google.com/presentation',
      created_at: new Date('2024-10-05T10:00:00Z').toISOString()
    },
    {
      id: 'res-10b',
      event_id: 'gen-ai-2024',
      label: 'Recording',
      icon: 'videocam',
      url: 'https://youtube.com',
      created_at: new Date('2024-10-05T10:05:00Z').toISOString()
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

// ── Date parsing & sorting helper for events ──
export const parseEventDate = (dateStr) => {
  if (!dateStr) return 0
  if (typeof dateStr === 'number') return dateStr
  const str = String(dateStr).trim()

  // Clean ranges like "Feb 23–25, 2026" or "23-25" -> "Feb 23, 2026"
  const cleaned = str.replace(/(\d+)\s*[-–—]\s*\d+/, '$1').trim()
  const parsed = Date.parse(cleaned)
  if (!isNaN(parsed)) return parsed

  // Fallback: extract year, and try parsing "Month Year" or fallback to Jan 1st of that year
  const yearMatch = str.match(/\b(20\d{2})\b/)
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026

  const monthNames = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ]
  const lower = str.toLowerCase()
  const monthIdx = monthNames.findIndex(m => lower.includes(m))
  return new Date(year, monthIdx !== -1 ? monthIdx : 0, 1).getTime()
}

export const sortEventsByDate = (events, descending = true) => {
  if (!Array.isArray(events)) return []
  return [...events].sort((a, b) => {
    const da = parseEventDate(a.date || a.created_at)
    const db = parseEventDate(b.date || b.created_at)
    if (da !== db) return descending ? db - da : da - db
    // Secondary tie-breaker by created_at if available
    const ca = a.created_at ? new Date(a.created_at).getTime() : 0
    const cb = b.created_at ? new Date(b.created_at).getTime() : 0
    return descending ? cb - ca : ca - cb
  })
}

// ── Deleted IDs tracker to prevent deleted seeds from resurrecting ──
const getDeletedIds = (table) => {
  try {
    const raw = localStorage.getItem(`gdg_db_${table}_deleted`)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

const recordDeletedId = (table, id) => {
  try {
    const raw = localStorage.getItem(`gdg_db_${table}_deleted`)
    const arr = raw ? JSON.parse(raw) : []
    if (!arr.includes(id)) {
      arr.push(id)
      localStorage.setItem(`gdg_db_${table}_deleted`, JSON.stringify(arr))
    }
  } catch {}
}

// ── Local Storage Helper with Smart Seed Sync & Sorting ──
const getLocalData = (table) => {
  try {
    const seedList = SEEDS[table] || []
    const raw = localStorage.getItem(`gdg_db_${table}`)
    if (!raw) {
      const initial = table === 'events' ? sortEventsByDate(seedList, true) : seedList
      localStorage.setItem(`gdg_db_${table}`, JSON.stringify(initial))
      return initial
    }
    let current = JSON.parse(raw)
    if (Array.isArray(current) && seedList.length > 0) {
      const deletedIds = getDeletedIds(table)
      const existingIds = new Set(current.map(i => i.id))
      let changed = false
      seedList.forEach(seedItem => {
        if (!existingIds.has(seedItem.id) && !deletedIds.has(seedItem.id)) {
          current.push(seedItem)
          existingIds.add(seedItem.id)
          changed = true
        }
      })
      if (table === 'events') {
        current = sortEventsByDate(current, true)
        changed = true
      }
      if (changed) {
        localStorage.setItem(`gdg_db_${table}`, JSON.stringify(current))
      }
    }
    return current
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
        if (table === 'events') {
          return { data: sortEventsByDate(res.data, !ascending), error: null }
        }
        return res
      }
      console.warn(`Supabase query for ${table} had an error, using local data:`, res.error?.message)
    } catch (e) {
      console.warn(`Supabase fetch failed for ${table}:`, e)
    }
  }

  // Fallback
  const list = getLocalData(table)
  let sorted
  if (table === 'events') {
    sorted = sortEventsByDate(list, !ascending)
  } else {
    sorted = [...list].sort((a, b) => {
      const va = a[order] ?? ''
      const vb = b[order] ?? ''
      if (ascending) return va > vb ? 1 : -1
      return va < vb ? 1 : -1
    })
  }
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

  recordDeletedId(table, id)
  const list = getLocalData(table)
  const updated = list.filter((item) => item.id !== id)
  setLocalData(table, updated)

  // Cascade delete resources when an event is deleted
  if (table === 'events') {
    const resList = getLocalData('resources')
    const updatedRes = resList.filter(r => r.event_id !== id)
    if (updatedRes.length !== resList.length) {
      setLocalData('resources', updatedRes)
    }
  }

  return { error: null }
}
