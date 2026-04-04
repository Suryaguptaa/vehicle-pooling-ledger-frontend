import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, Car, UsersRound, BarChart3, Zap, Menu, X, LogOut } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/residents', icon: Users, label: 'Residents' },
  { to: '/groups', icon: UsersRound, label: 'Groups' },
  { to: '/rides', icon: Car, label: 'Rides' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
]

function NavContent({ onNavigate }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      <div className="p-5 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-text-primary text-sm leading-tight">PoolLedger</p>
            <p className="text-xs text-text-secondary">Society Commute</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item, i) => (
          <motion.div key={item.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-body transition-all duration-200 group
                ${isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))',
                border: '1px solid rgba(99,102,241,0.3)',
                boxShadow: '0 0 20px rgba(99,102,241,0.1)'
              } : {}}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={17} className={isActive ? 'text-accent-glow' : 'text-muted group-hover:text-text-secondary'} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-glow" />}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-3 m-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">{user.name || 'User'}</p>
            <p className="text-xs text-text-secondary truncate">{user.flatNumber || ''}</p>
          </div>
          <button onClick={handleLogout} className="text-text-secondary hover:text-negative transition-colors ml-2 flex-shrink-0 p-1" title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-9 h-[calc(100%-36px)] w-64 z-40 flex-col" style={{ background: 'rgba(10,10,15,0.95)', borderRight: '1px solid #1e1e2e', backdropFilter: 'blur(20px)' }}>
        <NavContent onNavigate={null} />
      </aside>

      <header className="lg:hidden fixed top-[72px] sm:top-9 left-0 right-0 z-40 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '1px solid #1e1e2e', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <p className="font-display font-bold text-text-primary text-sm">PoolLedger</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary">{user.name?.split(' ')[0]}</span>
          <button onClick={() => setMobileOpen(true)} className="text-text-secondary hover:text-text-primary p-1">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[110]"
              style={{ background: 'rgba(0,0,0,0.7)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 z-[110] flex flex-col"
              style={{ background: 'rgba(10,10,15,0.98)', borderRight: '1px solid #1e1e2e' }}
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
                    <Zap size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-text-primary text-sm">PoolLedger</p>
                    <p className="text-xs text-text-secondary">Society Commute</p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-text-secondary p-1">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-3">
                {navItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-body transition-all
                      ${isActive ? 'text-white' : 'text-text-secondary'}`
                    }
                    style={({ isActive }) => isActive ? {
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))',
                      border: '1px solid rgba(99,102,241,0.3)',
                    } : {}}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={17} className={isActive ? 'text-accent-glow' : 'text-muted'} />
                        <span className="font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 m-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-text-primary">{user.name || 'User'}</p>
                    <p className="text-xs text-text-secondary">{user.flatNumber}</p>
                  </div>
                  <button onClick={handleLogout} className="text-text-secondary hover:text-negative transition-colors p-1">
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}