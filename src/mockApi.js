// ============================================================
// MOCK API — Frontend-only demo. Resets on every page refresh.
// Mirrors the real Spring Boot backend's logic exactly.
// Balance Logic: perShare = fare / participants
//   Every participant → balance -= perShare
//   Payer → balance += fare  (net: payer gets +fare - perShare)
// ============================================================

let nextId = 10

const genId = () => ++nextId
const genCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()
const delay = (ms = 200) => new Promise(r => setTimeout(r, ms))
const wrap = (data) => ({ data: { data } })

// ─── Seed Data ───────────────────────────────────────────────
const residents = [
  { id: 1, name: 'Rahul Sharma',  email: 'rahul@example.com',  flatNumber: 'A-101', balance: 160.00 },
  { id: 2, name: 'Priya Mehta',   email: 'priya@example.com',  flatNumber: 'A-102', balance: -80.00 },
  { id: 3, name: 'Sneha Patel',   email: 'sneha@example.com',  flatNumber: 'B-203', balance: -80.00 },
  { id: 4, name: 'Arjun Verma',   email: 'arjun@example.com',  flatNumber: 'B-205', balance: 0.00 },
]

const groups = [
  { id: 1, name: 'Morning Commute', description: 'Tower A & B daily office ride', inviteCode: 'MRN001' },
  { id: 2, name: 'Evening Crew',    description: 'Return trip from office',       inviteCode: 'EVN002' },
]

// memberIds per group
const groupMembers = {
  1: [1, 2, 3],  // Morning Commute: Rahul, Priya, Sneha
  2: [1, 4],     // Evening Crew: Rahul, Arjun
}

const rides = [
  {
    id: 1,
    rideGroupId: 1,
    rideGroupName: 'Morning Commute',
    paidById: 1,
    paidByName: 'Rahul Sharma',
    date: '2025-04-01',
    totalFare: 240,
    perPersonShare: 80,
    participantIds: [1, 2, 3],
    participantNames: ['Rahul Sharma', 'Priya Mehta', 'Sneha Patel'],
    settled: false,
  },
  {
    id: 2,
    rideGroupId: 2,
    rideGroupName: 'Evening Crew',
    paidById: 4,
    paidByName: 'Arjun Verma',
    date: '2025-04-02',
    totalFare: 180,
    perPersonShare: 90,
    participantIds: [1, 4],
    participantNames: ['Rahul Sharma', 'Arjun Verma'],
    settled: true,
  },
]

// ─── Helper ─────────────────────────────────────────────────
const getResident = (id) => residents.find(r => r.id === parseInt(id))
const getMembersOf = (groupId) => (groupMembers[parseInt(groupId)] || []).map(id => getResident(id)).filter(Boolean)

// ─── Auth (mock only — no real JWT) ─────────────────────────
export const mockAuthApi = {
  login: async ({ email, password }) => {
    await delay()
    const r = residents.find(r => r.email === email)
    if (!r || password.length < 4) throw { response: { data: { message: 'Invalid credentials' } } }
    return wrap({ token: 'mock-jwt-token', userId: r.id, name: r.name, email: r.email, flatNumber: r.flatNumber })
  },
  register: async ({ name, email, flatNumber }) => {
    await delay()
    const existing = residents.find(r => r.email === email)
    if (existing) throw { response: { data: { message: 'Email already registered' } } }
    const r = { id: genId(), name, email, flatNumber, balance: 0 }
    residents.push(r)
    return wrap({ token: 'mock-jwt-token', userId: r.id, name: r.name, email: r.email, flatNumber: r.flatNumber })
  },
}

// ─── Residents ───────────────────────────────────────────────
export const mockResidentApi = {
  getAll: async () => {
    await delay()
    return wrap([...residents])
  },
  getById: async (id) => {
    await delay()
    return wrap(getResident(id))
  },
  create: async ({ name, email, flatNumber }) => {
    await delay()
    const r = { id: genId(), name, email, flatNumber, balance: 0 }
    residents.push(r)
    return wrap(r)
  },
  getBalance: async (id) => {
    await delay()
    return wrap({ balance: getResident(id)?.balance ?? 0 })
  },
}

// ─── Groups ──────────────────────────────────────────────────
export const mockGroupApi = {
  getAll: async () => {
    await delay()
    return wrap([...groups])
  },
  getById: async (id) => {
    await delay()
    return wrap(groups.find(g => g.id === parseInt(id)))
  },
  create: async ({ name, description }) => {
    await delay()
    const g = { id: genId(), name, description, inviteCode: genCode() }
    groups.push(g)
    groupMembers[g.id] = []
    return wrap(g)
  },
  addMember: async (groupId, residentId) => {
    await delay()
    const gid = parseInt(groupId)
    const rid = parseInt(residentId)
    if (!groupMembers[gid]) groupMembers[gid] = []
    if (!groupMembers[gid].includes(rid)) groupMembers[gid].push(rid)
    return wrap({ message: 'Member added' })
  },
  getMembers: async (groupId) => {
    await delay()
    return wrap(getMembersOf(groupId))
  },
  joinByInviteCode: async (inviteCode, residentId) => {
    await delay()
    const g = groups.find(g => g.inviteCode === inviteCode.toUpperCase())
    if (!g) throw { response: { data: { message: 'Invalid invite code' } } }
    const rid = parseInt(residentId)
    if (!groupMembers[g.id]) groupMembers[g.id] = []
    if (!groupMembers[g.id].includes(rid)) groupMembers[g.id].push(rid)
    return wrap({ message: 'Joined group' })
  },
}

// ─── Rides ───────────────────────────────────────────────────
export const mockRideApi = {
  logRide: async ({ rideGroupId, paidById, date, totalFare, participantIds }) => {
    await delay()
    const group = groups.find(g => g.id === parseInt(rideGroupId))
    const payer = getResident(paidById)
    if (!group || !payer) throw { response: { data: { message: 'Invalid group or payer' } } }

    const pids = participantIds.map(Number)
    const perShare = totalFare / pids.length

    // ── Apply backend balance logic ──────────────────────────
    // Every participant: balance -= perShare
    // Payer: balance += totalFare
    // (net for payer = -perShare + totalFare)
    pids.forEach(pid => {
      const r = getResident(pid)
      if (r) r.balance = parseFloat((r.balance - perShare).toFixed(2))
    })
    const payerResident = getResident(paidById)
    if (payerResident) payerResident.balance = parseFloat((payerResident.balance + totalFare).toFixed(2))

    const ride = {
      id: genId(),
      rideGroupId: parseInt(rideGroupId),
      rideGroupName: group.name,
      paidById: parseInt(paidById),
      paidByName: payer.name,
      date,
      totalFare,
      perPersonShare: parseFloat(perShare.toFixed(2)),
      participantIds: pids,
      participantNames: pids.map(id => getResident(id)?.name).filter(Boolean),
      settled: false,
    }
    rides.push(ride)
    return wrap(ride)
  },

  getByGroup: async (groupId) => {
    await delay()
    const gid = parseInt(groupId)
    return wrap(rides.filter(r => r.rideGroupId === gid).reverse())
  },

  settle: async (groupId) => {
    await delay()
    const gid = parseInt(groupId)
    const memberIds = groupMembers[gid] || []

    // Reset balances for all group members
    memberIds.forEach(id => {
      const r = getResident(id)
      if (r) r.balance = 0
    })

    // Mark all rides in group as settled
    rides.filter(r => r.rideGroupId === gid).forEach(r => { r.settled = true })
    return wrap({ message: 'Group settled' })
  },
}
