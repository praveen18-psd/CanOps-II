import { ShoppingCart, Users, Truck, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { orders, customers, deliveryPersons, weeklyStats, zoneStats } from '../data/mockData';
import StatusBadge from '../components/ui/StatusBadge';
import { OrderStatus } from '../types';

const today = new Date().toISOString().split('T')[0];
const todayOrders = orders.filter(o => o.date === today);
const delivered = todayOrders.filter(o => o.status === 'delivered').length;
const failed = todayOrders.filter(o => o.status === 'failed').length;
const pending = todayOrders.filter(o => o.status === 'pending' || o.status === 'assigned' || o.status === 'in_transit').length;
const revenue = todayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.amount, 0);
const activeDP = deliveryPersons.filter(d => d.active).length;
const totalDues = customers.reduce((s, c) => s + c.outstandingDues, 0);

const statusDistribution = [
  { name: 'Delivered', value: delivered, color: '#10B981' },
  { name: 'In Transit', value: todayOrders.filter(o => o.status === 'in_transit').length, color: '#8B5CF6' },
  { name: 'Pending', value: pending, color: '#F59E0B' },
  { name: 'Failed', value: failed, color: '#EF4444' },
];

const StatCard = ({ label, value, sub, icon: Icon, iconBg, trend }: { label: string; value: string | number; sub?: string; icon: React.ElementType; iconBg: string; trend?: string }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Good morning, Rajan 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Orders" value={todayOrders.length} sub={`${delivered} delivered`} icon={ShoppingCart} iconBg="bg-blue-500" trend="↑ 8% vs yesterday" />
        <StatCard label="Revenue Today" value={`₹${revenue}`} sub="From deliveries" icon={TrendingUp} iconBg="bg-emerald-500" trend="↑ 12% vs yesterday" />
        <StatCard label="Active Customers" value={customers.filter(c => c.active).length} sub={`₹${totalDues} dues`} icon={Users} iconBg="bg-violet-500" />
        <StatCard label="On Field Today" value={`${activeDP} riders`} sub={`${deliveryPersons.filter(d => d.active).reduce((s, d) => s + d.completedDeliveries, 0)} delivered`} icon={Truck} iconBg="bg-orange-500" />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Delivered', count: delivered, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'In Transit', count: todayOrders.filter(o => o.status === 'in_transit').length, icon: Truck, color: 'text-purple-600 bg-purple-50' },
          { label: 'Pending', count: pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Failed', count: failed, icon: XCircle, color: 'text-red-600 bg-red-50' },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className={`card p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${color.split(' ')[1]} flex items-center justify-center`}>
              <Icon size={18} className={color.split(' ')[0]} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Bar Chart */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Weekly Orders & Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyStats} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Orders" />
              <Bar yAxisId="right" dataKey="delivered" fill="#10B981" radius={[4, 4, 0, 0]} name="Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Today's Status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {statusDistribution.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}></span>
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <a href="/orders" className="text-xs text-blue-600 hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {todayOrders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50">
                <div>
                  <p className="text-sm font-medium text-gray-800">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.zone} · {order.quantity} can{order.quantity > 1 ? 's' : ''} · {order.slot}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">₹{order.amount}</span>
                  <StatusBadge status={order.status as OrderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Team Status */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Delivery Team Today</h2>
            <a href="/delivery-persons" className="text-xs text-blue-600 hover:underline">Manage</a>
          </div>
          <div className="divide-y divide-gray-50">
            {deliveryPersons.map(dp => (
              <div key={dp.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-600">{dp.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800">{dp.name}</p>
                    {dp.active
                      ? <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      : <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>}
                  </div>
                  <p className="text-xs text-gray-400">{dp.zones.join(', ')}</p>
                </div>
                {dp.active && (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{dp.completedDeliveries}/{dp.todayDeliveries}</p>
                    <p className="text-xs text-gray-400">delivered</p>
                  </div>
                )}
                {!dp.active && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Off duty</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Performance */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Zone Performance Today</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {zoneStats.map(zone => (
            <div key={zone.zone} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 font-medium truncate">{zone.zone}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{zone.orders}</p>
              <p className="text-xs text-green-600 font-medium">₹{zone.revenue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
