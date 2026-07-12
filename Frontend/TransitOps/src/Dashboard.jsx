import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Truck, Users, Map, Wrench, Droplets, 
  PieChart, Settings, Search, Plus, Bell, ChevronRight,
  Filter, Download, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function Dashboard({ role, onLogout }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'drivers'
  const [isLoading, setIsLoading] = useState(false);

  // --- DATABASE SCHEMA & MOCK DATA[cite: 1] ---
  // Matches DB Entities: Vehicles, Drivers, Trips, Maintenance, Fuel/Expenses
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeVehicles: 53, availableVehicles: 42, inMaintenance: 5,
    activeTrips: 18, pendingTrips: 9, driversOnDuty: 26, utilization: 81
  });

  const [recentTrips, setRecentTrips] = useState([
    { id: 'TR001', vehicle: 'VAN-05', driver: 'Alex', status: 'On Trip', eta: '45 min' },
    { id: 'TR002', vehicle: 'TRK-12', driver: 'John', status: 'Completed', eta: '-' },
    { id: 'TR003', vehicle: 'MINI-08', driver: 'Priya', status: 'Dispatched', eta: '1h 10m' },
    { id: 'TR004', vehicle: '-', driver: '-', status: 'Draft', eta: 'Awaiting vehicle' },
  ]);

  const [drivers, setDrivers] = useState([
    { id: 'DR-101', name: 'Mark Antony', license: 'LSC-9823-TX', category: 'HMV', expiry: '10 Dec 2026', contact: '+1-555-0101', completion: 80, score: 92, status: 'On Trip' },
    { id: 'DR-102', name: 'John Steiner', license: 'LSC-7734-NY', category: 'LRV', expiry: '01 Oct 2023', contact: '+1-555-0102', completion: 45, score: 61, status: 'Suspended' },
    { id: 'DR-103', name: 'Sarah Fowler', license: 'LSC-1122-CA', category: 'LMV', expiry: '22 Nov 2027', contact: '+1-555-0103', completion: 95, score: 98, status: 'Available' },
    { id: 'DR-104', name: 'David Kim', license: 'LSC-5543-WA', category: 'HMV', expiry: '15 Mar 2025', contact: '+1-555-0104', completion: 0, score: 85, status: 'Off Duty' },
  ]);

  // --- BACKEND INTEGRATION GUIDE ---
  useEffect(() => {
    /* 
    TODO: TO CONNECT TO BACKEND (Odoo / PostgreSQL)
    1. Replace this mock fetch with actual endpoints matching your DB entities[cite: 1].
    2. Add Authorization headers using your stored JWT token.
    
    const fetchScreenData = async () => {
      setIsLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('transitops_token')}` };
        
        if (activeTab === 'dashboard') {
          const metricsRes = await fetch('http://localhost:8000/api/dashboard/metrics', { headers });
          const tripsRes = await fetch('http://localhost:8000/api/trips/recent', { headers });
          setDashboardMetrics(await metricsRes.json());
          setRecentTrips(await tripsRes.json());
        } else if (activeTab === 'drivers') {
          const driversRes = await fetch('http://localhost:8000/api/drivers', { headers });
          setDrivers(await driversRes.json());
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScreenData();
    */
  }, [activeTab]);

  // Helper for status colors
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'on trip': case 'dispatched': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in shop': return 'bg-amber-100 text-amber-700';
      case 'suspended': case 'retired': return 'bg-red-100 text-red-700';
      case 'draft': case 'off duty': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* SIDEBAR */}
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
            { id: 'fuel', icon: Droplets, label: 'Fuel & Expenses' },
            { id: 'analytics', icon: PieChart, label: 'Analytics' },
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

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50">
            <Settings className="w-5 h-5 text-gray-400" /> Settings
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Vehicle ID, Driver Name, or Route..." 
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
                <p className="text-sm font-semibold text-gray-900">Raven K.</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                RK
              </div>
            </div>
            {activeTab === 'drivers' && (
              <button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition shadow-sm ml-4">
                <Plus className="w-4 h-4" /> Add Driver
              </button>
            )}
          </div>
        </header>

        {/* SCROLLABLE VIEW PORT */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* =========================================================
              VIEW 1: DASHBOARD (From Screen_2.jpeg wireframe)
          ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                {['Vehicle Type: All', 'Status: All', 'Region: All'].map((filter, i) => (
                  <select key={i} className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 bg-white shadow-sm outline-none">
                    <option>{filter}</option>
                  </select>
                ))}
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-7 gap-4">
                {[
                  { label: 'Active Vehicles', value: dashboardMetrics.activeVehicles, color: 'border-blue-500' },
                  { label: 'Available Vehicles', value: dashboardMetrics.availableVehicles, color: 'border-emerald-500' },
                  { label: 'Vehicles In Maintenance', value: dashboardMetrics.inMaintenance, color: 'border-amber-500' },
                  { label: 'Active Trips', value: dashboardMetrics.activeTrips, color: 'border-blue-500' },
                  { label: 'Pending Trips', value: dashboardMetrics.pendingTrips, color: 'border-gray-400' },
                  { label: 'Drivers On Duty', value: dashboardMetrics.driversOnDuty, color: 'border-blue-500' },
                  { label: 'Fleet Utilization', value: `${dashboardMetrics.utilization}%`, color: 'border-emerald-500' },
                ].map((kpi, idx) => (
                  <div key={idx} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${kpi.color} border-y border-r border-gray-200`}>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{kpi.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Bottom Layout: Table & Charts */}
              <div className="grid grid-cols-3 gap-8 mt-8">
                
                {/* Recent Trips Table */}
                <div className="col-span-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Recent Trips</h3>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Trip</th>
                          <th className="px-6 py-4 font-semibold">Vehicle</th>
                          <th className="px-6 py-4 font-semibold">Driver</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold">ETA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {recentTrips.map((trip, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{trip.id}</td>
                            <td className="px-6 py-4">{trip.vehicle}</td>
                            <td className="px-6 py-4">{trip.driver}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trip.status)}`}>
                                {trip.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{trip.eta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Vehicle Status Bars */}
                <div className="col-span-1">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Vehicle Status</h3>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    {[
                      { label: 'Available', color: 'bg-emerald-500', width: '80%' },
                      { label: 'On Trip', color: 'bg-blue-500', width: '40%' },
                      { label: 'In Shop', color: 'bg-amber-500', width: '15%' },
                      { label: 'Retired', color: 'bg-red-500', width: '5%' },
                    ].map((stat, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                          <span>{stat.label}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`${stat.color} h-2.5 rounded-full`} style={{ width: stat.width }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: DRIVERS & SAFETY (From image_598296.jpg UI)
          ========================================================= */}
          {activeTab === 'drivers' && (
            <div className="max-w-7xl mx-auto space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Drivers & Safety Profiles</h2>
                <p className="text-sm text-gray-500 mt-1">Manage personnel, track license compliance, and monitor safety performance metrics across your entire fleet.</p>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between border-t-4 border-t-blue-500">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Drivers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">142</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between border-t-4 border-t-orange-500">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">On Trip</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">58</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg"><Map className="w-6 h-6 text-orange-600" /></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between border-t-4 border-t-red-500">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Critical Alerts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between border-t-4 border-t-teal-500">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Safety Score</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">94%</p>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg"><ShieldCheck className="w-6 h-6 text-teal-600" /></div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50/50">
                  <div className="flex gap-6 text-sm font-semibold text-gray-500">
                    <button className="text-teal-700 border-b-2 border-teal-700 pb-4 -mb-4">All Drivers</button>
                    <button className="hover:text-gray-900 pb-4 -mb-4">Compliance</button>
                    <button className="hover:text-gray-900 pb-4 -mb-4">Performance</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                      <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                      <Download className="w-4 h-4" /> Export CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded" /></th>
                        <th className="px-6 py-4 font-semibold">Driver Name</th>
                        <th className="px-6 py-4 font-semibold">License No.</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Expiry Date</th>
                        <th className="px-6 py-4 font-semibold">Contact</th>
                        <th className="px-6 py-4 font-semibold">Completion %</th>
                        <th className="px-6 py-4 font-semibold">Safety Score</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {drivers.map((driver, idx) => {
                        // Enforce Business Rule: Drivers with expired licenses cannot be assigned[cite: 1]
                        const isExpired = new Date(driver.expiry) < new Date('2024-01-01'); // Mock logic for display

                        return (
                          <tr key={idx} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{driver.name}</div>
                              <div className="text-xs text-gray-400">ID: {driver.id}</div>
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-600">{driver.license}</td>
                            <td className="px-6 py-4 font-medium text-blue-600">{driver.category}</td>
                            <td className={`px-6 py-4 font-medium ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                              {driver.expiry}
                              {isExpired && <span className="block text-[10px] text-red-500 uppercase font-bold mt-0.5">Expired</span>}
                            </td>
                            <td className="px-6 py-4 text-gray-600">{driver.contact}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${driver.completion}%` }}></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{driver.completion}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-bold ${driver.score > 90 ? 'text-emerald-600' : driver.score > 75 ? 'text-amber-500' : 'text-red-500'}`}>
                                {driver.score}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${getStatusColor(driver.status)}`}>
                                {driver.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}