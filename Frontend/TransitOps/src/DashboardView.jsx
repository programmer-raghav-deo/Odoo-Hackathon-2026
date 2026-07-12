import React, { useState } from 'react';

export default function DashboardView() {
  const [dashboardMetrics] = useState({
    activeVehicles: 53, availableVehicles: 42, inMaintenance: 5,
    activeTrips: 18, pendingTrips: 9, driversOnDuty: 26, utilization: 81
  });

  const [recentTrips] = useState([
    { id: 'TR001', vehicle: 'VAN-05', driver: 'Alex', status: 'On Trip', eta: '45 min' },
    { id: 'TR002', vehicle: 'TRK-12', driver: 'John', status: 'Completed', eta: '-' },
    { id: 'TR003', vehicle: 'MINI-08', driver: 'Priya', status: 'Dispatched', eta: '1h 10m' },
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'on trip': case 'dispatched': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in shop': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
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
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trip.status)}`}>{trip.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{trip.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
  );
}