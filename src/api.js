import axios from 'axios'

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
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const residentApi = {
  getAll: () => api.get('/residents'),
  getById: (id) => api.get(`/residents/${id}`),
  create: (data) => api.post('/residents', data),
  getBalance: (id) => api.get(`/residents/${id}/balance`),
}

export const groupApi = {
  getAll: () => api.get('/groups'),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post('/groups', data),
  addMember: (groupId, residentId) => api.post(`/groups/${groupId}/members?residentId=${residentId}`),
  getMembers: (groupId) => api.get(`/groups/${groupId}/members`),
  joinByInviteCode: (inviteCode, residentId) => api.post(`/groups/join?inviteCode=${inviteCode}&residentId=${residentId}`),
}

export const rideApi = {
  logRide: (data) => api.post('/rides', data),
  getByGroup: (groupId) => api.get(`/rides?groupId=${groupId}`),
  settle: (groupId) => api.patch(`/rides/settle?groupId=${groupId}`),
}

export default api