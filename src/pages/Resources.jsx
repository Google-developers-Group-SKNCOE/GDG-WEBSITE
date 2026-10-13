import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const resourcePosts = [
  {
    id: 'connecting-backend-engineering',
    title: 'Connecting To Backend Engineering',
    category: 'Events',
    author: 'GDG Admin',
    publishedAt: 'Oct 13, 2026',
    readTime: '2 min read',
    accent: 'bg-danger',
    summary:
      "Mastering Backend Engineering: An Interactive Workshop. Explore the essentials of backend engineering in 'Connecting to Backend Engineering.' Participants learn web request processes, HTTP, APIs, databases, and tools like Redis, RabbitMQ, and Kafka for scalable applications. Ideal for beginners and those seeking deeper knowledge, it's a chance to connect with peers and professionals. Sign up to start mastering backend skills.",
    tags: ['HTTP/HTTPS', 'APIs', 'DB', 'Redis', 'Kafka'],
    comments: []
  },
  {
    id: 'cloud-jam-kit',
    title: 'Cloud Study Jam starter kit',
    category: 'Cloud',
    author: 'GDG Admin',
    publishedAt: 'Oct 12, 2026',
    readTime: '6 min read',
    accent: 'bg-primary',
    summary:
      'Everything you need before the next hands-on cloud lab: setup checklist, billing safety notes, and credits guidance.',
    tags: ['GCP', 'Study Jam', 'Beginner'],
    comments: [
      {
        name: 'Aarav',
        text: 'The billing checklist helped a lot. Can we add a short IAM explainer too?'
      },
      {
        name: 'Mira',
        text: 'Please pin this before the next lab day.'
      }
    ]
  },
  {
    id: 'flutter-roadmap',
    title: 'Flutter roadmap for first-year builders',
    category: 'Mobile',
    author: 'GDG Admin',
    publishedAt: 'Oct 8, 2026',
    readTime: '4 min read',
    accent: 'bg-success',
    summary:
      'A practical path from widgets to API calls, with mini-builds that can be finished over one weekend.',
    tags: ['Flutter', 'Dart', 'Projects'],
    comments: [
      {
        name: 'Devika',
        text: 'The mini-build idea is perfect for our domain onboarding.'
      }
    ]
  },
  {
    id: 'ai-ml-notes',
    title: 'AI/ML session notes and datasets',
    category: 'AI / ML',
    author: 'GDG Admin',
    publishedAt: 'Oct 3, 2026',
    readTime: '5 min read',
    accent: 'bg-warning',
    summary:
      'Slides, notebooks, and clean datasets from the intro session, grouped by topic for quick revision.',
    tags: ['Python', 'Notebooks', 'Datasets'],
    comments: []
  }
]

const filters = ['Events', 'Cloud', 'Mobile', 'AI / ML']

const Resources = () => {
  const [activeFilter, setActiveFilter] = useState('Events')
  const [commentDrafts, setCommentDrafts] = useState({})
  const [localComments, setLocalComments] = useState({})

  const visiblePosts = useMemo(() => {
    return resourcePosts.filter((post) => post.category === activeFilter)
  }, [activeFilter])

  const handleCommentSubmit = (event, postId) => {
    event.preventDefault()
    const text = commentDrafts[postId]?.trim()

    if (!text) return

    setLocalComments((current) => ({
      ...current,
      [postId]: [
        ...(current[postId] || []),
        {
          name: 'Community Member',
          text
        }
      ]
    }))
    setCommentDrafts((current) => ({ ...current, [postId]: '' }))
  }

  return (
    <div className="grid-paper min-h-screen pt-24 md:pt-28 pb-20 md:pb-32 border-x-0 md:border-x-4 border-black max-w-screen-2xl mx-auto overflow-hidden">
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-white border-4 border-black p-6 md:p-10 brutal-card shadow-brutal-lg"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white border-2 border-black text-[10px] font-black uppercase tracking-widest mb-6 shadow-brutal-sm">
              <span className="material-symbols-outlined text-[18px]">forum</span>
              Community Resources
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-6 leading-tight md:leading-none uppercase break-words">
              Learn, ask, <br />
              <span className="bg-primary text-white px-3 md:px-4 inline-block mt-2 md:mt-4 border-2 md:border-4 border-black shadow-brutal -rotate-1">
                build together.
              </span>
            </h1>
            <p className="text-base md:text-xl text-black font-bold leading-relaxed max-w-2xl bg-surface-dark p-4 border-2 border-black">
              A community board for event updates, admin-posted resources, follow-ups, and discussion threads.
            </p>
          </motion.div>
        </header>

        <section className="mb-10 md:mb-12 bg-white border-4 border-black p-4 md:p-5 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Resource feed</h2>
            <p className="text-sm text-black font-bold opacity-70">Browse event posts and community resources.</p>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2 md:gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 md:px-5 py-2 border-2 border-black font-black uppercase text-xs md:text-sm transition-all ${
                  activeFilter === filter
                    ? 'bg-black text-white translate-x-[3px] translate-y-[3px]'
                    : 'bg-white text-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 md:gap-10 items-start">
          <div className="space-y-8">
            {visiblePosts.map((post, index) => {
              const comments = [...post.comments, ...(localComments[post.id] || [])]

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="bg-white border-4 border-black shadow-brutal-lg overflow-hidden"
                >
                  <div className="p-6 md:p-8 border-b-4 border-black">
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className={`${post.accent} text-white border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-brutal-sm`}>
                        {post.category}
                      </span>
                      <span className="text-xs md:text-sm text-black font-black uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">edit_square</span>
                        {post.author}
                      </span>
                      <span className="text-xs md:text-sm text-black font-bold opacity-60">{post.publishedAt}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-4">{post.title}</h3>
                    <p className="text-base md:text-lg text-black font-bold leading-relaxed mb-5">{post.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-surface-dark border-2 border-black px-3 py-1 text-[10px] md:text-xs font-black uppercase">
                          {tag}
                        </span>
                      ))}
                      <span className="bg-white border-2 border-black px-3 py-1 text-[10px] md:text-xs font-black uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-dark p-5 md:p-6">
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <h4 className="text-lg md:text-xl font-black uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined">chat_bubble</span>
                        Comments
                      </h4>
                      <span className="bg-white border-2 border-black px-3 py-1 text-xs font-black">{comments.length}</span>
                    </div>

                    <div className="space-y-3 mb-5">
                      {comments.length > 0 ? (
                        comments.map((comment, commentIndex) => (
                          <div key={`${post.id}-${commentIndex}`} className="bg-white border-2 border-black p-4 shadow-brutal-sm">
                            <p className="text-xs font-black uppercase text-primary mb-1">{comment.name}</p>
                            <p className="text-sm md:text-base font-bold text-black leading-relaxed">{comment.text}</p>
                          </div>
                        ))
                      ) : null}
                    </div>

                    <form onSubmit={(event) => handleCommentSubmit(event, post.id)} className="grid sm:grid-cols-[1fr_auto] gap-3">
                      <label className="sr-only" htmlFor={`${post.id}-comment`}>
                        Add a comment
                      </label>
                      <input
                        id={`${post.id}-comment`}
                        value={commentDrafts[post.id] || ''}
                        onChange={(event) =>
                          setCommentDrafts((current) => ({
                            ...current,
                            [post.id]: event.target.value
                          }))
                        }
                        placeholder="Add a comment"
                        className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/30"
                      />
                      <button type="submit" className="bg-danger text-white border-2 border-black px-5 py-3 font-black uppercase brutal-btn text-sm">
                        Post
                      </button>
                    </form>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <aside className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-white border-4 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black uppercase mb-4">Community rules</h3>
              <p className="text-sm font-bold text-black leading-relaxed mb-4">
                Keep comments useful, kind, and focused on learning. Share questions, resources, and feedback that help the community grow.
              </p>
              <a
                href="https://gdg.community.dev/gdg-on-campus-shrimati-kashibai-navale-college-of-engineering-pune-india/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-warning text-black border-2 border-black px-5 py-3 font-black uppercase brutal-btn text-sm flex items-center justify-center gap-2"
              >
                Join GDG
                <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
              </a>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default Resources
