import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Car, UsersRound, BarChart3, Zap } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/residents', icon: Users, label: 'Residents' },
  { to: '/groups', icon: UsersRound, label: 'Groups' },
  { to: '/rides', icon: Car, label: 'Rides' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col" style={{ background: 'rgba(10,10,15,0.95)', borderRight: '1px solid #1e1e2e', backdropFilter: 'blur(20px)' }}>
      <div className="p-6 mb-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-text-primary text-sm leading-tight">PoolLedger</p>
            <p className="text-xs text-text-secondary">Society Commute</p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item, i) => (
          <motion.div key={item.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-body transition-all duration-200 group
                ${isActive
                  ? 'text-white'
                  : 'text-text-secondary hover:text-text-primary'
                }`
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
                  {isActive && (
                    <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-glow" />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 m-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
        <p className="text-xs text-text-secondary font-body leading-relaxed">Spring Boot API running on <span className="text-accent font-mono">:8080</span></p>
      </div>
    </aside>
  )
}
