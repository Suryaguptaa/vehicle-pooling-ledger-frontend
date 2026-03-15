import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, UsersRound, UserPlus, ChevronDown, ChevronUp, Copy, Check, LogIn } from 'lucide-react'
import { groupApi, residentApi } from '../api'
import { Card, PageHeader, Button, Input, Select, Modal, Loader, EmptyState, BalanceBadge, Badge, Toast } from '../components/UI'

function GroupCard({ group, residents, onRefresh, showToast }) {
  const [members, setMembers] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [addingMember, setAddingMember] = useState(false)
  const [selectedResident, setSelectedResident] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const loadMembers = async () => {
    try {
      const res = await groupApi.getMembers(group.id)
      setMembers(res.data.data || [])
    } catch (e) {}
  }

  useEffect(() => { if (expanded) loadMembers() }, [expanded])

  const handleAddMember = async () => {
    if (!selectedResident) return
    setLoading(true)
    try {
      await groupApi.addMember(group.id, selectedResident)
      showToast('Member added to group')
      setAddingMember(false)
      setSelectedResident('')
      loadMembers()
    } catch (e) {
      showToast('Failed to add member', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.inviteCode)
    setCopied(true)
    showToast('Invite code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const nonMembers = residents.filter(r => !members.find(m => m.id === r.id))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl glass">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
              <UsersRound size={18} style={{ color: '#818cf8' }} />
            </div>
            <div>
              <p className="font-display font-semibold text-text-primary">{group.name}</p>
              <p className="text-xs text-text-secondary font-body">{group.description}</p>
            </div>
          </div>
          <Badge variant="accent">#{group.id}</Badge>
        </div>

        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <span className="text-xs text-text-secondary font-body">Invite Code:</span>
          <span className="font-mono text-sm font-semibold text-accent-glow tracking-widest flex-1">{group.inviteCode}</span>
          <button onClick={handleCopyCode} className="text-text-secondary hover:text-text-primary transition-colors">
            {copied ? <Check size={14} className="text-positive" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 justify-center text-xs py-2" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Hide Members' : 'View Members'}
          </Button>
          <Button className="flex-1 justify-center text-xs py-2" onClick={() => setAddingMember(true)}>
            <UserPlus size={14} />
            Add Member
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5" style={{ borderTop: '1px solid #1e1e2e' }}>
              <p className="text-xs text-text-secondary uppercase tracking-widest mt-4 mb-3 font-body">Members & Balances</p>
              {members.length === 0 ? (
                <p className="text-text-secondary text-sm font-body py-4 text-center">No members yet</p>
              ) : (
                <div className="space-y-2">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e2e' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                          {m.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-body text-text-primary">{m.name}</p>
                          <p className="text-xs text-text-secondary">{m.flatNumber}</p>
                        </div>
                      </div>
                      <BalanceBadge balance={m.balance} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={addingMember} onClose={() => setAddingMember(false)} title={`Add Member to ${group.name}`}>
        <div className="space-y-4">
          <Select label="Select Resident" value={selectedResident} onChange={e => setSelectedResident(e.target.value)}>
            <option value="">Choose a resident...</option>
            {nonMembers.map(r => (
              <option key={r.id} value={r.id}>{r.name} — {r.flatNumber}</option>
            ))}
          </Select>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setAddingMember(false)} className="flex-1 justify-center">Cancel</Button>
            <Button onClick={handleAddMember} loading={loading} className="flex-1 justify-center">Add to Group</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}

export default function Groups() {
  const [groups, setGroups] = useState([])
  const [residents, setResidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [inviteCode, setInviteCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    try {
      const [gRes, rRes] = await Promise.all([groupApi.getAll(), residentApi.getAll()])
      setGroups(gRes.data.data || [])
      setResidents(rRes.data.data || [])
    } catch (e) {
      showToast('Failed to load groups', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.name) return
    setSubmitting(true)
    try {
      await groupApi.create(form)
      setForm({ name: '', description: '' })
      setCreateModalOpen(false)
      showToast('Group created successfully')
      load()
    } catch (e) {
      showToast('Failed to create group', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleJoin = async () => {
    if (!inviteCode) return
    setSubmitting(true)
    try {
      await groupApi.joinByInviteCode(inviteCode.toUpperCase(), user.id)
      setInviteCode('')
      setJoinModalOpen(false)
      showToast('Joined group successfully!')
      load()
    } catch (e) {
      showToast(e.response?.data?.message || 'Invalid invite code', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader
        title="Groups"
        subtitle={`${groups.length} commute groups`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setJoinModalOpen(true)}>
              <LogIn size={15} />
              Join Group
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus size={16} />
              New Group
            </Button>
          </div>
        }
      />

      {groups.length === 0 ? (
        <EmptyState icon={UsersRound} title="No groups yet" subtitle="Create a group or join one with an invite code" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {groups.map(g => (
            <GroupCard key={g.id} group={g} residents={residents} onRefresh={load} showToast={showToast} />
          ))}
        </div>
      )}

      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Group">
        <div className="space-y-4">
          <Input label="Group Name" placeholder="Morning Commute Crew" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Description" placeholder="Tower A daily office commute" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} className="flex-1 justify-center">Cancel</Button>
            <Button onClick={handleCreate} loading={submitting} className="flex-1 justify-center">Create Group</Button>
          </div>
        </div>
      </Modal>

      <Modal open={joinModalOpen} onClose={() => setJoinModalOpen(false)} title="Join a Group">
        <div className="space-y-4">
          <p className="text-xs text-text-secondary font-body">Ask the group admin for the 6-character invite code and enter it below.</p>
          <Input
            label="Invite Code"
            placeholder="ABC123"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value.toUpperCase())}
            style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setJoinModalOpen(false)} className="flex-1 justify-center">Cancel</Button>
            <Button onClick={handleJoin} loading={submitting} className="flex-1 justify-center">Join Group</Button>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}