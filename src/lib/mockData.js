const now = new Date()
const daysAgo = (n) => new Date(now.getTime() - n * 86400000).toISOString()

export const mockContacts = [
  { id: '1', name: 'Marcus Johnson', phone: '+15551234567', email: 'marcus@email.com', source: 'website_form', status: 'new', device_interest: 'iPhone 15 Pro Max', notes: 'Interested in bulk purchase', created_at: daysAgo(0) },
  { id: '2', name: 'Sarah Chen', phone: '+15559876543', email: 'sarah.c@email.com', source: 'twilio_inbound', status: 'contacted', device_interest: 'Samsung Galaxy S24 Ultra', notes: 'Called about trade-in pricing', created_at: daysAgo(1) },
  { id: '3', name: 'Derek Williams', phone: '+15555551234', email: 'dwilliams@email.com', source: 'manual', status: 'offer_made', device_interest: 'iPhone 14 Pro', notes: 'Offered $650, waiting for response', created_at: daysAgo(2) },
  { id: '4', name: 'Lisa Park', phone: '+15553334444', email: 'lisa.park@email.com', source: 'csv_import', status: 'closed', device_interest: 'Google Pixel 8 Pro', notes: 'Sold for $480, paid via Zelle', created_at: daysAgo(3) },
  { id: '5', name: 'James Rodriguez', phone: '+15556667777', email: 'jrod@email.com', source: 'website_form', status: 'new', device_interest: 'iPhone 15 Pro', notes: 'Found us on Instagram ad', created_at: daysAgo(0) },
  { id: '6', name: 'Aisha Thompson', phone: '+15558889999', email: 'aisha.t@email.com', source: 'twilio_inbound', status: 'contacted', device_interest: 'Samsung Galaxy Z Fold 5', notes: 'Wants a quote for 3 devices', created_at: daysAgo(4) },
  { id: '7', name: 'Tyler Brooks', phone: '+15552223333', email: 'tbrooks@email.com', source: 'manual', status: 'dead', device_interest: 'iPhone 13', notes: 'No longer interested', created_at: daysAgo(7) },
  { id: '8', name: 'Nina Patel', phone: '+15554445555', email: 'nina.p@email.com', source: 'website_form', status: 'offer_made', device_interest: 'iPhone 15 Pro Max', notes: 'Negotiating price, very interested', created_at: daysAgo(1) },
  { id: '9', name: 'Carlos Mendez', phone: '+15551112222', email: 'carlos.m@email.com', source: 'csv_import', status: 'closed', device_interest: 'Samsung Galaxy S23', notes: 'Sold for $390', created_at: daysAgo(5) },
  { id: '10', name: 'Emma Davis', phone: '+15557778888', email: 'emma.d@email.com', source: 'twilio_inbound', status: 'new', device_interest: 'Google Pixel 8', notes: 'Texted asking about availability', created_at: daysAgo(0) },
]

export const mockMessages = [
  { id: '1', contact_id: '2', direction: 'inbound', body: 'Hi, I saw your ad about phone trade-ins. What can I get for a Galaxy S24 Ultra?', sent_at: daysAgo(1) },
  { id: '2', contact_id: '2', direction: 'outbound', body: 'Hey Sarah! Thanks for reaching out. For a Galaxy S24 Ultra in good condition, we can offer $750-$850 depending on storage and condition. Can you send some photos?', sent_at: daysAgo(1) },
  { id: '3', contact_id: '2', direction: 'inbound', body: 'It\'s 256GB, great condition with original box. I\'ll send pics tonight.', sent_at: daysAgo(0) },
  { id: '4', contact_id: '6', direction: 'inbound', body: 'Hello, I have 3 Z Fold 5s I want to sell. What\'s your best price?', sent_at: daysAgo(4) },
  { id: '5', contact_id: '6', direction: 'outbound', body: 'Hi Aisha! For 3 Z Fold 5s we can do a bulk deal. What condition and storage size are they?', sent_at: daysAgo(4) },
  { id: '6', contact_id: '10', direction: 'inbound', body: 'Do you have any Pixel 8s in stock? Looking for 128GB unlocked.', sent_at: daysAgo(0) },
]

export const mockFollowUps = [
  { id: '1', contact_id: '1', due_date: new Date(now.getTime() + 86400000).toISOString().split('T')[0], note: 'Send intro pricing for iPhone 15 Pro Max', completed: false },
  { id: '2', contact_id: '2', due_date: new Date(now.getTime() + 2 * 86400000).toISOString().split('T')[0], note: 'Follow up on photos for Galaxy S24 Ultra', completed: false },
  { id: '3', contact_id: '3', due_date: new Date().toISOString().split('T')[0], note: 'Check if Derek accepted the $650 offer', completed: false },
  { id: '4', contact_id: '6', due_date: new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0], note: 'Send bulk pricing for 3 Z Fold 5s', completed: false },
  { id: '5', contact_id: '8', due_date: new Date(now.getTime() - 86400000).toISOString().split('T')[0], note: 'Final price negotiation with Nina', completed: true },
  { id: '6', contact_id: '5', due_date: new Date(now.getTime() + 4 * 86400000).toISOString().split('T')[0], note: 'Reach out about iPhone 15 Pro availability', completed: false },
]

export const mockAutomations = [
  {
    id: '1',
    name: 'New Website Lead Welcome',
    trigger: 'new_contact',
    conditions: [{ field: 'source', operator: 'equals', value: 'website_form' }],
    actions: [
      { type: 'send_sms', template: 'Hi {{name}}! Thanks for your interest in {{device_interest}}. We\'ll get you a quote within 24 hours. - Techy Teague' },
      { type: 'update_status', value: 'contacted' },
      { type: 'create_follow_up', days: 2, note: 'Follow up on initial outreach' },
    ],
    active: true,
  },
  {
    id: '2',
    name: 'Twilio Inbound Auto-Reply',
    trigger: 'inbound_sms',
    conditions: [],
    actions: [
      { type: 'send_sms', template: 'Thanks for texting Techy Teague! We got your message and will reply shortly.' },
      { type: 'create_follow_up', days: 1, note: 'Reply to inbound text' },
    ],
    active: true,
  },
  {
    id: '3',
    name: 'Dead Lead Cleanup',
    trigger: 'status_change',
    conditions: [{ field: 'status', operator: 'equals', value: 'dead' }],
    actions: [
      { type: 'send_sms', template: 'Hi {{name}}, we noticed you\'re no longer interested. If anything changes, feel free to text us back! - Techy Teague' },
    ],
    active: false,
  },
]
