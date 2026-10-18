import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AdminContext = createContext();

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || '';

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('gdg_admin_auth');
    if (stored === 'true') setIsAuthenticated(true);
    setChecking(false);
  }, []);

  const login = async (email, password) => {
    if (!ADMIN_EMAIL || !ADMIN_PASS) {
      return { success: false, error: 'Admin credentials not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in .env' };
    }
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      sessionStorage.setItem('gdg_admin_auth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('gdg_admin_auth');
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, checking, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

export default AdminContext;
