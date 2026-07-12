import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Zap, 
  ArrowUpRight, 
  Download,
  Truck
} from 'lucide-react';

export default function AnalyticsView() {
  const [timeframe, setTimeframe] = useState('30_days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapped directly to API parameters from section 8
  const [summaryData, setSummaryData] = useState({
    fuel_efficiency: "0.0 km/L",
    fleet_utilization_pct: 0,
    total_operational_cost: 0
  });

  const [roiMetrics, setRoiMetrics] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Execute simultaneous live dashboard data requests
        const [summaryRes, roiRes] = await Promise.all([
          fetch(`/api/analytics/summary?timeframe=${timeframe}`),
          fetch(`/api/analytics/roi?timeframe=${timeframe}`)
        ]);

        if (!summaryRes.ok || !roiRes.ok) {
          throw new Error("Unable to fetch complete analytics payloads");
        }

        const summaryDataJSON = await summaryRes.json();
        const roiDataJSON = await roiRes.json();

        setSummaryData(summaryDataJSON);
        setRoiMetrics(roiDataJSON);
        setError(null);
      } catch (err) {
        console.error("Analytics integration failed:", err);
        setError("Error connecting to live fleet reporting services.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-gray-500 animate-pulse uppercase tracking-widest">
          Syncing Live Fleet Analytics Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      
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
          <a 
            href="/api/analytics/export" 
            className="flex items-center justify-center gap-1.5 bg-gray-900 text-white font-semibold text-xs px-3 py-2.5 rounded-lg hover:bg-gray-800 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV Data
          </a>
        </div>
      </div>

      {/* Analytics KPI Dashboard Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fleet Utilization</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">{summaryData.fleet_utilization_pct}%</p>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" /> <span>Live Dynamic Activity Bracket</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fuel Infrastructure Efficiency</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">{summaryData.fuel_efficiency}</p>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" /> <span>Aggregate Average Fleet Flow</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Operational Cost</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">${summaryData.total_operational_cost?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          <div className="flex items-center gap-1 text-teal-600 font-semibold text-xs mt-3">
            <span>Aggregated Run Cost Parameters</span>
          </div>
        </div>
      </div>

      {/* Double Column Split Metrics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL A: ROI METRICS DISTRIBUTION GRAPH LAYOUT */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-teal-700" /> Vehicle Yield Return Profiles
            </h3>
            <p className="text-xs text-gray-500">Calculated running asset optimization indexes.</p>
          </div>

          <div className="my-8 space-y-5">
            {roiMetrics.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No vehicle allocation return parameters logged for this timeframe.</p>
            ) : (
              roiMetrics.slice(0, 3).map((item, index) => (
                <div key={item.vehicle_id || index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-700">Asset Ident #{item.vehicle_id || "Unspecified"}</span>
                    <span className="text-gray-900">{item.roi_pct}% Return Value</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-700 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(item.roi_pct, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL B: LEADERBOARD VISUAL DATA TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50/40">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Return Allocation Register
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Calculated asset profitability metrics metrics.</p>
          </div>

          <div className="overflow-x-auto grow">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">Asset Reference</th>
                  <th className="px-6 py-3.5 text-right">Target Yield Metric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {roiMetrics.map((item, index) => (
                  <tr key={item.vehicle_id || index} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-3.5 flex items-center gap-2 font-bold text-gray-900">
                      <Truck className="w-3.5 h-3.5 text-gray-400" /> Asset ID: #{item.vehicle_id}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-xs text-gray-900 font-bold">{item.roi_pct}%</td>
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