import { useAuth } from '../lib/AuthContext'
import AdminLogin from '../admin/AdminLogin'
import AdminLayout from '../admin/AdminLayout'

const Admin = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-primary animate-spin" />
      </div>
    )
  }

  return user ? <AdminLayout /> : <AdminLogin />
}

export default Admin
