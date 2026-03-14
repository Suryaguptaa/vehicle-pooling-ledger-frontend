import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Car, UsersRound, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { residentApi, groupApi, rideApi } from '../api'
import { Card, StatCard, PageHeader, Loader, BalanceBadge, Badge } from '../components/UI'

export default function Dashboard() {
  const [residents, setResidents] = useState([])
  const [groups, setGroups] = useState([])
  const [allRides, setAllRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, gRes] = await Promise.all([residentApi.getAll(), groupApi.getAll()])
        setResidents(rRes.data.data || [])
        const gs = gRes.data.data || []
        setGroups(gs)
        const ridePromises = gs.map(g => rideApi.getByGroup(g.id).catch(() => ({ data: { data: [] } })))
        const rideResults = await Promise.all(ridePromises)
        const rides = rideResults.flatMap(r => r.data.data || [])
        setAllRides(rides)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalSpend = allRides.reduce((s, r) => s + (r.totalFare || 0), 0)
  const unsettled = allRides.filter(r => !r.settled).length
  const topCreditor = [...residents].sort((a, b) => b.balance - a.balance)[0]
  const topDebtor = [...residents].sort((a, b) => a.balance - b.balance)[0]

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your pooling ledger at a glance" />

      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        <StatCard label="Residents" value={residents.length} icon={Users} color="accent" sub="Registered members" />
        <StatCard label="Groups" value={groups.length} icon={UsersRound} color="positive" sub="Active commute groups" />
        <StatCard label="Total Rides" value={allRides.length} icon={Car} color="warning" sub={`${unsettled} unsettled`} />
        <StatCard label="Total Spend" value={`₹${totalSpend.toFixed(0)}`} icon={Activity} color="accent" sub="Across all groups" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-5">
              <p className="font-display font-semibold text-text-primary">All Residents</p>
              <Badge variant="accent">{residents.length} total</Badge>
            </div>
            {residents.length === 0 ? (
              <p className="text-text-secondary text-sm font-body py-8 text-center">No residents yet. Add some from the Residents page.</p>
            ) : (
              <div className="space-y-2">
                {residents.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e2e' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-display font-bold" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                        {r.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-body font-medium text-text-primary">{r.name}</p>
                        <p className="text-xs text-text-secondary">{r.flatNumber}</p>
                      </div>
                    </div>
                    <BalanceBadge balance={r.balance} />
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-xs text-text-secondary uppercase tracking-widest mb-4 font-body">Top Creditor</p>
            {topCreditor && topCreditor.balance > 0 ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                  <TrendingUp size={18} className="text-positive" />
                </div>
                <div>
                  <p className="font-display font-semibold text-text-primary">{topCreditor.name}</p>
                  <p className="text-positive text-sm font-mono">+₹{topCreditor.balance?.toFixed(0)}</p>
                </div>
              </div>
            ) : <p className="text-text-secondary text-sm font-body">All settled up</p>}
          </Card>

          <Card>
            <p className="text-xs text-text-secondary uppercase tracking-widest mb-4 font-body">Top Debtor</p>
            {topDebtor && topDebtor.balance < 0 ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                  <TrendingDown size={18} className="text-negative" />
                </div>
                <div>
                  <p className="font-display font-semibold text-text-primary">{topDebtor.name}</p>
                  <p className="text-negative text-sm font-mono">-₹{Math.abs(topDebtor.balance)?.toFixed(0)}</p>
                </div>
              </div>
            ) : <p className="text-text-secondary text-sm font-body">All settled up</p>}
          </Card>

          <Card>
            <p className="text-xs text-text-secondary uppercase tracking-widest mb-4 font-body">Groups Overview</p>
            {groups.length === 0 ? (
              <p className="text-text-secondary text-sm font-body">No groups yet</p>
            ) : (
              <div className="space-y-2">
                {groups.map(g => (
                  <div key={g.id} className="flex items-center justify-between">
                    <p className="text-sm font-body text-text-primary truncate">{g.name}</p>
                    <Badge variant="accent">Group</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
