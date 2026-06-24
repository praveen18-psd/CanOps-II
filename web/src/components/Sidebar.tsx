import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Users, Truck, BarChart3,
  Map, Package, Wallet, Settings, LogOut, Droplets, Bell
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/delivery-persons', icon: Truck, label: 'Delivery Team' },
  { to: '/route-overview', icon: Map, label: 'Route Overview' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/wallet', icon: Wallet, label: 'Wallet & Dues' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface Props { collapsed: boolean; onToggle: () => void; }

export default function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <aside className={clsx('flex flex-col bg-gray-900 text-white transition-all duration-300 h-screen sticky top-0', collapsed ? 'w-16' : 'w-60')}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700/50">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <Droplets size={18} className="text-white" />
        </div>
        {!collapsed && <span className="font-bold text-lg tracking-tight">CanOps</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white')
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Dealer info + logout */}
      <div className="border-t border-gray-700/50 p-2">
        <div className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg', collapsed ? 'justify-center' : '')}>
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 text-xs font-bold">RK</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Rajan Kumar</p>
              <p className="text-xs text-gray-400 truncate">Rajan Pure Water</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors mt-1"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
