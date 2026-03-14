import axios from 'axios'

const api = axios.create({
  baseURL: 'https://vehicle-pooling-ledger-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
})

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
}

export const rideApi = {
  logRide: (data) => api.post('/rides', data),
  getByGroup: (groupId) => api.get(`/rides?groupId=${groupId}`),
  settle: (groupId) => api.patch(`/rides/settle?groupId=${groupId}`),
}

export default api
