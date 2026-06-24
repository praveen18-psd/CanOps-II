import { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, Plus } from 'lucide-react';
import { inventory as initialInventory } from '../data/mockData';
import { InventoryItem } from '../types';

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [editModal, setEditModal] = useState<InventoryItem | null>(null);
  const [updateQty, setUpdateQty] = useState('');

  const handleUpdate = (type: 'add' | 'return') => {
    if (!editModal) return;
    const qty = parseInt(updateQty);
    if (isNaN(qty) || qty <= 0) return;
    setInventory(prev => prev.map(item => {
      if (item.id !== editModal.id) return item;
      if (type === 'add') return { ...item, available: item.available + qty };
      return { ...item, returned: item.returned + qty, available: item.available + qty };
    }));
    setEditModal(null);
    setUpdateQty('');
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-sm text-gray-500">Track can stock, dispatches, and returns</p>
      </div>

      {/* Alert bar */}
      {inventory.some(i => i.available <= i.threshold) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Low Stock Alert</p>
            <p className="text-xs text-red-600">{inventory.filter(i => i.available <= i.threshold).map(i => i.type).join(', ')} — reorder needed</p>
          </div>
        </div>
      )}

      {/* Inventory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {inventory.map(item => {
          const pct = Math.min(100, Math.round((item.available / (item.available + item.dispatched)) * 100));
          const isLow = item.available <= item.threshold;
          return (
            <div key={item.id} className={`card p-6 ${isLow ? 'border-red-200' : ''}`}>
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLow ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <Package size={22} className={isLow ? 'text-red-600' : 'text-blue-600'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.type}</h3>
                    {isLow && <span className="text-xs text-red-600 font-medium flex items-center gap-1"><AlertTriangle size={11} /> Below threshold</span>}
                  </div>
                </div>
                <button onClick={() => setEditModal(item)} className="btn-secondary text-sm px-3 py-1.5">Update</button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Available', value: item.available, color: isLow ? 'text-red-600' : 'text-green-600' },
                  { label: 'Dispatched', value: item.dispatched, color: 'text-blue-600' },
                  { label: 'Returned', value: item.returned, color: 'text-purple-600' },
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Available stock</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${isLow ? 'bg-red-500' : pct > 60 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${pct}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Reorder threshold: {item.threshold} units</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispatch log table */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Today's Dispatch Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase rounded-l-lg">Rider</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Zone</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Dispatched</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Delivered</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase rounded-r-lg">Returned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { rider: 'Murugan S', zone: 'Anna Nagar / T. Nagar', dispatched: 20, delivered: 18, returned: 2 },
                { rider: 'Selvam R', zone: 'Adyar / Velachery', dispatched: 24, delivered: 22, returned: 2 },
                { rider: 'Kannan T', zone: 'Porur / Chromepet', dispatched: 14, delivered: 13, returned: 1 },
              ].map(row => (
                <tr key={row.rider} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.rider}</td>
                  <td className="px-4 py-3 text-gray-500">{row.zone}</td>
                  <td className="px-4 py-3 text-center font-medium">{row.dispatched}</td>
                  <td className="px-4 py-3 text-center font-medium text-green-600">{row.delivered}</td>
                  <td className="px-4 py-3 text-center font-medium text-blue-600">{row.returned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">Update {editModal.type}</h3>
            <p className="text-sm text-gray-500 mb-5">Current available: <strong>{editModal.available}</strong></p>
            <label className="label">Quantity</label>
            <input type="number" className="input mb-4" value={updateQty} onChange={e => setUpdateQty(e.target.value)} placeholder="Enter quantity" />
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn-secondary flex-1 !bg-purple-50 !text-purple-700 !border-purple-200 hover:!bg-purple-100" onClick={() => handleUpdate('return')}>Mark Returned</button>
              <button className="btn-primary flex-1" onClick={() => handleUpdate('add')}>Add Stock</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
