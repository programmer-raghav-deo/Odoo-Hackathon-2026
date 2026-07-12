import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Milestone, 
  DollarSign, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Truck,
  Calendar
} from 'lucide-react';

export default function AnalyticsView() {
  const [timeframe, setTimeframe] = useState('30_days');
  const [loading, setLoading] = useState(false); // Set to true later when fetching from API

  // ==========================================
  // 🔌 BACKEND INTEGRATION CONTRACTS
  // These objects mimic the exact payloads your friend's API endpoints will send.
  // ==========================================
  
  // Target Endpoint: GET /api/analytics/kpis
  const [kpis, setKpis] = useState({
    fleetUtilization: "84.2%",
    totalDistance: 148290,
    avgCostPerKm: 0.42,
    safetyRating: "96.4/100"
  });

  // Target Endpoint: GET /api/analytics/cost-breakdown
  const [costs, setCosts] = useState({
    fuel: 8420.50,
    maintenance: 4750.00,
    incidentals: 1840.25,
    total: 15010.75
  });

  // Target Endpoint: GET /api/analytics/efficiency-leaderboard
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, vehicle: 'VAN-05', class: 'Light Commercial', efficiency: '12.4 km/L', status: 'Optimal' },
    { rank: 2, vehicle: 'MINI-03', class: 'Box Courier', efficiency: '10.1 km/L', status: 'Optimal' },
    { rank: 3, vehicle: 'TRUCK-04', class: 'Heavy Hauler', efficiency: '7.8 km/L', status: 'Normal' },
    { rank: 4, vehicle: 'TRUCK-11', class: 'Heavy Hauler', efficiency: '5.2 km/L', status: 'Sub-Par' },
  ]);

  // ==========================================
  // ⚡ FUTURE CONNECTIVITY HOOK
  // When your partner finishes the backend, just uncomment the block below!
  // ==========================================
  /*
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/analytics/kpis?timeframe=${timeframe}`).then(res => res.json()),
      fetch(`/api/analytics/cost-breakdown?timeframe=${timeframe}`).then(res => res.json()),
      fetch(`/api/analytics/efficiency-leaderboard?timeframe=${timeframe}`).then(res => res.json())
    ])
    .then(([kpiData, costData, leaderboardData]) => {
      setKpis(kpiData);
      setCosts(costData);
      setLeaderboard(leaderboardData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error connecting to live fleet engine:", err);
      setLoading(false);
    });
  }, [timeframe]);
  */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-gray-500 animate-pulse uppercase tracking-widest">
          Syncing Live Fleet Analytics...
        </div>
      </div>
    );
  }

  // Percentage logic calculations for the distribution bars
  const fuelPercentage = ((costs.fuel / costs.total) * 100).toFixed(0);
  const maintenancePercentage = ((costs.maintenance / costs.total) * 100).toFixed(0);
  const incidentalPercentage = ((costs.incidentals / costs.total) * 100).toFixed(0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Analytics Action Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
            <BarChart3 className="w-5 h-5 text-teal-700" /> Operational Insights Engine
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Calculations derived from live fleet log parameters.</p>
        </div>
        
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="relative flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            {['7_days', '30_days', '12_months'].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition uppercase ${
                  timeframe === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center gap-1.5 bg-gray-900 text-white font-semibold text-xs px-3 py-2.5 rounded-lg hover:bg-gray-800 shadow-sm transition">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Analytics KPI Dashboard Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fleet Utilization</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">{kpis.fleetUtilization}</p>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" /> <span>+4.1% vs last period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Managed Distance</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">
            {kpis.totalDistance.toLocaleString()} <span className="text-sm font-semibold text-gray-400">km</span>
          </p>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" /> <span>+12,400 km spike</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operational Cost / km</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">${kpis.avgCostPerKm}</p>
          <div className="flex items-center gap-1 text-red-600 font-semibold text-xs mt-3">
            <ArrowDownRight className="w-3.5 h-3.5" /> <span>-2.4% cost drop</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fleet Safety Score</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">{kpis.safetyRating}</p>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" /> <span>Optimal Bracket</span>
          </div>
        </div>
      </div>

      {/* Double Column Split Metrics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL A: COST BREAKDOWN DEPLOYMENT VIEW */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-teal-700" /> Operational Expense Allocation
            </h3>
            <p className="text-xs text-gray-500">Resource usage distribution across active asset channels.</p>
          </div>

          <div className="my-8 space-y-5">
            {/* Fuel Usage */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-700">Fuel Infrastructure Purchases</span>
                <span className="text-gray-900">${costs.fuel.toLocaleString(undefined, {minimumFractionDigits: 2})} ({fuelPercentage}%)</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="bg-teal-700 h-full rounded-full transition-all duration-500" style={{ width: `${fuelPercentage}%` }}></div>
              </div>
            </div>

            {/* Maintenance System Costs */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-700">Preventative Maintenance & Labor</span>
                <span className="text-gray-900">${costs.maintenance.toLocaleString(undefined, {minimumFractionDigits: 2})} ({maintenancePercentage}%)</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full transition-all duration-500" style={{ width: `${maintenancePercentage}%` }}></div>
              </div>
            </div>

            {/* Incidentals / Tolls */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-700">Tolls, Road Permits & Incidentals</span>
                <span className="text-gray-900">${costs.incidentals.toLocaleString(undefined, {minimumFractionDigits: 2})} ({incidentalPercentage}%)</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${incidentalPercentage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-600 leading-normal font-medium">
            <strong>Aggregate Fleet Capital Outlay:</strong> Combined running cost equals <strong>${costs.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>.
          </div>
        </div>

        {/* PANEL B: PERFORMANCE RUNWAY PROFILE LEADERBOARD */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50/40">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Fuel Economy Profile Performance
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Top performing active logistics vehicles via distance efficiency math.</p>
          </div>

          <div className="overflow-x-auto grow">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-center w-12">Rank</th>
                  <th className="px-6 py-3.5">Asset Ref</th>
                  <th className="px-6 py-3.5">Category Class</th>
                  <th className="px-6 py-3.5 text-right">Economy Target</th>
                  <th className="px-6 py-3.5 text-center">Efficiency Bracket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {leaderboard.map((item) => (
                  <tr key={item.vehicle} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-3.5 text-center font-bold text-gray-900">0{item.rank}</td>
                    <td className="px-6 py-3.5 flex items-center gap-2 font-bold text-gray-900 h-full py-4">
                      <Truck className="w-3.5 h-3.5 text-gray-400" /> {item.vehicle}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500">{item.class}</td>
                    <td className="px-6 py-3.5 text-right font-mono text-xs text-gray-900 font-bold">{item.efficiency}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase ${
                        item.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Normal' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}