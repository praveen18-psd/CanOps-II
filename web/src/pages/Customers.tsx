import { useState } from 'react';
import { Search, Plus, UserCheck, UserX, Wallet, AlertCircle } from 'lucide-react';
import { customers as initialCustomers } from '../data/mockData';
import { Customer } from '../types';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '', zone: 'Anna Nagar', language: 'Tamil' });

  const zones = ['all', ...Array.from(new Set(customers.map(c => c.zone)))];

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchZone = zoneFilter === 'all' || c.zone === zoneFilter;
    return matchSearch && matchZone;
  });

  const handleWalletCredit = () => {
    const amount = parseFloat(walletAmount);
    if (!selected || isNaN(amount)) return;
    setCustomers(prev => prev.map(c => c.id === selected.id ? { ...c, walletBalance: c.walletBalance + amount } : c));
    setSelected(prev => prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null);
    setWalletAmount('');
  };

  const handleAdd = () => {
    const c: Customer = { id: `c${Date.now()}`, ...newCustomer, lat: 13.08, lng: 80.21, walletBalance: 0, outstandingDues: 0, totalOrders: 0, joinDate: new Date().toISOString().split('T')[0], active: true };
    setCustomers(prev => [...prev, c]);
    setAddModal(false);
    setNewCustomer({ name: '', phone: '', address: '', zone: 'Anna Nagar', language: 'Tamil' });
  };

  const totalDues = customers.reduce((s, c) => s + c.outstandingDues, 0);
  const totalWallet = customers.reduce((s, c) => s + c.walletBalance, 0);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">{customers.filter(c => c.active).length} active · ₹{totalDues} outstanding dues</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={14} /> Add Customer</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: customers.filter(c => c.active).length, color: 'bg-green-50 text-green-700' },
          { label: 'Total Wallet Balance', value: `₹${totalWallet}`, color: 'bg-purple-50 text-purple-700' },
          { label: 'Outstanding Dues', value: `₹${totalDues}`, color: 'bg-red-50 text-red-700' },
        ].map(item => (
          <div key={item.label} className={`card p-4 ${item.color}`}>
            <p className="text-xs font-medium opacity-80">{item.label}</p>
            <p className="text-xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-8 text-sm" placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-44 text-sm" value={zoneFilter} onChange={e => setZoneFilter(e.target.value)}>
          {zones.map(z => <option key={z} value={z}>{z === 'all' ? 'All Zones' : z}</option>)}
        </select>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(customer => (
          <div key={customer.id} onClick={() => setSelected(customer)} className="card p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-200 border border-transparent">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">{customer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
              </div>
              <div className="flex items-center gap-1">
                {customer.active ? <UserCheck size={14} className="text-green-500" /> : <UserX size={14} className="text-gray-400" />}
                {customer.outstandingDues > 0 && <AlertCircle size={14} className="text-red-400" />}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{customer.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{customer.phone}</p>
            <p className="text-xs text-gray-500 mt-1 truncate">{customer.address}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{customer.zone}</span>
              <div className="text-right">
                <p className="text-xs text-green-600 font-medium">₹{customer.walletBalance} wallet</p>
                {customer.outstandingDues > 0 && <p className="text-xs text-red-500">₹{customer.outstandingDues} due</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Customer Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-bold">{selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selected.name}</h3>
                  <p className="text-gray-500">{selected.phone}</p>
                  <p className="text-xs text-gray-400">{selected.language} · Joined {selected.joinDate}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-blue-700">{selected.totalOrders}</p>
                  <p className="text-xs text-blue-500">Orders</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-green-700">₹{selected.walletBalance}</p>
                  <p className="text-xs text-green-500">Wallet</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-red-700">₹{selected.outstandingDues}</p>
                  <p className="text-xs text-red-500">Dues</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="label">Address</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{selected.address}</p>
                <p className="text-xs text-gray-400 mt-1">Zone: {selected.zone}</p>
              </div>

              {/* Wallet Credit */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-800 mb-3 flex items-center gap-2"><Wallet size={16} /> Credit Wallet</p>
                <div className="flex gap-2">
                  <input type="number" className="input text-sm" placeholder="Amount (₹)" value={walletAmount} onChange={e => setWalletAmount(e.target.value)} />
                  <button className="btn-primary text-sm px-4" onClick={handleWalletCredit}>Credit</button>
                </div>
                <div className="flex gap-2 mt-2">
                  {[50, 100, 200, 500].map(amt => (
                    <button key={amt} onClick={() => { setWalletAmount(String(amt)); }} className="flex-1 text-xs bg-white border border-gray-200 hover:border-blue-300 rounded-lg py-1.5 font-medium text-gray-600 transition-colors">+{amt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-5">Add New Customer</h3>
            <div className="space-y-3">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Phone Number', key: 'phone', type: 'tel' },
                { label: 'Address', key: 'address', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="label">{field.label}</label>
                  <input type={field.type} className="input" value={(newCustomer as any)[field.key]} onChange={e => setNewCustomer(p => ({ ...p, [field.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="label">Zone</label>
                <select className="input" value={newCustomer.zone} onChange={e => setNewCustomer(p => ({ ...p, zone: e.target.value }))}>
                  {['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Porur', 'Chromepet'].map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Preferred Language</label>
                <select className="input" value={newCustomer.language} onChange={e => setNewCustomer(p => ({ ...p, language: e.target.value }))}>
                  {['Tamil', 'Telugu', 'Kannada', 'Malayalam', 'English'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="btn-secondary flex-1" onClick={() => setAddModal(false)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={handleAdd} disabled={!newCustomer.name || !newCustomer.phone}>Add Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
