import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './lib/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'
import Home from './pages/Home'
import Events from './pages/Events'
import Core from './pages/Core'
import Projects from './pages/Projects'
import Resources from './pages/Resources'
import Admin from './pages/Admin'

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.35,
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="flex-grow"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/core" element={<Core />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    // If navigating directly to admin, bypass the intro loader
    if (isAdmin) {
      setLoading(false)
      return
    }
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [isAdmin])

  return (
    <AuthProvider>
      <div className="relative flex flex-col min-h-screen">
        {isAdmin ? (
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        ) : (
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Loader />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col min-h-screen"
              >
                <ScrollToTop />
                <Navbar />
                <AnimatedRoutes />
                <Footer />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </AuthProvider>
  )
}

export default App
