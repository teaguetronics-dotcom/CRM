import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react'
import { mockFollowUps, mockContacts } from '../lib/mockData'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function CalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [followUps, setFollowUps] = useState(mockFollowUps)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ contact_id: '', due_date: '', note: '' })

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    return days
  }, [currentMonth, currentYear])

  const getFollowUpsForDay = (day) => {
    if (!day) return []
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return followUps.filter(f => f.due_date === dateStr)
  }

  const getContactName = (id) => mockContacts.find(c => c.id === id)?.name || 'Unknown'

  const toggleComplete = (id) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, completed: !f.completed } : f))
  }

  const addFollowUp = () => {
    if (!form.contact_id || !form.due_date || !form.note) return
    setFollowUps(prev => [...prev, {
      id: crypto.randomUUID(),
      contact_id: form.contact_id,
      due_date: form.due_date,
      note: form.note,
      completed: false,
    }])
    setShowModal(false)
    setForm({ contact_id: '', due_date: '', note: '' })
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const upcoming = followUps
    .filter(f => !f.completed && f.due_date >= todayStr)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 8)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Follow-ups and appointments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Add Follow-Up
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{MONTHS[currentMonth]} {currentYear}</h2>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              const dayFollowUps = getFollowUpsForDay(day)
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
              return (
                <div key={i} className={`min-h-[80px] border border-gray-100 p-1 ${day ? 'bg-white' : 'bg-gray-50'}`}>
                  {day && (
                    <>
                      <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                        {day}
                      </span>
                      {dayFollowUps.map(f => (
                        <div
                          key={f.id}
                          onClick={() => toggleComplete(f.id)}
                          className={`mt-0.5 text-xs px-1.5 py-0.5 rounded truncate cursor-pointer ${
                            f.completed
                              ? 'bg-green-100 text-green-700 line-through'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                          title={`${getContactName(f.contact_id)}: ${f.note}`}
                        >
                          {f.note}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Follow-Ups</h2>
          <div className="space-y-3">
            {upcoming.map(f => (
              <div key={f.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <button onClick={() => toggleComplete(f.id)} className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center shrink-0 hover:border-indigo-500">
                  {f.completed && <Check className="w-3 h-3 text-indigo-600" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{getContactName(f.contact_id)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.note}</p>
                  <p className="text-xs text-indigo-600 mt-1">{f.due_date}</p>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No upcoming follow-ups</p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Follow-Up</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
                <select value={form.contact_id} onChange={e => setForm(f => ({ ...f, contact_id: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Select contact...</option>
                  {mockContacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note *</label>
                <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={addFollowUp} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Follow-Up</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
