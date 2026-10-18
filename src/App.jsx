import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ContentProvider } from './context/ContentContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'
import Home from './pages/Home'
import Events from './pages/Events'
import Core from './pages/Core'
import Projects from './pages/Projects'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import HeroManager from './pages/admin/HeroManager'
import AboutManager from './pages/admin/AboutManager'
import EventsManager from './pages/admin/EventsManager'
import ProjectsManager from './pages/admin/ProjectsManager'
import TeamManager from './pages/admin/TeamManager'
import SponsorsManager from './pages/admin/SponsorsManager'
import FaqsManager from './pages/admin/FaqsManager'
import NavigationManager from './pages/admin/NavigationManager'
import SocialManager from './pages/admin/SocialManager'
import ContactManager from './pages/admin/ContactManager'
import ResourcesManager from './pages/admin/ResourcesManager'
import CommunityManager from './pages/admin/CommunityManager'
import CampaignManager from './pages/admin/CampaignManager'
import Resources from './pages/Resources'
import Community from './pages/Community'

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
          <Route path="/community" element={<Community />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AdminRoutes() {
  const { isAuthenticated, checking } = useAdmin()

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/hero" element={<HeroManager />} />
        <Route path="/admin/about" element={<AboutManager />} />
        <Route path="/admin/events" element={<EventsManager />} />
        <Route path="/admin/projects" element={<ProjectsManager />} />
        <Route path="/admin/team" element={<TeamManager />} />
        <Route path="/admin/sponsors" element={<SponsorsManager />} />
        <Route path="/admin/faqs" element={<FaqsManager />} />
        <Route path="/admin/navigation" element={<NavigationManager />} />
        <Route path="/admin/social" element={<SocialManager />} />
        <Route path="/admin/contact" element={<ContactManager />} />
        <Route path="/admin/resources" element={<ResourcesManager />} />
        <Route path="/admin/community" element={<CommunityManager />} />
        <Route path="/admin/campaigns" element={<CampaignManager />} />
      </Routes>
    </AdminLayout>
  )
}

function AppContent() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isAdminRoute) {
    return <AdminRoutes />
  }

  return (
    <div className="relative flex flex-col min-h-screen">
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
    </div>
  )
}

function App() {
  return (
    <ContentProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </ContentProvider>
  )
}

export default App
