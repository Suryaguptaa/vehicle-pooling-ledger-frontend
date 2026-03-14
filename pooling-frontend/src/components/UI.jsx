import { motion } from 'framer-motion'

export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`rounded-2xl p-5 glass ${hover ? 'glass-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function StatCard({ label, value, sub, icon: Icon, color = 'accent' }) {
  const colorMap = {
    accent: { text: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
    positive: { text: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
    negative: { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
    warning: { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  }
  const c = colorMap[color]

  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs text-text-secondary font-body uppercase tracking-widest mb-2">{label}</p>
        <p className="text-3xl font-display font-bold text-text-primary">{value}</p>
        {sub && <p className="text-xs text-text-secondary mt-1 font-body">{sub}</p>}
      </div>
      {Icon && (
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <Icon size={20} style={{ color: c.text }} />
        </div>
      )}
    </Card>
  )
}

export function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-text-secondary font-body uppercase tracking-wider">{label}</label>}
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl text-sm text-text-primary font-body transition-all duration-200"
        style={{ background: '#0d0d14', border: '1px solid #1e1e2e', color: '#e8e8f0' }}
      />
      {error && <p className="text-xs text-negative">{error}</p>}
    </div>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-text-secondary font-body uppercase tracking-wider">{label}</label>}
      <select
        {...props}
        className="w-full px-4 py-3 rounded-xl text-sm font-body transition-all duration-200 appearance-none"
        style={{ background: '#0d0d14', border: '1px solid #1e1e2e', color: '#e8e8f0' }}
      >
        {children}
      </select>
    </div>
  )
}

export function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  const variants = {
    primary: 'text-white font-medium',
    outline: 'text-text-primary font-medium',
    ghost: 'text-text-secondary hover:text-text-primary font-medium',
    danger: 'text-white font-medium',
  }

  const styles = {
    primary: { background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' },
    outline: { background: 'transparent', border: '1px solid #1e1e2e' },
    ghost: { background: 'transparent' },
    danger: { background: 'linear-gradient(135deg, #ef4444, #f87171)', boxShadow: '0 0 20px rgba(239,68,68,0.2)' },
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
      className={`px-5 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 ${variants[variant]} ${className}`}
      style={styles[variant]}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </motion.button>
  )
}

export function Badge({ children, variant = 'default' }) {
  const styles = {
    default: { color: '#8888aa', background: 'rgba(136,136,170,0.1)', border: '1px solid rgba(136,136,170,0.2)' },
    positive: { color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' },
    negative: { color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' },
    accent: { color: '#818cf8', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' },
    warning: { color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' },
  }

  return (
    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium" style={styles[variant]}>
      {children}
    </span>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-text-primary">{title}</h1>
        {subtitle && <p className="text-text-secondary font-body mt-1 text-sm">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.1)' }}>
        <Icon size={28} className="text-muted" />
      </div>
      <p className="font-display font-semibold text-text-primary text-lg">{title}</p>
      <p className="text-text-secondary font-body text-sm mt-1">{subtitle}</p>
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: '#13131c', border: '1px solid #1e1e2e', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display font-bold text-xl text-text-primary mb-5">{title}</h2>
        {children}
      </motion.div>
    </motion.div>
  )
}

export function Toast({ message, type = 'success', onClose }) {
  const styles = {
    success: { border: 'rgba(52,211,153,0.3)', icon: '✓', color: '#34d399' },
    error: { border: 'rgba(248,113,113,0.3)', icon: '✕', color: '#f87171' },
  }
  const s = styles[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl font-body text-sm"
      style={{ background: '#13131c', border: `1px solid ${s.border}`, boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}
    >
      <span style={{ color: s.color, fontSize: '16px' }}>{s.icon}</span>
      <span className="text-text-primary">{message}</span>
      <button onClick={onClose} className="text-text-secondary hover:text-text-primary ml-2">✕</button>
    </motion.div>
  )
}

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#1e1e2e', borderTopColor: '#6366f1' }} />
      <p className="text-text-secondary text-sm font-body">Loading...</p>
    </div>
  )
}

export function BalanceBadge({ balance }) {
  const val = parseFloat(balance || 0)
  if (val > 0) return <Badge variant="positive">+₹{val.toFixed(0)}</Badge>
  if (val < 0) return <Badge variant="negative">-₹{Math.abs(val).toFixed(0)}</Badge>
  return <Badge variant="default">₹0</Badge>
}
