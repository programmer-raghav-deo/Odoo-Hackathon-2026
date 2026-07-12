import React, { useState, useEffect } from 'react';
import { api } from './api';

export default function DashboardView() {
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data Fetching lifecycle matching Flask backend query endpoints
  useEffect(() => {
    let isMounted = true;
    
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Parallel queries to api.dashboard.getKpis and api.dashboard.getRecentTrips
        const [kpiData, tripData] = await Promise.all([
          api.dashboard.getKpis(),
          api.dashboard.getRecentTrips()
        ]);
        
        if (isMounted) {
          setDashboardMetrics(kpiData);
          setRecentTrips(tripData);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to establish synchronization with the data ledger.");
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'on trip': case 'dispatched': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in shop': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // 1. Loading State Graphics
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
          Synchronizing Live Database Registers...
        </p>
      </div>
    );
  }

  // 2. Error Fallback State Graphic
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto my-12 shadow-sm">
        <p className="text-sm font-bold text-red-800 uppercase mb-2">Operational Data Sync Error</p>
        <p className="text-xs text-red-600 font-medium leading-relaxed">{error}</p>
        <p className="text-[10px] text-gray-400 font-semibold mt-4 uppercase">
          Verify Flask Engine is running at port 5000 and DB connectivity is active.
        </p>
      </div>
    );
  }

  // Fallback defaults if payload items match structure keys cleanly
  const metrics = dashboardMetrics || {
    active_vehicles: 0, available_vehicles: 0, vehicles_in_maintenance: 0,
    active_trips: 0, pending_trips: 0, drivers_on_duty: 0, fleet_utilization_pct: 0
  };

  // Safe maximum constraints to handle distribution bar widths safely
  const totalBarCount = (metrics.available_vehicles + metrics.active_vehicles + metrics.vehicles_in_maintenance) || 1;
  const availablePct = `${Math.min(100, Math.round((metrics.available_vehicles / totalBarCount) * 100))}%`;
  const onTripPct = `${Math.min(100, Math.round((metrics.active_vehicles / totalBarCount) * 100))}%`;
  const inShopPct = `${Math.min(100, Math.round((metrics.vehicles_in_maintenance / totalBarCount) * 100))}%`;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Filters Form Blocks */}
      <div className="flex gap-4 mb-6">
        {['Vehicle Type: All', 'Status: All', 'Region: All'].map((filter, i) => (
          <select key={i} className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 bg-white shadow-sm outline-none cursor-pointer hover:bg-gray-50">
            <option>{filter}</option>
          </select>
        ))}
      </div>

      {/* KPI Cards Row (Mapped to backend object serialization formatting keys) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Active Vehicles', value: metrics.active_vehicles, color: 'border-blue-500' },
          { label: 'Available Vehicles', value: metrics.available_vehicles, color: 'border-emerald-500' },
          { label: 'Vehicles In Maintenance', value: metrics.vehicles_in_maintenance, color: 'border-amber-500' },
          { label: 'Active Trips', value: metrics.active_trips, color: 'border-blue-500' },
          { label: 'Pending Trips', value: metrics.pending_trips, color: 'border-gray-400' },
          { label: 'Drivers On Duty', value: metrics.drivers_on_duty, color: 'border-blue-500' },
          { label: 'Fleet Utilization', value: `${metrics.fleet_utilization_pct}%`, color: 'border-emerald-500' },
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${kpi.color} border-y border-r border-gray-200`}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Bottom Layout: Data Table & Dynamic Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Recent Active Logs</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Trip ID</th>
                    <th className="px-6 py-4 font-semibold">Vehicle Asset</th>
                    <th className="px-6 py-4 font-semibold">Assigned Driver</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">ETA / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {recentTrips.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-xs text-gray-400 font-bold uppercase tracking-wider">
                        No recent operations logs located in database.
                      </td>
                    </tr>
                  ) : (
                    recentTrips.map((trip, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-teal-800">{trip.trip_code}</td>
                        <td className="px-6 py-4 font-medium text-gray-700">{trip.vehicle}</td>
                        <td className="px-6 py-4 text-gray-600">{trip.driver}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trip.status)}`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs font-medium">{trip.eta_or_notes}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Proportions Box computed from database inputs */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Asset Status Distribution</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {[
              { label: 'Available Vehicles Pool', color: 'bg-emerald-500', width: availablePct, value: metrics.available_vehicles },
              { label: 'On Route / Active', color: 'bg-blue-500', width: onTripPct, value: metrics.active_vehicles },
              { label: 'In Shop (Maintenance)', color: 'bg-amber-500', width: inShopPct, value: metrics.vehicles_in_maintenance },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                  <span>{stat.label}</span>
                  <span className="text-gray-900 font-extrabold">{stat.value} units</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`${stat.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: stat.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}