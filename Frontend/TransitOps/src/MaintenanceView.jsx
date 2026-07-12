import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Calendar,
  SlidersHorizontal,
  Download,
  Plus
} from 'lucide-react';

export default function MaintenanceView() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Field Registry State aligned with POST /api/maintenance/log data contract
  const [form, setForm] = useState({
    vehicleId: '',
    serviceType: 'Oil Change',
    cost: '',
    date: new Date().toISOString().split('T')[0] // Auto defaults to today's date YYYY-MM-DD
  });

  // Load telemetry metrics and registries from backend
  useEffect(() => {
    async function loadMaintenanceModule() {
      try {
        setIsLoading(true);
        const [logsRes, vehiclesRes] = await Promise.all([
          fetch('/api/maintenance/logs'),
          fetch('/api/vehicles')
        ]);

        const logsData = await logsRes.json();
        const vehiclesData = await vehiclesRes.json();

        setLogs(logsData || []);
        setVehicles(vehiclesData || []);
        
        if (vehiclesData.length > 0) {
          setForm(prev => ({ ...prev, vehicleId: vehiclesData[0].id.toString() }));
        }
      } catch (err) {
        console.error("Error connecting to maintenance backend:", err);
        setErrorMessage("Failed to pull active mechanical journals.");
      } finally {
        setIsLoading(false);
      }
    }
    loadMaintenanceModule();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('/api/maintenance/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: Number(form.vehicleId),
          service_type: form.serviceType,
          cost: parseFloat(form.cost),
          date: form.date
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Could not log record.');
      }

      // Re-fetch current asset list and journals to mirror updated 'In Shop' tags
      const [logsRes, vehiclesRes] = await Promise.all([
        fetch('/api/maintenance/logs'),
        fetch('/api/vehicles')
      ]);

      setLogs(await logsRes.json());
      setVehicles(await vehiclesRes.json());

      // Reset form variables safely
      setForm(prev => ({
        ...prev,
        cost: '',
        date: new Date().toISOString().split('T')[0]
      }));
      alert('Service record entered successfully. Vehicle flagged as "In Shop".');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (isLoading) return <div className="p-6 text-center text-gray-500 font-medium">Connecting to Registry Logs...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span><strong>Backend Error Exception:</strong> {errorMessage}</span>
        </div>
      )}

      {/* Structured Split Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: SERVICE BOOKING PANEL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit sticky top-0">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-teal-700" /> Log Service Record
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Select Asset</label>
              <select 
                name="vehicleId" 
                value={form.vehicleId} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 outline-none"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.model} [{v.reg_number}] — {v.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Service Classification</label>
              <select 
                name="serviceType" 
                value={form.serviceType} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 outline-none"
              >
                <option value="Oil Change">Oil Change</option>
                <option value="Tire Rotation">Tire Rotation</option>
                <option value="Brake Repair">Brake Repair</option>
                <option value="Engine Tuning">Engine Tuning</option>
                <option value="Transmission Overhaul">Transmission Overhaul</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Expenses ($)</label>
                <input 
                  type="number" name="cost" required placeholder="Ex: 2500" 
                  value={form.cost} onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Service Date</label>
                <input 
                  type="date" name="date" required
                  value={form.date} onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-semibold focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-xs text-amber-800 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>System Lockout Rules:</strong> Dispatch parameters lock out any assets currently labeled <strong>"In Shop"</strong> until status is updated.
              </p>
            </div>

            <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Save Record
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: REPAIR JOURNAL TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Maintenance Journal</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 shadow-sm"><SlidersHorizontal className="w-3.5 h-3.5" /> Filter</button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 shadow-sm"><Download className="w-3.5 h-3.5" /> Export Logs</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Vehicle ID</th>
                  <th className="px-6 py-4">Service Particulars</th>
                  <th className="px-6 py-4">Cost</th>
                  <th className="px-6 py-4">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {logs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-gray-50/50 transition font-medium text-gray-700">
                    <td className="px-6 py-4 font-bold text-gray-900">Asset Ref: #{log.vehicle_id}</td>
                    <td className="px-6 py-4">{log.service_type || log.type}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${parseFloat(log.cost).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {log.date}</span>
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