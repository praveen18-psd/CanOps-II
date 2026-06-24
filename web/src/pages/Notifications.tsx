import { useState } from 'react';
import { Send, MessageCircle, Smartphone, Users, Check } from 'lucide-react';

const templates = [
  { id: 't1', label: 'Price Update', body: 'Dear Customer, the price per water can has been updated to ₹{price} effective from {date}. Thank you for your support.' },
  { id: 't2', label: 'Holiday Notice', body: 'Dear Customer, we will not be delivering on {date} due to {reason}. Regular service resumes from {resume_date}.' },
  { id: 't3', label: 'Payment Reminder', body: 'Dear Customer, you have an outstanding balance of ₹{amount}. Please clear this at the earliest. Contact: {phone}.' },
  { id: 't4', label: 'New Offer', body: 'Special offer! Top up ₹500 or more and get ₹50 cashback. Offer valid till {date}.' },
];

export default function Notifications() {
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [targetZone, setTargetZone] = useState('all');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const zones = ['all', 'Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Porur', 'Chromepet'];

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setMessage('');
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500">Send bulk messages to customers via WhatsApp or SMS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Channel Selector */}
          <div className="card p-5">
            <p className="font-medium text-gray-800 mb-3">Notification Channel</p>
            <div className="flex gap-3">
              {([
                { key: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'text-green-600 bg-green-50 border-green-200' },
                { key: 'sms', icon: Smartphone, label: 'SMS', color: 'text-blue-600 bg-blue-50 border-blue-200' },
              ] as const).map(c => (
                <button key={c.key} onClick={() => setChannel(c.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${channel === c.key ? c.color : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <c.icon size={16} /> {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-800">Target Audience</p>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">8 customers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {zones.map(z => (
                <button key={z} onClick={() => setTargetZone(z)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${targetZone === z ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                  <Users size={12} className="inline mr-1.5" />{z === 'all' ? 'All Zones' : z}
                </button>
              ))}
            </div>
          </div>

          {/* Template Picker */}
          <div className="card p-5">
            <p className="font-medium text-gray-800 mb-3">Use a Template</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {templates.map(t => (
                <button key={t.id} onClick={() => { setSelectedTemplate(t.id); setMessage(t.body); }}
                  className={`text-left text-xs p-3 rounded-xl border transition-all ${selectedTemplate === t.id ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-200'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Message composer */}
            <p className="label">Message</p>
            <textarea className="input resize-none" rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message here, or select a template above..." />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">{message.length} / 160 chars</span>
              {channel === 'whatsapp' && <span className="text-xs text-green-600">✓ WhatsApp Business API</span>}
            </div>
          </div>

          {/* Send Button */}
          <button onClick={handleSend} disabled={!message.trim() || sent}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${sent ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            {sent ? <><Check size={16} /> Sent Successfully!</> : <><Send size={16} /> Send to {targetZone === 'all' ? 'All' : targetZone} Customers</>}
          </button>
        </div>

        {/* Preview & History */}
        <div className="space-y-4">
          {/* Message Preview */}
          <div className="card p-5">
            <p className="font-medium text-gray-800 mb-3">Preview</p>
            {channel === 'whatsapp' ? (
              <div className="bg-[#ECE5DD] rounded-2xl p-4 min-h-32">
                <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-xs shadow-sm">
                  <p className="text-xs text-[#128C7E] font-bold mb-1">Rajan Pure Water</p>
                  <p className="text-sm text-gray-800">{message || <span className="text-gray-300 italic">Your message will appear here...</span>}</p>
                  <p className="text-xs text-gray-400 text-right mt-1">✓✓</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-4 min-h-32">
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">SMS from: CANOPS</p>
                  <p className="text-sm text-gray-800">{message || <span className="text-gray-300 italic">Your message will appear here...</span>}</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent History */}
          <div className="card p-5">
            <p className="font-medium text-gray-800 mb-3">Recent Sends</p>
            <div className="space-y-3">
              {[
                { label: 'Price Update', to: 'All Zones', sent: '2 days ago', count: 8, channel: 'whatsapp' },
                { label: 'Holiday Notice', to: 'Anna Nagar', sent: '5 days ago', count: 3, channel: 'sms' },
                { label: 'Payment Reminder', to: 'T. Nagar', sent: '1 week ago', count: 4, channel: 'whatsapp' },
              ].map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${h.channel === 'whatsapp' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {h.channel === 'whatsapp' ? <MessageCircle size={11} className="text-green-600" /> : <Smartphone size={11} className="text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{h.label}</p>
                    <p className="text-gray-400">{h.to} · {h.count} recipients · {h.sent}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
