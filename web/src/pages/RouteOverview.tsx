import { useState } from 'react';
import { MapPin, Phone, Package, CheckCircle, Clock, Navigation } from 'lucide-react';
import { deliveryPersons, orders } from '../data/mockData';
import { DeliveryPerson } from '../types';

const PIN_COLORS: Record<string, string> = {
  dp1: '#3B82F6', dp2: '#10B981', dp3: '#F59E0B', dp4: '#8B5CF6'
};

export default function RouteOverview() {
  const [selected, setSelected] = useState<DeliveryPerson | null>(null);
  const activeDP = deliveryPersons.filter(d => d.active);

  const dpOrders = (dpId: string) => orders.filter(o => o.deliveryPersonId === dpId);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Route Overview</h1>
        <p className="text-sm text-gray-500">Live delivery tracking · {activeDP.length} active riders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map placeholder (real integration needs Google Maps API key) */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
              <span className="text-white text-sm font-medium">Live Map — Chennai Delivery Zones</span>
              <span className="text-xs text-gray-400">Google Maps API integration ready</span>
            </div>
            {/* Stylized SVG map representation */}
            <div className="relative bg-gradient-to-br from-slate-100 to-blue-50" style={{ height: 480 }}>
              {/* Road lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 480">
                {/* Background */}
                <rect width="600" height="480" fill="#E8F0FE" />
                {/* Grid roads */}
                {[80, 160, 240, 320, 400].map(y => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#C8D8E8" strokeWidth="1.5" />)}
                {[100, 200, 300, 400, 500].map(x => <line key={x} x1={x} y1="0" x2={x} y2="480" stroke="#C8D8E8" strokeWidth="1.5" />)}
                {/* Main roads */}
                <line x1="0" y1="200" x2="600" y2="220" stroke="#B0C4D8" strokeWidth="4" />
                <line x1="280" y1="0" x2="260" y2="480" stroke="#B0C4D8" strokeWidth="4" />
                <line x1="0" y1="350" x2="600" y2="380" stroke="#B0C4D8" strokeWidth="3" />
                {/* Zone labels */}
                {[
                  { x: 80, y: 80, label: 'Anna Nagar', color: '#DBEAFE' },
                  { x: 350, y: 100, label: 'T. Nagar', color: '#D1FAE5' },
                  { x: 420, y: 250, label: 'Adyar', color: '#EDE9FE' },
                  { x: 360, y: 380, label: 'Velachery', color: '#FEF3C7' },
                  { x: 80, y: 280, label: 'Porur', color: '#FCE7F3' },
                  { x: 100, y: 400, label: 'Chromepet', color: '#ECFDF5' },
                ].map(zone => (
                  <g key={zone.label}>
                    <rect x={zone.x - 45} y={zone.y - 14} width={90} height={26} rx={6} fill={zone.color} opacity={0.9} />
                    <text x={zone.x} y={zone.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#374151">{zone.label}</text>
                  </g>
                ))}
                {/* Delivery person dots */}
                {activeDP.map((dp, i) => {
                  const positions = [{ x: 120, y: 100 }, { x: 440, y: 260 }, { x: 130, y: 300 }];
                  const pos = positions[i] || { x: 300, y: 240 };
                  const color = PIN_COLORS[dp.id] || '#6B7280';
                  return (
                    <g key={dp.id} className="cursor-pointer" onClick={() => setSelected(selected?.id === dp.id ? null : dp)}>
                      {/* Pulse ring */}
                      <circle cx={pos.x} cy={pos.y} r={22} fill={color} opacity={0.2} />
                      {/* Main dot */}
                      <circle cx={pos.x} cy={pos.y} r={14} fill={color} />
                      <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{dp.name.split(' ')[0][0]}{dp.name.split(' ')[1]?.[0] ?? ''}</text>
                      {/* Route line to stops */}
                    </g>
                  );
                })}
                {/* Delivery stop dots */}
                {[
                  { x: 140, y: 75, status: 'delivered' }, { x: 100, y: 120, status: 'in_transit' },
                  { x: 390, y: 110, status: 'delivered' }, { x: 450, y: 280, status: 'assigned' },
                  { x: 110, y: 320, status: 'delivered' }, { x: 130, y: 420, status: 'failed' },
                  { x: 160, y: 170, status: 'pending' }, { x: 420, y: 230, status: 'pending' },
                ].map((stop, i) => (
                  <circle key={i} cx={stop.x} cy={stop.y} r={5}
                    fill={stop.status === 'delivered' ? '#10B981' : stop.status === 'in_transit' ? '#8B5CF6' : stop.status === 'failed' ? '#EF4444' : stop.status === 'pending' ? '#F59E0B' : '#9CA3AF'} />
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Legend</p>
                {[
                  { color: '#10B981', label: 'Delivered' },
                  { color: '#8B5CF6', label: 'In Transit' },
                  { color: '#F59E0B', label: 'Pending' },
                  { color: '#EF4444', label: 'Failed' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2 text-xs text-gray-600 mb-0.5">
                    <span className="w-3 h-3 rounded-full" style={{ background: l.color }}></span> {l.label}
                  </div>
                ))}
              </div>

              {/* Rider bubbles */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {activeDP.map(dp => (
                  <button key={dp.id} onClick={() => setSelected(selected?.id === dp.id ? null : dp)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all shadow-sm ${selected?.id === dp.id ? 'ring-2 ring-offset-1' : ''}`}
                    style={{ background: PIN_COLORS[dp.id] + '20', color: PIN_COLORS[dp.id], border: `1.5px solid ${PIN_COLORS[dp.id]}40` }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: PIN_COLORS[dp.id] }}>{dp.name[0]}</span>
                    {dp.name.split(' ')[0]} · {dp.completedDeliveries}/{dp.todayDeliveries}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-4">
          {selected ? (
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: PIN_COLORS[selected.id] }}>
                  {selected.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-xs text-gray-400">{selected.vehicleType} · {selected.zones.join(', ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Total Stops', value: selected.todayDeliveries },
                  { label: 'Completed', value: selected.completedDeliveries },
                  { label: 'Remaining', value: selected.todayDeliveries - selected.completedDeliveries },
                  { label: 'Cash Collected', value: `₹${selected.cashCollected}` },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>

              <a href={`tel:${selected.phone}`} className="flex items-center justify-center gap-2 w-full bg-green-50 hover:bg-green-100 text-green-700 font-medium text-sm py-2.5 rounded-xl transition-colors">
                <Phone size={14} /> Call {selected.name.split(' ')[0]}
              </a>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Assigned Orders</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dpOrders(selected.id).map(order => (
                    <div key={order.id} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded-lg">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${order.status === 'delivered' ? 'bg-green-500' : order.status === 'in_transit' ? 'bg-purple-500' : order.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{order.customerName}</p>
                        <p className="text-gray-400 truncate">{order.zone} · {order.quantity} can(s)</p>
                      </div>
                      <span className="text-gray-500">₹{order.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-800 mb-4">All Riders</h3>
              <div className="space-y-3">
                {activeDP.map(dp => (
                  <button key={dp.id} onClick={() => setSelected(dp)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: PIN_COLORS[dp.id] }}>
                      {dp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{dp.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={10} /> {dp.completedDeliveries}</span>
                        <span className="flex items-center gap-1 text-xs text-yellow-600"><Clock size={10} /> {dp.todayDeliveries - dp.completedDeliveries}</span>
                      </div>
                    </div>
                    <Navigation size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Today's Summary</p>
            <div className="space-y-2">
              {[
                { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-500' },
                { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'text-green-500' },
                { label: 'In Transit', value: orders.filter(o => o.status === 'in_transit').length, icon: Navigation, color: 'text-purple-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <item.icon size={14} className={item.color} />
                    {item.label}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
