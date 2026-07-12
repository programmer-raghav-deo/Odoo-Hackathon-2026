import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Download } from 'lucide-react';

export default function FleetView() {
  const [vehicles, setVehicles] = useState([
    { id: 'V-101', name: 'Volvo FH16', reg: 'TX-9921', type: 'Heavy Hauler', capacity: 25000, status: 'Available' },
    { id: 'V-102', name: 'Ford Transit', reg: 'NY-3341', type: 'Box Van', capacity: 2000, status: 'On Trip' },
    { id: 'V-103', name: 'Scania R500', reg: 'CA-7712', type: 'Flatbed', capacity: 30000, status: 'In Shop' },
  ]);
  
  const [editingId, setEditingId] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({ name: '', reg: '', type: 'Box Van', capacity: '', status: 'Available' });

  const handleFormChange = (e) => setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setVehicles(vehicles.map(v => v.id === editingId ? { ...v, ...vehicleForm } : v));
      setEditingId(null);
    } else {
      setVehicles([...vehicles, { id: `V-${Math.floor(Math.random() * 900) + 100}`, ...vehicleForm }]);
    }
    setVehicleForm({ name: '', reg: '', type: 'Box Van', capacity: '', status: 'Available' });
  };

  const editVehicle = (vehicle) => {
    setEditingId(vehicle.id);
    setVehicleForm({ name: vehicle.name, reg: vehicle.reg, type: vehicle.type, capacity: vehicle.capacity, status: vehicle.status });
  };

  const deleteVehicle = (id) => {
    if (window.confirm("Retire this asset?")) setVehicles(vehicles.filter(v => v.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'on trip': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in shop': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Fleet Registry</h2>
        <p className="text-sm text-gray-500 mt-1">Manage transport assets, monitor payload capacities, and enforce maintenance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ADD/EDIT FORM */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit sticky top-0">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              {editingId ? <Edit className="w-4 h-4 text-teal-600" /> : <Plus className="w-4 h-4 text-teal-600" />}
              {editingId ? 'Edit Asset Profile' : 'Register New Asset'}
            </h3>
            {editingId && (
              <button onClick={() => { setEditingId(null); setVehicleForm({ name: '', reg: '', type: 'Box Van', capacity: '', status: 'Available' }); }} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Vehicle Description</label>
              <input type="text" name="name" required value={vehicleForm.name} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Registration No.</label>
              <input type="text" name="reg" required value={vehicleForm.reg} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Asset Type</label>
                <select name="type" value={vehicleForm.type} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-white">
                  <option value="Box Van">Box Van</option>
                  <option value="Heavy Hauler">Heavy Hauler</option>
                  <option value="Flatbed">Flatbed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Payload (Kg)</label>
                <input type="number" name="capacity" required value={vehicleForm.capacity} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Operational Status</label>
              <select name="status" value={vehicleForm.status} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-white">
                <option value="Available">Available</option>
                <option value="In Shop">In Shop</option>
                <option value="On Trip">On Trip</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-teal-800 transition shadow-sm mt-2 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {editingId ? 'Update Asset' : 'Register Asset'}
            </button>
          </form>
        </div>

        {/* ASSET TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Active Asset Roster</h3>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50"><Download className="w-4 h-4" /> Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Asset ID / Reg</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold">Max Payload</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4"><div className="font-bold text-gray-900">{v.id}</div><div className="text-xs font-mono text-gray-500">{v.reg}</div></td>
                    <td className="px-6 py-4"><div className="font-semibold text-gray-800">{v.name}</div><div className="text-xs text-gray-500">{v.type}</div></td>
                    <td className="px-6 py-4 font-medium text-gray-600">{(Number(v.capacity) / 1000).toFixed(1)} Tons</td>
                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(v.status)}`}>{v.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => editVehicle(v)} className="p-1.5 text-gray-400 hover:text-teal-600 bg-gray-50 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteVehicle(v.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
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