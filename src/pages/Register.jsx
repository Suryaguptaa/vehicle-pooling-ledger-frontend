import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import { authApi, enableDemoMode } from '../api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', flatNumber: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.flatNumber) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await authApi.register(form)
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
      setError(e.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    enableDemoMode()
    localStorage.setItem('token', 'demo-token-123')
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      flatNumber: 'A-101',
    }))
    // Reload so api.js re-evaluates isDemoMode() at module load
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-10" style={{ background: '#0a0a0f' }}>
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
          <h1 className="font-display font-bold text-xl text-text-primary mb-1">Create account</h1>
          <p className="text-text-secondary text-sm mb-6">Register as a new resident</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#e8e8f0' }}
              />
            </div>

            <div>
              <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#e8e8f0' }}
              />
            </div>

            <div>
              <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1.5">Flat Number</label>
              <input
                type="text"
                placeholder="A-101"
                value={form.flatNumber}
                onChange={e => setForm({ ...form, flatNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', color: '#e8e8f0' }}
              />
            </div>

            <div>
              <label className="text-xs text-text-secondary uppercase tracking-widest block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all"
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
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium font-body flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
            </motion.button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-border" />
              <span className="text-[10px] text-text-secondary uppercase tracking-widest">or</span>
              <div className="h-[1px] flex-1 bg-border" />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSkip}
              className="w-full py-3 rounded-xl text-sm font-medium font-body flex items-center justify-center gap-2 transition-all border border-warning/20 bg-warning/5 text-warning hover:bg-warning/10"
            >
              Explore Demo Mode (UI Only)
            </motion.button>
          </div>
        </div>


        <p className="text-center text-sm text-text-secondary mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-glow hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}