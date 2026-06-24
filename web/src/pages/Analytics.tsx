import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { weeklyStats, zoneStats, orders, customers, deliveryPersons } from '../data/mockData';
import { TrendingUp, Package, Users, Truck } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

const monthlyTrend = [
  { month: 'Jan', orders: 1240, revenue: 55800 }, { month: 'Feb', orders: 1380, revenue: 62100 },
  { month: 'Mar', orders: 1520, revenue: 68400 }, { month: 'Apr', orders: 1650, revenue: 74250 },
  { month: 'May', orders: 1480, revenue: 66600 }, { month: 'Jun', orders: 1720, revenue: 77400 },
];

const deliveryPerf = deliveryPersons.filter(d => d.active).map(dp => ({
  name: dp.name.split(' ')[0],
  completed: dp.completedDeliveries,
  pending: dp.todayDeliveries - dp.completedDeliveries,
  cash: dp.cashCollected,
}));

export default function Analytics() {
  const totalRevenue = weeklyStats.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = weeklyStats.reduce((s, d) => s + d.orders, 0);
  const deliveryRate = Math.round((weeklyStats.reduce((s, d) => s + d.delivered, 0) / totalOrders) * 100);
  const failRate = Math.round((weeklyStats.reduce((s, d) => s + d.failed, 0) / totalOrders) * 100);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-sm text-gray-500">Business performance insights</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Weekly Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: `${totalOrders} orders`, icon: TrendingUp, bg: 'bg-blue-500' },
          { label: 'Delivery Rate', value: `${deliveryRate}%`, sub: 'of all orders', icon: Package, bg: 'bg-green-500' },
          { label: 'Active Customers', value: customers.filter(c => c.active).length, sub: 'this week', icon: Users, bg: 'bg-violet-500' },
          { label: 'Failure Rate', value: `${failRate}%`, sub: 'of all orders', icon: Truck, bg: 'bg-orange-500' },
        ].map(kpi => (
          <div key={kpi.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
              </div>
              <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                <kpi.icon size={18} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Orders */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Weekly Orders vs Delivered</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyStats} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="orders" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Orders" />
              <Bar dataKey="delivered" fill="#10B981" radius={[3, 3, 0, 0]} name="Delivered" />
              <Bar dataKey="failed" fill="#EF4444" radius={[3, 3, 0, 0]} name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#EFF6FF" strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Orders by Zone</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={zoneStats} dataKey="orders" nameKey="zone" cx="50%" cy="50%" outerRadius={75} paddingAngle={3}>
                {zoneStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {zoneStats.map((z, i) => (
              <div key={z.zone} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }}></span><span className="text-gray-600">{z.zone}</span></div>
                <span className="font-medium">{z.orders} · ₹{z.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery team performance */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-800 mb-4">Delivery Team Performance</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deliveryPerf} layout="vertical" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={60} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="completed" fill="#10B981" radius={[0, 3, 3, 0]} name="Completed" stackId="a" />
              <Bar dataKey="pending" fill="#F59E0B" radius={[0, 3, 3, 0]} name="Pending" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {deliveryPersons.filter(d => d.active).map(dp => (
              <div key={dp.id} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm font-semibold text-gray-800">{dp.name.split(' ')[0]}</p>
                <p className="text-lg font-bold text-green-600">{dp.completedDeliveries}</p>
                <p className="text-xs text-gray-400">deliveries</p>
                <p className="text-xs text-blue-600 font-medium">₹{dp.cashCollected}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Top Customers by Orders</h2>
        <div className="space-y-3">
          {[...customers].sort((a, b) => b.totalOrders - a.totalOrders).slice(0, 5).map((c, i) => (
            <div key={c.id} className="flex items-center gap-4">
              <span className="w-6 text-sm font-bold text-gray-400">{i + 1}</span>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">{c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">{c.zone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{c.totalOrders} orders</p>
                <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1">
                  <div className="bg-blue-500 rounded-full h-1.5" style={{ width: `${(c.totalOrders / 311) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
