import { useState } from 'react';
import { Search, Filter, Plus, RefreshCw, ChevronDown } from 'lucide-react';
import { orders as initialOrders, deliveryPersons } from '../data/mockData';
import StatusBadge from '../components/ui/StatusBadge';
import { Order, OrderStatus, DeliverySlot } from '../types';
import clsx from 'clsx';

const slotLabel: Record<DeliverySlot, string> = { morning: '🌅 Morning', afternoon: '☀️ Afternoon', evening: '🌆 Evening' };
const payIcon: Record<string, string> = { wallet: '💳', upi: '📱', cash: '💵' };

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [slotFilter, setSlotFilter] = useState<DeliverySlot | 'all'>('all');
  const [assignModal, setAssignModal] = useState<Order | null>(null);
  const [selectedDP, setSelectedDP] = useState('');
  const [addModal, setAddModal] = useState(false);

  const filtered = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || o.zone.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSlot = slotFilter === 'all' || o.slot === slotFilter;
    return matchSearch && matchStatus && matchSlot;
  });

  const handleAssign = () => {
    if (!assignModal || !selectedDP) return;
    const dp = deliveryPersons.find(d => d.id === selectedDP);
    setOrders(prev => prev.map(o => o.id === assignModal.id ? { ...o, status: 'assigned' as OrderStatus, deliveryPersonId: selectedDP, deliveryPersonName: dp?.name } : o));
    setAssignModal(null);
    setSelectedDP('');
  };

  const counts: Record<OrderStatus | 'all', number> = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    assigned: orders.filter(o => o.status === 'assigned').length,
    in_transit: orders.filter(o => o.status === 'in_transit').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    failed: orders.filter(o => o.status === 'failed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">Today · {orders.length} total</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm"><RefreshCw size={14} /> Refresh</button>
          <button onClick={() => setAddModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={14} /> New Order</button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'assigned', 'in_transit', 'delivered', 'failed'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
              statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
            <span className={clsx('px-1.5 py-0.5 rounded-full text-xs', statusFilter === s ? 'bg-white/20' : 'bg-gray-100')}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-8 text-sm" placeholder="Search customer, zone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-40 text-sm" value={slotFilter} onChange={e => setSlotFilter(e.target.value as any)}>
          <option value="all">All Slots</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Zone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty / Slot</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.zone}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.quantity} can{order.quantity > 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-400">{slotLabel[order.slot]}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                    {order.failureReason && <p className="text-xs text-red-500 mt-0.5">{order.failureReason}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.deliveryPersonName ?? <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium">₹{order.amount}</span>
                    <span className="ml-1 text-gray-400 text-xs">{payIcon[order.paymentMethod]}</span>
                  </td>
                  <td className="px-4 py-3">
                    {(order.status === 'pending' || !order.deliveryPersonId) && (
                      <button onClick={() => setAssignModal(order)} className="text-xs text-blue-600 hover:underline font-medium">Assign</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">Assign Delivery Person</h3>
            <p className="text-sm text-gray-500 mb-5">Order for <strong>{assignModal.customerName}</strong> — {assignModal.quantity} can(s) — {assignModal.zone}</p>
            <select className="input mb-4" value={selectedDP} onChange={e => setSelectedDP(e.target.value)}>
              <option value="">Select delivery person...</option>
              {deliveryPersons.filter(d => d.active).map(dp => (
                <option key={dp.id} value={dp.id}>{dp.name} — {dp.zones.join(', ')}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={handleAssign} disabled={!selectedDP}>Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
