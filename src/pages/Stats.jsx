import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { BarChart3, TrendingUp, IndianRupee, Car } from 'lucide-react'
import { residentApi, groupApi, rideApi } from '../api'
import { Card, PageHeader, StatCard, Loader, Badge } from '../components/UI'

const COLORS = ['#6366f1', '#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-xs font-mono" style={{ background: '#13131c', border: '1px solid #1e1e2e' }}>
        <p className="text-text-secondary mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>₹{p.value?.toFixed(0)}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function Stats() {
  const [residents, setResidents] = useState([])
  const [groups, setGroups] = useState([])
  const [allRides, setAllRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [rRes, gRes] = await Promise.all([residentApi.getAll(), groupApi.getAll()])
        const rs = rRes.data.data || []
        const gs = gRes.data.data || []
        setResidents(rs)
        setGroups(gs)
        const rideResults = await Promise.all(gs.map(g => rideApi.getByGroup(g.id).catch(() => ({ data: { data: [] } }))))
        setAllRides(rideResults.flatMap(r => r.data.data || []))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalSpend = allRides.reduce((s, r) => s + (r.totalFare || 0), 0)
  const settledRides = allRides.filter(r => r.settled).length
  const avgFare = allRides.length > 0 ? totalSpend / allRides.length : 0

  const spendByPayer = allRides.reduce((acc, ride) => {
    const name = ride.paidByName || 'Unknown'
    acc[name] = (acc[name] || 0) + (ride.totalFare || 0)
    return acc
  }, {})

  const payerChartData = Object.entries(spendByPayer).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount)

  const balanceChartData = residents
    .filter(r => r.balance !== 0)
    .map(r => ({ name: r.name, balance: parseFloat(r.balance || 0) }))
    .sort((a, b) => b.balance - a.balance)

  const groupSpend = groups.map(g => {
    const groupRides = allRides.filter(r => r.rideGroupName === g.name)
    return { name: g.name, amount: groupRides.reduce((s, r) => s + (r.totalFare || 0), 0) }
  }).filter(g => g.amount > 0)

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader title="Stats" subtitle="Spending analytics across all groups" />

      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Spend" value={`₹${totalSpend.toFixed(0)}`} icon={IndianRupee} color="accent" />
        <StatCard label="Total Rides" value={allRides.length} icon={Car} color="positive" />
        <StatCard label="Avg Fare" value={`₹${avgFare.toFixed(0)}`} icon={TrendingUp} color="warning" />
        <StatCard label="Settled" value={`${settledRides}/${allRides.length}`} icon={BarChart3} color="accent" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <p className="font-display font-semibold text-text-primary mb-1">Spending by Payer</p>
          <p className="text-xs text-text-secondary font-body mb-5">Total amount paid by each resident</p>
          {payerChartData.length === 0 ? (
            <p className="text-text-secondary text-sm font-body py-8 text-center">No ride data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={payerChartData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {payerChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <p className="font-display font-semibold text-text-primary mb-1">Spend by Group</p>
          <p className="text-xs text-text-secondary font-body mb-5">Total fare logged per group</p>
          {groupSpend.length === 0 ? (
            <p className="text-text-secondary text-sm font-body py-8 text-center">No group ride data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={groupSpend} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="amount">
                  {groupSpend.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span style={{ color: '#8888aa', fontSize: 11, fontFamily: 'DM Sans' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card>
        <p className="font-display font-semibold text-text-primary mb-1">Current Balances</p>
        <p className="text-xs text-text-secondary font-body mb-5">Who owes whom — positive means others owe them</p>
        {balanceChartData.length === 0 ? (
          <p className="text-text-secondary text-sm font-body py-8 text-center">All balances are zero — everyone is settled up!</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={balanceChartData} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="balance" radius={[6, 6, 0, 0]}>
                {balanceChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.balance > 0 ? '#34d399' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="mt-4 pt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" style={{ borderTop: '1px solid #1e1e2e' }}>
          {residents.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e2e' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>{r.name?.charAt(0)}</div>
                <span className="text-xs font-body text-text-secondary">{r.name?.split(' ')[0]}</span>
              </div>
              <span className={`text-xs font-mono font-medium ${parseFloat(r.balance) > 0 ? 'text-positive' : parseFloat(r.balance) < 0 ? 'text-negative' : 'text-text-secondary'}`}>
                {parseFloat(r.balance) > 0 ? '+' : ''}₹{parseFloat(r.balance || 0).toFixed(0)}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}