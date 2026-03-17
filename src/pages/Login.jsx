import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import { authApi } from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await authApi.login(form)
      const data = res.data.data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        name: data.name,
        email: data.email,
        flatNumber: data.flatNumber,
      }))
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a0f' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-text-primary">PoolLedger</p>
            <p className="text-xs text-text-secondary">Vehicle Pooling Ledger</p>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
          <h1 className="font-display font-bold text-xl text-text-primary mb-1">Welcome back</h1>
          <p className="text-text-secondary text-sm mb-6">Sign in to your account</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-xl text-sm text-text-primary transition-all"
                style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#e8e8f0' }}
              />
            </div>

            <div>
              <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-xl text-sm text-text-primary transition-all"
                style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#e8e8f0' }}
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-negative px-1">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium font-body flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </motion.button>
          </div>
        </div>

        <div className="rounded-xl p-4 mt-2" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Demo Access</p>
          <div className="space-y-1.5">
            <p className="text-xs flex justify-between">
              <span className="text-text-secondary">Email</span>
              <span className="text-text-primary font-mono">demo@poolledger.com</span>
            </p>
            <p className="text-xs flex justify-between">
              <span className="text-text-secondary">Password</span>
              <span className="text-text-primary font-mono">demo1234</span>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-text-secondary mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-glow hover:underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  )
}