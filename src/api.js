import axios from 'axios'
import { mockAuthApi, mockResidentApi, mockGroupApi, mockRideApi } from './mockApi'

// ─── Demo Mode check ─────────────────────────────────────────
// Uses sessionStorage so demo state resets on every page refresh/tab close
export const isDemoMode = () => sessionStorage.getItem('isDemo') === 'true'
export const enableDemoMode = () => sessionStorage.setItem('isDemo', 'true')
export const disableDemoMode = () => {
  sessionStorage.removeItem('isDemo')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// ─── Real Axios instance ──────────────────────────────────────
const api = axios.create({
  baseURL: 'https://vehicle-pooling-ledger-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isDemoMode() && (error.response?.status === 403 || error.response?.status === 401)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Real API functions ───────────────────────────────────────
const realAuthApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

const realResidentApi = {
  getAll: () => api.get('/residents'),
  getById: (id) => api.get(`/residents/${id}`),
  create: (data) => api.post('/residents', data),
  getBalance: (id) => api.get(`/residents/${id}/balance`),
}

const realGroupApi = {
  getAll: () => api.get('/groups'),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post('/groups', data),
  addMember: (groupId, residentId) => api.post(`/groups/${groupId}/members?residentId=${residentId}`),
  getMembers: (groupId) => api.get(`/groups/${groupId}/members`),
  joinByInviteCode: (inviteCode, residentId) => api.post(`/groups/join?inviteCode=${inviteCode}&residentId=${residentId}`),
}

const realRideApi = {
  logRide: (data) => api.post('/rides', data),
  getByGroup: (groupId) => api.get(`/rides?groupId=${groupId}`),
  settle: (groupId) => api.patch(`/rides/settle?groupId=${groupId}`),
}

// ─── Exported APIs (auto-switch based on demo mode) ──────────
export const authApi     = isDemoMode() ? mockAuthApi     : realAuthApi
export const residentApi = isDemoMode() ? mockResidentApi : realResidentApi
export const groupApi    = isDemoMode() ? mockGroupApi    : realGroupApi
export const rideApi     = isDemoMode() ? mockRideApi     : realRideApi

export default api