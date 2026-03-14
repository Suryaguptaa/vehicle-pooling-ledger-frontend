import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Background from './components/Background'
import Dashboard from './pages/Dashboard'
import Residents from './pages/Residents'
import Groups from './pages/Groups'
import Rides from './pages/Rides'
import Stats from './pages/Stats'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
        <div className="noise" />
        <Background />
        <Sidebar />
        <main className="ml-64 min-h-screen relative z-10">
          <div className="max-w-6xl mx-auto px-8 py-10">
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
    </BrowserRouter>
  )
}
