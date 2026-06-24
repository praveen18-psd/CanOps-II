import { useState } from 'react';
import { Plus, Phone, MapPin, Truck, ToggleLeft, ToggleRight } from 'lucide-react';
import { deliveryPersons as initialDPs } from '../data/mockData';
import { DeliveryPerson } from '../types';

const vehicleIcon: Record<string, string> = { 'Two-Wheeler': '🛵', 'Three-Wheeler': '🛺', 'Four-Wheeler': '🚚' };

export default function DeliveryPersons() {
  const [dps, setDPs] = useState<DeliveryPerson[]>(initialDPs);
  const [selected, setSelected] = useState<DeliveryPerson | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', vehicleType: 'Two-Wheeler', zones: [] as string[] });
  const zones = ['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Porur', 'Chromepet'];

  const toggleActive = (id: string) => setDPs(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));

  const handleAdd = () => {
    const dp: DeliveryPerson = { id: `dp${Date.now()}`, ...form, active: true, lat: 13.08, lng: 80.21, todayDeliveries: 0, completedDeliveries: 0, cashCollected: 0 };
    setDPs(prev => [...prev, dp]);
    setAddModal(false);
    setForm({ name: '', phone: '', vehicleType: 'Two-Wheeler', zones: [] });
  };

  const totalDeliveries = dps.reduce((s, d) => s + d.completedDeliveries, 0);
  const totalCash = dps.reduce((s, d) => s + d.cashCollected, 0);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Delivery Team</h1>
          <p className="text-sm text-gray-500">{dps.filter(d => d.active).length} active · {totalDeliveries} deliveries today</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={14} /> Add Rider</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Riders', value: dps.filter(d => d.active).length },
          { label: 'Total Deliveries', value: totalDeliveries },
          { label: 'Cash Collected', value: `₹${totalCash}` },
          { label: 'Avg per Rider', value: dps.filter(d => d.active).length ? Math.round(totalDeliveries / dps.filter(d => d.active).length) : 0 },
        ].map(item => (
          <div key={item.label} className="card p-4">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dps.map(dp => (
          <div key={dp.id} onClick={() => setSelected(dp)} className="card p-5 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-200 border border-transparent">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${dp.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <span className={`text-sm font-bold ${dp.active ? 'text-green-600' : 'text-gray-400'}`}>{dp.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{dp.name}</h3>
                  <p className="text-xs text-gray-400">{vehicleIcon[dp.vehicleType]} {dp.vehicleType}</p>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); toggleActive(dp.id); }} className="text-gray-400 hover:text-gray-600">
                {dp.active ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} />}
              </button>
            </div>

            <div className="flex gap-1 flex-wrap mb-4">
              {dp.zones.map(z => <span key={z} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{z}</span>)}
            </div>

            {dp.active ? (
              <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-50 pt-3">
                <div>
                  <p className="text-lg font-bold text-gray-900">{dp.completedDeliveries}</p>
                  <p className="text-xs text-gray-400">Done</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{dp.todayDeliveries - dp.completedDeliveries}</p>
                  <p className="text-xs text-gray-400">Left</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">₹{dp.cashCollected}</p>
                  <p className="text-xs text-gray-400">Cash</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-gray-400 border-t border-gray-50">Off duty today</div>
            )}

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
              <a href={`tel:${dp.phone}`} onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-1.5 rounded-lg transition-colors">
                <Phone size={12} /> {dp.phone}
              </a>
              <button onClick={e => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 py-1.5 rounded-lg transition-colors">
                <MapPin size={12} /> Track
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-5">Add Delivery Person</h3>
            <div className="space-y-3">
              <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="label">Phone Number</label><input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              <div>
                <label className="label">Vehicle Type</label>
                <select className="input" value={form.vehicleType} onChange={e => setForm(p => ({ ...p, vehicleType: e.target.value }))}>
                  {['Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Assigned Zones</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {zones.map(z => (
                    <button key={z} type="button"
                      onClick={() => setForm(p => ({ ...p, zones: p.zones.includes(z) ? p.zones.filter(x => x !== z) : [...p.zones, z] }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.zones.includes(z) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                      {z}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="btn-secondary flex-1" onClick={() => setAddModal(false)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={handleAdd} disabled={!form.name || !form.phone || !form.zones.length}>Add Rider</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
