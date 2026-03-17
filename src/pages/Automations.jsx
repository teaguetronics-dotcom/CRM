import { useState } from 'react'
import { Plus, X, Zap, Power, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { mockAutomations } from '../lib/mockData'

const TRIGGER_OPTIONS = [
  { value: 'new_contact', label: 'New Contact Created' },
  { value: 'inbound_sms', label: 'Inbound SMS Received' },
  { value: 'status_change', label: 'Contact Status Changed' },
  { value: 'webhook', label: 'Webhook Received' },
]

const ACTION_TYPES = [
  { value: 'send_sms', label: 'Send SMS' },
  { value: 'update_status', label: 'Update Status' },
  { value: 'create_follow_up', label: 'Create Follow-Up' },
]

const STATUS_OPTIONS = ['new', 'contacted', 'offer_made', 'closed', 'dead']
const formatStatus = (s) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

const TRIGGER_LABELS = Object.fromEntries(TRIGGER_OPTIONS.map(t => [t.value, t.label]))

export default function Automations() {
  const [automations, setAutomations] = useState(mockAutomations)
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [form, setForm] = useState({
    name: '',
    trigger: 'new_contact',
    conditions: [],
    actions: [{ type: 'send_sms', template: '' }],
  })

  const toggleActive = (id) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  const deleteAutomation = (id) => {
    if (confirm('Delete this automation?')) {
      setAutomations(prev => prev.filter(a => a.id !== id))
    }
  }

  const addAction = () => {
    setForm(f => ({ ...f, actions: [...f.actions, { type: 'send_sms', template: '' }] }))
  }

  const updateAction = (i, updates) => {
    setForm(f => ({
      ...f,
      actions: f.actions.map((a, idx) => idx === i ? { ...a, ...updates } : a),
    }))
  }

  const removeAction = (i) => {
    setForm(f => ({ ...f, actions: f.actions.filter((_, idx) => idx !== i) }))
  }

  const saveAutomation = () => {
    if (!form.name.trim()) return
    setAutomations(prev => [...prev, {
      ...form,
      id: crypto.randomUUID(),
      active: true,
      created_at: new Date().toISOString(),
    }])
    setShowModal(false)
    setForm({ name: '', trigger: 'new_contact', conditions: [], actions: [{ type: 'send_sms', template: '' }] })
  }

  const renderActionLabel = (action) => {
    switch (action.type) {
      case 'send_sms': return `Send SMS: "${action.template?.slice(0, 50)}..."`
      case 'update_status': return `Set status to ${formatStatus(action.value || '')}`
      case 'create_follow_up': return `Create follow-up in ${action.days || 0} days`
      default: return action.type
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-sm text-gray-500 mt-1">Automate repetitive tasks for your pipeline</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> New Automation
        </button>
      </div>

      <div className="space-y-3">
        {automations.map(a => (
          <div key={a.id} className={`bg-white rounded-xl border ${a.active ? 'border-indigo-200' : 'border-gray-200'} overflow-hidden`}>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.active ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <Zap className={`w-5 h-5 ${a.active ? 'text-indigo-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">{a.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Trigger: {TRIGGER_LABELS[a.trigger] || a.trigger}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {a.active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => toggleActive(a.id)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Toggle active">
                  <Power className={`w-4 h-4 ${a.active ? 'text-green-600' : 'text-gray-400'}`} />
                </button>
                <button onClick={() => setExpanded(expanded === a.id ? null : a.id)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  {expanded === a.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={() => deleteAutomation(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            {expanded === a.id && (
              <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                {a.conditions?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Conditions</p>
                    {a.conditions.map((c, i) => (
                      <span key={i} className="inline-block text-xs bg-gray-100 px-2 py-1 rounded mr-1 mb-1">
                        {c.field} {c.operator} "{c.value}"
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs font-medium text-gray-500 mb-1">Actions</p>
                <ol className="space-y-1">
                  {a.actions?.map((action, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                      {renderActionLabel(action)}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Automation</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., New Lead Welcome SMS"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                <select value={form.trigger} onChange={e => setForm(f => ({ ...f, trigger: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {TRIGGER_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Actions</label>
                  <button onClick={addAction} className="text-xs text-indigo-600 hover:text-indigo-800">+ Add Action</button>
                </div>
                <div className="space-y-3">
                  {form.actions.map((action, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Action {i + 1}</span>
                        {form.actions.length > 1 && (
                          <button onClick={() => removeAction(i)} className="text-xs text-red-500">Remove</button>
                        )}
                      </div>
                      <select
                        value={action.type}
                        onChange={e => updateAction(i, { type: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
                      >
                        {ACTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      {action.type === 'send_sms' && (
                        <textarea
                          placeholder="SMS template (use {{name}}, {{device_interest}})"
                          value={action.template || ''}
                          onChange={e => updateAction(i, { template: e.target.value })}
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      )}
                      {action.type === 'update_status' && (
                        <select
                          value={action.value || ''}
                          onChange={e => updateAction(i, { value: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">Select status...</option>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
                        </select>
                      )}
                      {action.type === 'create_follow_up' && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Days"
                            value={action.days || ''}
                            onChange={e => updateAction(i, { days: parseInt(e.target.value) || 0 })}
                            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Follow-up note"
                            value={action.note || ''}
                            onChange={e => updateAction(i, { note: e.target.value })}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={saveAutomation} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Automation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
