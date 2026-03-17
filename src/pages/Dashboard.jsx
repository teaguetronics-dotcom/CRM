import { useMemo } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react'
import { mockContacts } from '../lib/mockData'

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8']

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  offer_made: 'Offer Made',
  closed: 'Closed',
  dead: 'Dead',
}

const SOURCE_LABELS = {
  website_form: 'Website Form',
  manual: 'Manual',
  csv_import: 'CSV Import',
  twilio_inbound: 'Twilio Inbound',
}

export default function Dashboard() {
  const stats = useMemo(() => {
    const total = mockContacts.length
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 86400000)
    const thisWeek = mockContacts.filter(c => new Date(c.created_at) >= weekAgo).length
    const closed = mockContacts.filter(c => c.status === 'closed').length
    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : 0
    const revenue = closed * 435 // mock avg revenue per closed deal

    return { total, thisWeek, conversionRate, revenue }
  }, [])

  const pipelineData = useMemo(() => {
    const counts = {}
    mockContacts.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1
    })
    return Object.entries(counts).map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
    }))
  }, [])

  const sourceData = useMemo(() => {
    const counts = {}
    mockContacts.forEach(c => {
      counts[c.source] = (counts[c.source] || 0) + 1
    })
    return Object.entries(counts).map(([source, count]) => ({
      name: SOURCE_LABELS[source] || source,
      count,
    }))
  }, [])

  const kpis = [
    { label: 'Total Leads', value: stats.total, icon: Users, color: 'bg-indigo-500' },
    { label: 'Leads This Week', value: stats.thisWeek, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: Target, color: 'bg-emerald-500' },
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-amber-500' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your phone flipping business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pipelineData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
