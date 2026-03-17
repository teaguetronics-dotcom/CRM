import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Conversations from './pages/Conversations'
import CalendarPage from './pages/CalendarPage'
import Automations from './pages/Automations'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/automations" element={<Automations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
