import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Car, CheckCircle, Clock, Zap, IndianRupee } from 'lucide-react'
import { rideApi, groupApi, residentApi } from '../api'
import { Card, PageHeader, Button, Input, Select, Modal, Loader, EmptyState, Badge, Toast } from '../components/UI'

export default function Rides() {
  const [groups, setGroups] = useState([])
  const [residents, setResidents] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [ridesLoading, setRidesLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [settling, setSettling] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [groupMembers, setGroupMembers] = useState([])

  const [form, setForm] = useState({
    rideGroupId: '',
    paidById: '',
    date: new Date().toISOString().split('T')[0],
    totalFare: '',
    participantIds: [],
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [gRes, rRes] = await Promise.all([groupApi.getAll(), residentApi.getAll()])
        setGroups(gRes.data.data || [])
        setResidents(rRes.data.data || [])
      } catch (e) {
        showToast('Failed to load data', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedGroup) { setRides([]); return }
    const loadRides = async () => {
      setRidesLoading(true)
      try {
        const res = await rideApi.getByGroup(selectedGroup)
        setRides(res.data.data || [])
      } catch (e) {
        showToast('Failed to load rides', 'error')
      } finally {
        setRidesLoading(false)
      }
    }
    loadRides()
  }, [selectedGroup])

  useEffect(() => {
    if (!form.rideGroupId) { setGroupMembers([]); return }
    groupApi.getMembers(form.rideGroupId).then(res => {
      setGroupMembers(res.data.data || [])
    }).catch(() => {})
  }, [form.rideGroupId])

  const toggleParticipant = (id) => {
    setForm(f => ({
      ...f,
      participantIds: f.participantIds.includes(id)
        ? f.participantIds.filter(p => p !== id)
        : [...f.participantIds, id]
    }))
  }

  const handleLogRide = async () => {
    if (!form.rideGroupId || !form.paidById || !form.totalFare || form.participantIds.length === 0) {
      showToast('Please fill all fields and select participants', 'error')
      return
    }
    setSubmitting(true)
    try {
      await rideApi.logRide({
        rideGroupId: parseInt(form.rideGroupId),
        paidById: parseInt(form.paidById),
        date: form.date,
        totalFare: parseFloat(form.totalFare),
        participantIds: form.participantIds.map(Number),
      })
      setModalOpen(false)
      setForm({ rideGroupId: '', paidById: '', date: new Date().toISOString().split('T')[0], totalFare: '', participantIds: [] })
      showToast('Ride logged successfully')
      if (selectedGroup) {
        const res = await rideApi.getByGroup(selectedGroup)
        setRides(res.data.data || [])
      }
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to log ride', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSettle = async () => {
    if (!selectedGroup) return
    setSettling(true)
    try {
      await rideApi.settle(selectedGroup)
      showToast('Group settled! All balances reset to zero.')
      const res = await rideApi.getByGroup(selectedGroup)
      setRides(res.data.data || [])
    } catch (e) {
      showToast('Failed to settle group', 'error')
    } finally {
      setSettling(false)
    }
  }

  const perShare = form.totalFare && form.participantIds.length > 0
    ? (parseFloat(form.totalFare) / form.participantIds.length).toFixed(2)
    : null

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader
        title="Rides"
        subtitle="Log rides and settle balances"
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Log Ride
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <Select label="Select Group to View Rides" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
            <option value="">Choose a group...</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </Select>
        </div>
        {selectedGroup && (
          <div className="flex items-end">
            <Button variant="danger" loading={settling} onClick={handleSettle} className="w-full justify-center">
              <Zap size={15} />
              Settle Group
            </Button>
          </div>
        )}
      </div>

      {!selectedGroup ? (
        <EmptyState icon={Car} title="Select a group" subtitle="Choose a group above to view its ride history" />
      ) : ridesLoading ? (
        <Loader />
      ) : rides.length === 0 ? (
        <EmptyState icon={Car} title="No rides yet" subtitle="Log your first ride for this group" />
      ) : (
        <div className="space-y-3">
          {rides.map((ride, i) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5 glass"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <Car size={17} style={{ color: '#818cf8' }} />
                  </div>
                  <div>
                    <p className="font-body font-medium text-text-primary text-sm">Paid by <span className="text-accent-glow font-semibold">{ride.paidByName}</span></p>
                    <p className="text-xs text-text-secondary">{ride.date} · {ride.rideGroupName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ride.settled ? 'positive' : 'warning'}>
                    {ride.settled ? <><CheckCircle size={10} className="inline mr-1" />Settled</> : <><Clock size={10} className="inline mr-1" />Pending</>}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="px-3 py-2 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e2e' }}>
                  <p className="text-xs text-text-secondary font-body">Total</p>
                  <p className="font-mono font-semibold text-text-primary text-sm">₹{ride.totalFare}</p>
                </div>
                <div className="px-3 py-2 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e2e' }}>
                  <p className="text-xs text-text-secondary font-body">Per Person</p>
                  <p className="font-mono font-semibold text-accent-glow text-sm">₹{parseFloat(ride.perPersonShare).toFixed(2)}</p>
                </div>
                <div className="px-3 py-2 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e2e' }}>
                  <p className="text-xs text-text-secondary font-body">Participants</p>
                  <p className="font-mono font-semibold text-text-primary text-sm">{ride.participantNames?.length}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {ride.participantNames?.map(name => (
                  <span key={name} className="px-2 py-0.5 rounded-lg text-xs font-body" style={{ background: 'rgba(99,102,241,0.08)', color: '#8888aa', border: '1px solid #1e1e2e' }}>{name}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log a New Ride">
        <div className="space-y-4">
          <Select label="Group" value={form.rideGroupId} onChange={e => setForm({ ...form, rideGroupId: e.target.value, paidById: '', participantIds: [] })}>
            <option value="">Select group...</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </Select>

          <Select label="Paid By" value={form.paidById} onChange={e => setForm({ ...form, paidById: e.target.value })}>
            <option value="">Who paid?</option>
            {groupMembers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Select>

          <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />

          <Input label="Total Fare (₹)" type="number" placeholder="240" value={form.totalFare} onChange={e => setForm({ ...form, totalFare: e.target.value })} />

          {groupMembers.length > 0 && (
            <div>
              <label className="text-xs text-text-secondary font-body uppercase tracking-wider block mb-2">Participants</label>
              <div className="space-y-2">
                {groupMembers.map(r => (
                  <div
                    key={r.id}
                    onClick={() => toggleParticipant(r.id)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: form.participantIds.includes(r.id) ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                      border: form.participantIds.includes(r.id) ? '1px solid rgba(99,102,241,0.4)' : '1px solid #1e1e2e'
                    }}
                  >
                    <span className="text-sm font-body text-text-primary">{r.name}</span>
                    <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: form.participantIds.includes(r.id) ? '#6366f1' : 'transparent', border: form.participantIds.includes(r.id) ? 'none' : '1px solid #3f3f5a' }}>
                      {form.participantIds.includes(r.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perShare && (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="text-sm text-text-secondary font-body">Per person share</span>
              <span className="font-mono font-bold text-accent-glow">₹{perShare}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 justify-center">Cancel</Button>
            <Button onClick={handleLogRide} loading={submitting} className="flex-1 justify-center">Log Ride</Button>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
