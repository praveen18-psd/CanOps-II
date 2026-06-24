import { useState } from 'react';
import { Wallet as WalletIcon, AlertTriangle, TrendingDown, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { customers as initialCustomers } from '../data/mockData';
import { Customer } from '../types';

const mockTransactions = [
  { id: 't1', customer: 'Priya Sharma', type: 'credit', amount: 200, desc: 'Wallet top-up via UPI', date: '2026-06-24' },
  { id: 't2', customer: 'Karthik Murugan', type: 'debit', amount: 45, desc: 'Order #o2 - 1 can', date: '2026-06-24' },
  { id: 't3', customer: 'Anita Reddy', type: 'credit', amount: 500, desc: 'Wallet top-up via Net Banking', date: '2026-06-23' },
  { id: 't4', customer: 'Meena Krishnan', type: 'debit', amount: 90, desc: 'Order #o5 - 2 cans', date: '2026-06-23' },
  { id: 't5', customer: 'Suresh Iyer', type: 'credit', amount: 100, desc: 'Manual credit by dealer', date: '2026-06-22' },
];

export default function Wallet() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [debitAmount, setDebitAmount] = useState('');
  const [tab, setTab] = useState<'wallet' | 'dues'>('wallet');

  const totalWallet = customers.reduce((s, c) => s + c.walletBalance, 0);
  const totalDues = customers.reduce((s, c) => s + c.outstandingDues, 0);
  const customersWithDues = customers.filter(c => c.outstandingDues > 0);

  const handleCredit = () => {
    const amt = parseFloat(creditAmount);
    if (!selected || isNaN(amt) || amt <= 0) return;
    setCustomers(prev => prev.map(c => c.id === selected.id ? { ...c, walletBalance: c.walletBalance + amt } : c));
    setSelected(prev => prev ? { ...prev, walletBalance: prev.walletBalance + amt } : null);
    setCreditAmount('');
  };

  const handleCollectDue = (customer: Customer, amount: number) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, outstandingDues: Math.max(0, c.outstandingDues - amount) } : c));
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Wallet & Dues Management</h1>
        <p className="text-sm text-gray-500">Monitor balances and collect outstanding payments</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Wallet Balance</p>
              <p className="text-3xl font-bold mt-1">₹{totalWallet}</p>
              <p className="text-blue-100 text-xs mt-1">Across {customers.length} customers</p>
            </div>
            <WalletIcon size={32} className="text-blue-200" />
          </div>
        </div>
        <div className="card p-5 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Outstanding Dues</p>
              <p className="text-3xl font-bold mt-1">₹{totalDues}</p>
              <p className="text-red-100 text-xs mt-1">{customersWithDues.length} customers</p>
            </div>
            <AlertTriangle size={32} className="text-red-200" />
          </div>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Recovery Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{Math.round((totalWallet / (totalWallet + totalDues)) * 100)}%</p>
          <div className="mt-2 bg-gray-100 rounded-full h-2">
            <div className="bg-green-500 rounded-full h-2" style={{ width: `${(totalWallet / (totalWallet + totalDues)) * 100}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Wallet vs total owed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['wallet', 'dues'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {t === 'wallet' ? 'Wallet Balances' : `Dues (${customersWithDues.length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Zone</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {tab === 'wallet' ? 'Wallet Balance' : 'Outstanding Due'}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(tab === 'wallet' ? customers : customersWithDues).map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelected(c)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.zone}</td>
                  <td className={`px-4 py-3 text-right font-bold ${tab === 'wallet' ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{tab === 'wallet' ? c.walletBalance : c.outstandingDues}
                  </td>
                  <td className="px-4 py-3">
                    {tab === 'dues' && c.outstandingDues > 0 && (
                      <button onClick={e => { e.stopPropagation(); handleCollectDue(c, c.outstandingDues); }} className="text-xs text-green-600 hover:underline font-medium">Mark Collected</button>
                    )}
                    {tab === 'wallet' && (
                      <button onClick={e => { e.stopPropagation(); setSelected(c); }} className="text-xs text-blue-600 hover:underline font-medium">Credit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {selected ? (
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-800">Wallet Management</h3>
              <div className="text-center bg-blue-50 rounded-xl py-4">
                <p className="text-xs text-gray-500">Current Balance</p>
                <p className="text-3xl font-bold text-blue-600">₹{customers.find(c => c.id === selected.id)?.walletBalance ?? 0}</p>
                <p className="text-sm text-gray-600 mt-0.5">{selected.name}</p>
              </div>
              <div>
                <label className="label">Credit Amount (₹)</label>
                <div className="flex gap-2">
                  <input type="number" className="input text-sm" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} placeholder="Enter amount" />
                  <button className="btn-primary text-sm px-3" onClick={handleCredit}><Plus size={14} /></button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[50, 100, 200, 500].map(amt => (
                    <button key={amt} onClick={() => setCreditAmount(String(amt))} className="text-xs py-1.5 border border-gray-200 hover:border-blue-300 rounded-lg font-medium text-gray-600 transition-colors">+{amt}</button>
                  ))}
                </div>
              </div>
              {selected.outstandingDues > 0 && (
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs font-medium text-red-700">Outstanding Due: ₹{selected.outstandingDues}</p>
                  <button onClick={() => handleCollectDue(selected, selected.outstandingDues)} className="mt-2 w-full text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1.5 rounded-lg font-medium transition-colors">Mark as Collected</button>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-5 text-center text-gray-400">
              <WalletIcon size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Select a customer to manage their wallet</p>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Recent Transactions</h3>
            <div className="space-y-2">
              {mockTransactions.slice(0, 4).map(t => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {t.type === 'credit' ? <ArrowDownLeft size={12} className="text-green-600" /> : <ArrowUpRight size={12} className="text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{t.customer}</p>
                    <p className="text-xs text-gray-400 truncate">{t.desc}</p>
                  </div>
                  <span className={`text-xs font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'credit' ? '+' : '-'}₹{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
