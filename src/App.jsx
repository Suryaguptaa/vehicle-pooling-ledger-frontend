import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Background from './components/Background'
import Dashboard from './pages/Dashboard'
import Residents from './pages/Residents'
import Groups from './pages/Groups'
import Rides from './pages/Rides'
import Stats from './pages/Stats'
import Login from './pages/Login'
import Register from './pages/Register'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  if (token) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
              <div className="noise" />
              <Background />
              <Sidebar />
              <main className="lg:ml-64 min-h-screen relative z-10">
                <div className="max-w-6xl mx-auto px-4 py-6 pt-20 lg:pt-10 lg:px-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/residents" element={<Residents />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/rides" element={<Rides />} />
                    <Route path="/stats" element={<Stats />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}