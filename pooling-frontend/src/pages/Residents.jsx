import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, User, Mail, Home, X } from 'lucide-react'
import { residentApi } from '../api'
import { Card, PageHeader, Button, Input, Modal, Loader, EmptyState, BalanceBadge, Badge, Toast } from '../components/UI'

export default function Residents() {
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', flatNumber: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      const res = await residentApi.getAll()
      setResidents(res.data.data || [])
    } catch (e) {
      showToast('Failed to load residents', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.flatNumber) return
    setSubmitting(true)
    try {
      await residentApi.create(form)
      setForm({ name: '', email: '', flatNumber: '' })
      setModalOpen(false)
      showToast('Resident added successfully')
      load()
    } catch (e) {
      showToast('Failed to add resident', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader
        title="Residents"
        subtitle={`${residents.length} registered members`}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Add Resident
          </Button>
        }
      />

      {residents.length === 0 ? (
        <EmptyState icon={User} title="No residents yet" subtitle="Add your first resident to get started" />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {residents.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5 glass glass-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-display font-bold" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' }}>
                    {r.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-text-primary">{r.name}</p>
                    <Badge variant="accent">{r.flatNumber}</Badge>
                  </div>
                </div>
                <BalanceBadge balance={r.balance} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-secondary font-body">
                  <Mail size={12} />
                  {r.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary font-body">
                  <Home size={12} />
                  Flat {r.flatNumber}
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1e1e2e' }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-secondary font-body">Current Balance</p>
                  <p className={`text-sm font-mono font-medium ${parseFloat(r.balance) > 0 ? 'text-positive' : parseFloat(r.balance) < 0 ? 'text-negative' : 'text-text-secondary'}`}>
                    {parseFloat(r.balance) > 0 ? '+' : ''}₹{parseFloat(r.balance || 0).toFixed(2)}
                  </p>
                </div>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1e2e' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(Math.abs(r.balance) / 200 * 100, 100)}%`,
                      background: parseFloat(r.balance) > 0 ? '#34d399' : parseFloat(r.balance) < 0 ? '#f87171' : '#3f3f5a'
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Resident">
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" placeholder="rahul@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Flat Number" placeholder="A-101" value={form.flatNumber} onChange={e => setForm({ ...form, flatNumber: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 justify-center">Cancel</Button>
            <Button onClick={handleSubmit} loading={submitting} className="flex-1 justify-center">Add Resident</Button>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
