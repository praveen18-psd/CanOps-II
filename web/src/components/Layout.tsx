import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Menu, Search } from 'lucide-react';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setCollapsed(c => !c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden">
            <Menu size={20} />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Search orders, customers..." />
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">RK</span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Rajan Kumar</span>
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
