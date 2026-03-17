import { useState } from 'react'
import { Send, Phone } from 'lucide-react'
import { mockContacts, mockMessages } from '../lib/mockData'

export default function Conversations() {
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState(mockMessages)
  const [reply, setReply] = useState('')

  const contactsWithMessages = mockContacts.filter(c =>
    messages.some(m => m.contact_id === c.id)
  )

  const selected = mockContacts.find(c => c.id === selectedId)
  const thread = messages
    .filter(m => m.contact_id === selectedId)
    .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))

  const sendReply = () => {
    if (!reply.trim() || !selectedId) return
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      contact_id: selectedId,
      direction: 'outbound',
      body: reply,
      sent_at: new Date().toISOString(),
    }])
    setReply('')
  }

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">Conversations</h1>
          <p className="text-xs text-gray-500 mt-1">{contactsWithMessages.length} active threads</p>
        </div>
        <div className="flex-1 overflow-auto">
          {contactsWithMessages.map(c => {
            const lastMsg = messages
              .filter(m => m.contact_id === c.id)
              .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))[0]
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedId === c.id ? 'bg-indigo-50 border-l-2 border-l-indigo-600' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900">{c.name}</span>
                  <span className="text-xs text-gray-400">
                    {lastMsg ? new Date(lastMsg.sent_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{lastMsg?.body}</p>
              </button>
            )
          })}
          {contactsWithMessages.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-400">No conversations yet</div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        {selected ? (
          <>
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{selected.name}</h2>
                <p className="text-xs text-gray-500">{selected.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">via Twilio</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
              {thread.map(m => (
                <div key={m.id} className={`flex ${m.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                    m.direction === 'outbound'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}>
                    <p>{m.body}</p>
                    <p className={`text-xs mt-1 ${m.direction === 'outbound' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(m.sent_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim()}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
