import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="min-h-screen bg-surface-dark grid-paper flex items-center justify-center px-4 border-4 border-black">
      <div className="bg-white border-4 border-black shadow-brutal-lg p-8 w-full max-w-md">
        <div className="bg-primary text-white border-2 border-black p-3 mb-6 inline-block -rotate-1 shadow-brutal-sm">
          <h1 className="text-2xl font-headline font-black uppercase tracking-tight m-0">Admin</h1>
        </div>
        <p className="text-gray-600 font-bold mb-6 uppercase text-sm">Sign in to manage website content</p>

        {error && (
          <div className="bg-danger text-white p-3 border-2 border-black mb-4 text-sm font-bold">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-black px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary font-bold"
              placeholder="admin@gdgskncoe.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-black px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary font-bold"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 border-2 border-black font-headline font-black uppercase shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
