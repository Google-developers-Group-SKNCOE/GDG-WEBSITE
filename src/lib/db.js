import { supabase, isSupabaseConfigured } from './supabase'

// ── Default initial seeds for local database & bootstrapping ──
export const SEEDS = {
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
      category: 'Organizer',
      image: '/core-images/organizer.jpeg',
      linkedin: 'https://www.linkedin.com/in/swarnim-shamgaonkar-b725472b1/',
      created_at: new Date('2025-09-01T00:00:00Z').toISOString()
    },
    {
      id: 'tm-2',
      name: 'Pratham Jadhav',
      roleTag: 'Co-Organizer',
      roleColor: 'bg-success',
      category: 'Organizer',
      image: '/core-images/co-organizer.jpg',
      linkedin: 'https://www.linkedin.com/in/jadhavprathammm/',
      created_at: new Date('2025-09-01T01:00:00Z').toISOString()
    },
    {
      id: 'tm-3',
      name: 'Sudeep Sakpal',
      roleTag: 'Web Development Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Web Dev Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/sudeep-sakpal/',
      created_at: new Date('2025-09-01T02:00:00Z').toISOString()
    },
    {
      id: 'tm-4',
      name: 'Hritika Gupta',
      roleTag: 'Web Development Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Web dev Colead.jpg',
      linkedin: 'https://www.linkedin.com/in/hritika3/',
      created_at: new Date('2025-09-01T03:00:00Z').toISOString()
    },
    {
      id: 'tm-5',
      name: 'Niranjan Sonawane',
      roleTag: 'AI/ML Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/AIML Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/niranjan-sonawane-59079728a/',
      created_at: new Date('2025-09-01T04:00:00Z').toISOString()
    },
    {
      id: 'tm-6',
      name: 'Manasvi Bhandarkar',
      roleTag: 'AI/ML Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Aiml Co-lead.jpg',
      linkedin: 'https://www.linkedin.com/in/manasvi-bhandarkar-3a32282a7/',
      created_at: new Date('2025-09-01T05:00:00Z').toISOString()
    },
    {
      id: 'tm-7',
      name: 'Srushti Dawkhar',
      roleTag: 'Android Development Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Android Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/srushti-d-179146220/',
      created_at: new Date('2025-09-01T06:00:00Z').toISOString()
    },
    {
      id: 'tm-8',
      name: 'Aditya Khawale',
      roleTag: 'Android Development Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Android Co lead.jpg',
      linkedin: 'https://www.linkedin.com/in/aditya-khawale/',
      created_at: new Date('2025-09-01T07:00:00Z').toISOString()
    },
    {
      id: 'tm-9',
      name: 'Tvisha Ghiya',
      roleTag: 'Competitive Programming Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Competitive Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/tvisha-ghiya-387062314/',
      created_at: new Date('2025-09-01T08:00:00Z').toISOString()
    },
    {
      id: 'tm-10',
      name: 'Kaiwalya Gunjal',
      roleTag: 'Competitive Programming Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Competitive Co-lead.jpg',
      linkedin: 'https://www.linkedin.com/in/kaiwlya-gunjal-561aa828a/',
      created_at: new Date('2025-09-01T09:00:00Z').toISOString()
    },
    {
      id: 'tm-11',
      name: 'Elton Fernandes',
      roleTag: 'Cyber Security Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Cyber Security Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/elton-fernandes18/',
      created_at: new Date('2025-09-01T10:00:00Z').toISOString()
    },
    {
      id: 'tm-12',
      name: 'Priyal Sathe',
      roleTag: 'Cyber Security Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Cyber Security Co lead.jpg',
      linkedin: 'https://www.linkedin.com/in/priyal-sathe/',
      created_at: new Date('2025-09-01T11:00:00Z').toISOString()
    },
    {
      id: 'tm-13',
      name: 'Vinayak Kapkar',
      roleTag: 'Event Management Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Event Management Lead.jpeg',
      linkedin: 'https://www.linkedin.com/in/vinayak-kapkar-109b16230/',
      created_at: new Date('2025-09-01T12:00:00Z').toISOString()
    },
    {
      id: 'tm-14',
      name: 'Shreya Kadam',
      roleTag: 'Event Management Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Event Management Co-lead.jpg',
      linkedin: 'https://www.linkedin.com/in/shreya-kadam-b30881355/',
      created_at: new Date('2025-09-01T13:00:00Z').toISOString()
    },
    {
      id: 'tm-15',
      name: 'Aditi Deshpande',
      roleTag: 'Social Media Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Social Media Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/aditi-deshpande-9aba32274/',
      created_at: new Date('2025-09-01T14:00:00Z').toISOString()
    },
    {
      id: 'tm-16',
      name: 'Parth Karpe',
      roleTag: 'Social Media Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Social Media Colead.jpeg',
      linkedin: null,
      created_at: new Date('2025-09-01T15:00:00Z').toISOString()
    },
    {
      id: 'tm-17',
      name: 'Avishkar Choundkar',
      roleTag: 'Sponsorship Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Sponsorship lead.jpg',
      linkedin: 'https://www.linkedin.com/in/avishkarchoundkar/',
      created_at: new Date('2025-09-01T16:00:00Z').toISOString()
    },
    {
      id: 'tm-18',
      name: 'Alphiya Kazi',
      roleTag: 'Sponsorship Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Sponsorship Colead.jpg',
      linkedin: 'https://www.linkedin.com/in/alphiya-kazi-1609b12a1/',
      created_at: new Date('2025-09-01T17:00:00Z').toISOString()
    },
    {
      id: 'tm-19',
      name: 'Aarya Anekar',
      roleTag: 'Cloud Computing Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Cloud Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/aaryaa2005/',
      created_at: new Date('2025-09-01T18:00:00Z').toISOString()
    },
    {
      id: 'tm-20',
      name: 'Harsh Dharmawat',
      roleTag: 'Cloud Computing Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Cloud Computing Co lead.jpg',
      linkedin: 'https://www.linkedin.com/in/harsh-dharmawat/',
      created_at: new Date('2025-09-01T19:00:00Z').toISOString()
    },
    {
      id: 'tm-21',
      name: 'Dhanashree Labhe',
      roleTag: 'Women Tech Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/Women Tech Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/dhanashree-labhe-232344281/',
      created_at: new Date('2025-09-01T20:00:00Z').toISOString()
    },
    {
      id: 'tm-22',
      name: 'Dynanada Thuse',
      roleTag: 'Women Tech Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/Women Tech Colead.jpg',
      linkedin: 'https://www.linkedin.com/in/dnyanada-thuse-992654317/',
      created_at: new Date('2025-09-01T21:00:00Z').toISOString()
    },
    {
      id: 'tm-23',
      name: 'Madhura Gore',
      roleTag: 'UI/UX Lead',
      roleColor: 'bg-primary',
      category: 'Lead',
      image: '/core-images/leads/UIUX Lead.jpg',
      linkedin: 'https://www.linkedin.com/in/madhuragore/',
      created_at: new Date('2025-09-01T22:00:00Z').toISOString()
    },
    {
      id: 'tm-24',
      name: 'Divya Bhandari',
      roleTag: 'UI/UX Co-Lead',
      roleColor: 'bg-success',
      category: 'Co-Lead',
      image: '/core-images/coleads/UIUX Colead.jpg',
      linkedin: 'https://www.linkedin.com/in/divya-bhandari-14b4a1308/',
      created_at: new Date('2025-09-01T23:00:00Z').toISOString()
    }
  ],
  sponsors: [
    {
      id: 'sp-1',
      name: 'Community Partner 1',
      tier: 'Community Partner',
      logo: '/sponsors/WhatsApp Image 2026-05-01 at 3.07.58 PM.jpeg',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      is_deleted: false
    },
    {
      id: 'sp-2',
      name: 'Community Partner 2',
      tier: 'Community Partner',
      logo: '/sponsors/WhatsApp Image 2026-05-01 at 3.09.10 PM.jpeg',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-01-02T00:00:00Z').toISOString(),
      is_deleted: false
    },
    {
      id: 'sp-3',
      name: 'Community Partner 3',
      tier: 'Community Partner',
      logo: '/sponsors/WhatsApp Image 2026-05-01 at 3.10.14 PM.jpeg',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-01-03T00:00:00Z').toISOString(),
      is_deleted: false
    },
    {
      id: 'sp-4',
      name: 'Community Partner 4',
      tier: 'Community Partner',
      logo: '/sponsors/WhatsApp Image 2026-05-01 at 3.11.00 PM.jpeg',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-01-04T00:00:00Z').toISOString(),
      is_deleted: false
    },
    {
      id: 'sp-5',
      name: 'Community Partner 5',
      tier: 'Community Partner',
      logo: '/sponsors/WhatsApp Image 2026-05-01 at 3.12.41 PM.jpeg',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-01-05T00:00:00Z').toISOString(),
      is_deleted: false
    },
    {
      id: 'sp-6',
      name: 'Soli / Media Partner',
      tier: 'Media Partner',
      logo: '/sponsors/imresizer-Soli.jpeg',
      url: 'https://gdg.community.dev',
      created_at: new Date('2026-01-06T00:00:00Z').toISOString(),
      is_deleted: false
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

// ── Universal Media URL Converter: Google Drive + GitHub Live CDN + Direct links (0 MB Supabase Storage) ──
export const convertMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return url
  const trimmed = url.trim()

  // Case A: GitHub Blob / Raw links (convert to direct raw CDN)
  // e.g. https://github.com/user/repo/blob/main/path/to/img.jpg -> https://raw.githubusercontent.com/user/repo/main/path/to/img.jpg
  const githubBlobMatch = trimmed.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+)$/)
  if (githubBlobMatch) {
    const [, owner, repo, rest] = githubBlobMatch
    return `https://raw.githubusercontent.com/${owner}/${repo}/${rest}`
  }

  // Case B: Google Drive - https://drive.google.com/file/d/FILE_ID/view...
  const matchFileD = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (matchFileD && matchFileD[1]) {
    return `https://lh3.googleusercontent.com/d/${matchFileD[1]}`
  }

  // Case C: Google Drive - https://drive.google.com/open?id=FILE_ID or ?id=FILE_ID
  const matchIdParam = trimmed.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/)
  if (matchIdParam && matchIdParam[1]) {
    return `https://lh3.googleusercontent.com/d/${matchIdParam[1]}`
  }

  // Case D: Google Drive - https://drive.google.com/uc?id=FILE_ID
  const matchUc = trimmed.match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/)
  if (matchUc && matchUc[1]) {
    return `https://lh3.googleusercontent.com/d/${matchUc[1]}`
  }

  return trimmed
}

// Backward-compatible alias
export const convertGoogleDriveUrl = convertMediaUrl

// Local Base64 fallback (0 MB Supabase Storage used)
export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

// ── Generic CRUD Helpers: Supabase Live Database + Local Cache Fallback ──

export const dbFetch = async (table, order = 'created_at', ascending = false) => {
  if (isSupabaseConfigured) {
    try {
      const res = await supabase.from(table).select('*').order(order, { ascending })
      if (!res.error && res.data) {
        const activeRows = res.data.filter(item => !item.is_deleted)
        if (activeRows.length > 0) {
          if (table === 'events') {
            return { data: sortEventsByDate(activeRows, !ascending), error: null }
          }
          return { data: activeRows, error: null }
        }
      }
      if (res.error) {
        console.warn(`Supabase query for ${table} had an error, using local fallback:`, res.error?.message)
      }
    } catch (e) {
      console.warn(`Supabase fetch failed for ${table}:`, e)
    }
  }

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
    created_at: new Date().toISOString()
  }

  // Only assign string ID if the table is NOT events (events uses auto-increment bigint in Supabase)
  if (table !== 'events') {
    if (!newRow.id) {
      newRow.id = `row_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    }
  } else {
    // If table is events and row.id is a string, remove it so PostgreSQL generates the bigint
    if (typeof newRow.id === 'string' && isNaN(Number(newRow.id))) {
      delete newRow.id
    }
  }

  if (isSupabaseConfigured) {
    try {
      const res = await supabase.from(table).insert(newRow).select().single()
      if (!res.error && res.data) {
        const list = getLocalData(table)
        setLocalData(table, [res.data, ...list])
        return res
      }
      if (res.error) {
        console.warn(`Supabase insert failed for ${table}:`, res.error.message)
        return { data: null, error: res.error }
      }
    } catch (e) {
      console.warn(`Supabase insert exception:`, e)
      return { data: null, error: e }
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
      // Clean up row so we don't update immutable fields
      const updateData = { ...row }
      delete updateData.id
      delete updateData.created_at

      const res = await supabase.from(table).update(updateData).eq('id', id).select().single()
      if (!res.error && res.data) {
        const list = getLocalData(table)
        const updated = list.map((item) => (String(item.id) === String(id) ? { ...item, ...res.data } : item))
        setLocalData(table, updated)
        return res
      }
      if (res.error) {
        console.warn(`Supabase update error for ${table}:`, res.error.message)
        return { data: null, error: res.error }
      }
    } catch (e) {
      console.warn(`Supabase update exception:`, e)
      return { data: null, error: e }
    }
  }

  const list = getLocalData(table)
  const updated = list.map((item) => (String(item.id) === String(id) ? { ...item, ...row } : item))
  setLocalData(table, updated)
  const found = updated.find((item) => String(item.id) === String(id)) || null
  return { data: found, error: null }
}

export const dbDelete = async (table, id) => {
  if (isSupabaseConfigured) {
    try {
      // 1. Try hard delete first
      let res = await supabase.from(table).delete().eq('id', id)
      
      // 2. If hard delete fails (e.g. foreign key or soft-delete schema), try soft delete
      if (res.error) {
        console.warn(`Hard delete failed for ${table}, trying soft delete:`, res.error.message)
        const softRes = await supabase.from(table).update({ is_deleted: true }).eq('id', id)
        if (!softRes.error) {
          res = { error: null }
        }
      }

      if (!res.error) {
        recordDeletedId(table, id)
        const list = getLocalData(table)
        const updated = list.filter((item) => String(item.id) !== String(id))
        setLocalData(table, updated)
        return res
      }
      if (res.error) {
        console.warn(`Supabase delete failed for ${table}:`, res.error.message)
        return { error: res.error }
      }
    } catch (e) {
      console.warn(`Supabase delete exception:`, e)
      return { error: e }
    }
  }

  recordDeletedId(table, id)
  const list = getLocalData(table)
  const updated = list.filter((item) => String(item.id) !== String(id))
  setLocalData(table, updated)

  // Cascade delete resources when an event is deleted
  if (table === 'events') {
    const resList = getLocalData('resources')
    const updatedRes = resList.filter(r => String(r.event_id) !== String(id))
    if (updatedRes.length !== resList.length) {
      setLocalData('resources', updatedRes)
    }
  }

  return { error: null }
}
