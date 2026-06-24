import { useState } from 'react';
import { Save, IndianRupee, MapPin, Gift, CalendarOff, Bell, Shield } from 'lucide-react';
import { dealer as initialDealer } from '../data/mockData';
import { Dealer } from '../types';
import clsx from 'clsx';

type Tab = 'pricing' | 'zones' | 'referral' | 'holidays' | 'profile';

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'profile', label: 'Business Profile', icon: Shield },
  { key: 'pricing', label: 'Pricing', icon: IndianRupee },
  { key: 'zones', label: 'Service Zones', icon: MapPin },
  { key: 'referral', label: 'Referral Program', icon: Gift },
  { key: 'holidays', label: 'Holiday Calendar', icon: CalendarOff },
];

const ZONE_OPTIONS = ['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Porur', 'Chromepet', 'Tambaram', 'Perambur', 'Ambattur'];

export default function Settings() {
  const [tab, setTab] = useState<Tab>('profile');
  const [dealer, setDealer] = useState<Dealer>(initialDealer);
  const [saved, setSaved] = useState(false);
  const [holidays, setHolidays] = useState([
    { date: '2026-08-15', reason: 'Independence Day' },
    { date: '2026-10-02', reason: 'Gandhi Jayanti' },
    { date: '2026-11-01', reason: 'Diwali' },
  ]);
  const [newHoliday, setNewHoliday] = useState({ date: '', reason: '' });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const toggleZone = (zone: string) => {
    setDealer(d => ({ ...d, zones: d.zones.includes(zone) ? d.zones.filter(z => z !== zone) : [...d.zones, zone] }));
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Configure your business preferences</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Tab nav */}
        <div className="lg:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={clsx('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                  tab === key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100')}>
                <Icon size={16} className="flex-shrink-0" /> {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {tab === 'profile' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">Business Profile</h2>
              {[
                { label: 'Business Name', key: 'businessName' },
                { label: 'Owner Name', key: 'name' },
                { label: 'Phone Number', key: 'phone' },
                { label: 'Email Address', key: 'email' },
                { label: 'Business Address', key: 'address' },
                { label: 'GST Number', key: 'gst' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input className="input" value={(dealer as any)[f.key]} onChange={e => setDealer(d => ({ ...d, [f.key]: e.target.value }))} />
                </div>
              ))}
              <button onClick={save} className={`btn-primary flex items-center gap-2 ${saved ? '!bg-green-500' : ''}`}>
                <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {tab === 'pricing' && (
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-gray-800">Pricing Configuration</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Can Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input type="number" className="input pl-7" value={dealer.canPrice} onChange={e => setDealer(d => ({ ...d, canPrice: +e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label">Can Deposit (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input type="number" className="input pl-7" value={dealer.depositAmount} onChange={e => setDealer(d => ({ ...d, depositAmount: +e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Zone-Specific Pricing (Coming Soon)</p>
                <p className="text-xs text-gray-500">Set different prices for different delivery zones. This feature will be available in v1.1.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-700">Current price per can: <strong>₹{dealer.canPrice}</strong></p>
                <p className="text-xs text-blue-500 mt-0.5">Can deposit: ₹{dealer.depositAmount} (refundable)</p>
              </div>
              <button onClick={save} className={`btn-primary flex items-center gap-2 ${saved ? '!bg-green-500' : ''}`}>
                <Save size={14} /> {saved ? 'Saved!' : 'Save Pricing'}
              </button>
            </div>
          )}

          {tab === 'zones' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">Service Zones</h2>
              <p className="text-sm text-gray-500">Select the zones you currently serve. Customers in selected zones can place orders.</p>
              <div className="flex flex-wrap gap-2">
                {ZONE_OPTIONS.map(zone => (
                  <button key={zone} onClick={() => toggleZone(zone)}
                    className={clsx('px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all', dealer.zones.includes(zone) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300')}>
                    {zone}
                  </button>
                ))}
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
                {dealer.zones.length} active zones: {dealer.zones.join(', ')}
              </div>
              <button onClick={save} className={`btn-primary flex items-center gap-2 ${saved ? '!bg-green-500' : ''}`}>
                <Save size={14} /> {saved ? 'Saved!' : 'Save Zones'}
              </button>
            </div>
          )}

          {tab === 'referral' && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Referral Program</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={clsx('w-10 h-6 rounded-full relative transition-colors', dealer.referralEnabled ? 'bg-blue-600' : 'bg-gray-200')} onClick={() => setDealer(d => ({ ...d, referralEnabled: !d.referralEnabled }))}>
                    <span className={clsx('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all', dealer.referralEnabled ? 'left-5' : 'left-1')}></span>
                  </div>
                  <span className="text-sm text-gray-600">{dealer.referralEnabled ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>
              <div className={clsx('space-y-4', !dealer.referralEnabled && 'opacity-40 pointer-events-none')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Referrer Bonus (₹)</label>
                    <p className="text-xs text-gray-400 mb-1">Wallet credit for the person who refers</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input type="number" className="input pl-7" value={dealer.referralBonus} onChange={e => setDealer(d => ({ ...d, referralBonus: +e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="label">New Customer Signup Bonus (₹)</label>
                    <p className="text-xs text-gray-400 mb-1">Wallet credit for the new customer</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input type="number" className="input pl-7" value={dealer.signupBonus} onChange={e => setDealer(d => ({ ...d, signupBonus: +e.target.value }))} />
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700 space-y-1">
                  <p>Referrer earns: <strong>₹{dealer.referralBonus}</strong> per successful referral</p>
                  <p>New customer gets: <strong>₹{dealer.signupBonus}</strong> signup bonus</p>
                </div>
              </div>
              <button onClick={save} className={`btn-primary flex items-center gap-2 ${saved ? '!bg-green-500' : ''}`}>
                <Save size={14} /> {saved ? 'Saved!' : 'Save Referral Settings'}
              </button>
            </div>
          )}

          {tab === 'holidays' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-800">Holiday & Suspension Calendar</h2>
              <p className="text-sm text-gray-500">Mark non-delivery dates. Customers will be auto-notified and subscription orders skipped.</p>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Add New Holiday</p>
                <div className="flex gap-3 flex-wrap">
                  <input type="date" className="input flex-1 min-w-32 text-sm" value={newHoliday.date} onChange={e => setNewHoliday(p => ({ ...p, date: e.target.value }))} />
                  <input type="text" className="input flex-1 min-w-32 text-sm" placeholder="Reason (e.g. Diwali)" value={newHoliday.reason} onChange={e => setNewHoliday(p => ({ ...p, reason: e.target.value }))} />
                  <button className="btn-primary text-sm" onClick={() => { if (newHoliday.date && newHoliday.reason) { setHolidays(p => [...p, newHoliday]); setNewHoliday({ date: '', reason: '' }); } }}>Add</button>
                </div>
              </div>

              <div className="space-y-2">
                {holidays.sort((a, b) => a.date.localeCompare(b.date)).map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <CalendarOff size={14} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{h.reason}</p>
                        <p className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <button onClick={() => setHolidays(p => p.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
