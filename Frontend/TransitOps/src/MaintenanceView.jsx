import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Calendar,
  SlidersHorizontal,
  Download,
  Plus
} from 'lucide-react';

export default function MaintenanceView() {
  // Simulated relational data pool
  const [logs, setLogs] = useState([
    { id: 'MNT-001', vehicleId: 'V-102', vehicleName: 'VAN-05', type: 'Oil Change & Filters', technician: 'S. Miller', cost: 125.00, status: 'In Shop', date: 'Jul 12, 2026' },
    { id: 'MNT-002', vehicleId: 'V-103', vehicleName: 'TRUCK-11', type: 'Transmission Overhaul', technician: 'M. Ross', cost: 2450.00, status: 'In Shop', date: 'Jul 10, 2026' },
    { id: 'MNT-003', vehicleId: 'V-101', vehicleName: 'MINI-03', type: 'Brake Pads & Rotors', technician: 'J. Doe', cost: 1200.00, status: 'Completed', date: 'Jul 07, 2026' }
  ]);

  // Form Field Registry State
  const [form, setForm] = useState({
    vehicleId: 'V-102',
    vehicleName: 'VAN-05',
    type: 'Oil Change & Filters',
    technician: '',
    cost: '',
    status: 'In Shop'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'vehicleId') {
      const labelMap = { 'V-102': 'VAN-05', 'V-103': 'TRUCK-11', 'V-101': 'MINI-03' };
      setForm(prev => ({ ...prev, vehicleId: value, vehicleName: labelMap[value] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: `MNT-${Math.floor(100 + Math.random() * 900)}`,
      vehicleId: form.vehicleId,
      vehicleName: form.vehicleName,
      type: form.type,
      technician: form.technician || 'Unassigned',
      cost: parseFloat(form.cost) || 0,
      status: form.status,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setLogs([newLog, ...logs]);
    setForm({
      vehicleId: 'V-102',
      vehicleName: 'VAN-05',
      type: 'Oil Change & Filters',
      technician: '',
      cost: '',
      status: 'In Shop'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Telemetry Indicator Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active In Shop</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">02</p>
          <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full mt-2 inline-block">Fleet Capacity Limited</span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Orders</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">05</p>
          <span className="text-[10px] text-gray-400 font-medium inline-block mt-2">Scheduled next 48h</span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Monthly Maintenance Cost</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">$3,775</p>
          <span className="text-[10px] text-emerald-600 font-semibold inline-block mt-2">Within Target Budget</span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resolved This Week</p>
          <p className="text-3xl font-extrabold text-gray-950 mt-1">14</p>
          <span className="text-[10px] text-blue-600 font-medium inline-block mt-2">94% Turnaround rate</span>
        </div>
      </div>

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
                <option value="V-102">VAN-05 (Ford Transit)</option>
                <option value="V-103">TRUCK-11 (Volvo Heavy)</option>
                <option value="V-101">MINI-03 (Scania Box)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Service Classification</label>
              <select 
                name="type" 
                value={form.type} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 outline-none"
              >
                <option value="Oil Change & Filters">Oil Change & Filters</option>
                <option value="Transmission Overhaul">Transmission Overhaul</option>
                <option value="Brake Pads & Rotors">Brake Pads & Rotors</option>
                <option value="New Tires Full Set">New Tires Full Set</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Expenses ($)</label>
                <input 
                  type="number" name="cost" required placeholder="Ex: 450" 
                  value={form.cost} onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Current Status</label>
                <select 
                  name="status" value={form.status} onChange={handleInputChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-semibold focus:ring-2 focus:ring-teal-600 outline-none"
                >
                  <option value="In Shop">In Shop</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Assigned Mechanic / Tech</label>
              <input 
                type="text" name="technician" placeholder="Name of mechanic" 
                value={form.technician} onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-xs text-amber-800 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>System Lockout Rules:</strong> Setting status to <strong>"In Shop"</strong> flags this asset as unavailable for dispatch assignments instantly.
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
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Service Particulars</th>
                  <th className="px-6 py-4">Technician</th>
                  <th className="px-6 py-4">Cost</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition font-medium text-gray-700">
                    <td className="px-6 py-4 font-bold text-gray-900">{log.vehicleName}</td>
                    <td className="px-6 py-4">{log.type}</td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-1.5 whitespace-nowrap"><User className="w-3.5 h-3.5 text-gray-400" /> {log.technician}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${log.cost.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
                        log.status === 'In Shop' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.status === 'In Shop' ? <Clock className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                        {log.status}
                      </span>
                    </td>
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