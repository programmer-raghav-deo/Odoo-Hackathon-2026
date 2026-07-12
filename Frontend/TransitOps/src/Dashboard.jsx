import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Map, 
  Wrench, 
  Fuel, 
  PieChart, 
  Settings,
  Search, 
  Bell 
} from 'lucide-react';
import { api } from './api';
import DashboardView from './DashboardView';
import FleetView from './FleetView';
import DriversView from './DriversView';
import TripsView from './TripsView'; 
import MaintenanceView from './MaintenanceView';
import FuelExpensesView from './FuelExpensesView';
import AnalyticsView from './AnalyticsView';
import SettingsView from './SettingsView';

export default function Dashboard({ role, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      // Calls app.route('/api/auth/logout') to invalidate cookies over credentials
      await api.auth.logout();
    } catch (err) {
      console.error("Backend session teardown failed:", err.message);
    } finally {
      setIsLoggingOut(false);
      onLogout(); // Redirect back to login frame cleanly
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <Truck className="w-6 h-6 text-teal-700" />
          <span className="font-bold text-xl tracking-tight text-gray-900">TransitOps</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'fleet', icon: Truck, label: 'Fleet' },
            { id: 'drivers', icon: Users, label: 'Drivers' },
            { id: 'trips', icon: Map, label: 'Trips' },
            { id: 'maintenance', icon: Wrench, label: 'Maintenance' },
            { id: 'fuel', icon: Fuel, label: 'Fuel & Expenses' },
            { id: 'analytics', icon: PieChart, label: 'Analytics' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-teal-700' : 'text-gray-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assets, IDs, or personnel..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-gray-50 focus:bg-white transition"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Operator</p>
                <p className="text-xs text-gray-500">{role || 'Dispatcher'}</p>
              </div>
              <button 
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogoutClick}
                className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:bg-teal-800 transition active:scale-95 disabled:opacity-50"
                title="Click to sign out safely"
              >
                {isLoggingOut ? '...' : 'OP'}
              </button>
            </div>
          </div>
        </header>

        {/* SCROLLABLE VIEW PORT */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'fleet' && <FleetView />}
          {activeTab === 'drivers' && <DriversView />}
          {activeTab === 'trips' && <TripsView />}
          {activeTab === 'maintenance' && <MaintenanceView />}
          {activeTab === 'fuel' && <FuelExpensesView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}