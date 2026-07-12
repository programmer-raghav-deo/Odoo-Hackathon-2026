import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Download } from 'lucide-react';
import { api } from './api';

export default function FleetView() {
  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [vehicleForm, setVehicleForm] = useState({ 
    name: '', 
    reg: '', 
    type: 'Box Van', 
    capacity: '', 
    status: 'Available' 
  });

  // Pull vehicle matrix roster upon startup lifecycle loop
  useEffect(() => {
    let isMounted = true;
    async function loadVehicles() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.fleet.getAll();
        if (isMounted) {
          setVehicles(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to retrieve transport assets from engine database.");
          setIsLoading(false);
        }
      }
    }
    loadVehicles();
    return () => { isMounted = false; };
  }, []);

  const handleFormChange = (e) => setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      if (editingId) {
        // 🛠️ Update via PUT method endpoint -> /api/fleet/<id>
        const updatedAsset = await api.fleet.update(editingId, {
          name: vehicleForm.name,
          reg: vehicleForm.reg,
          type: vehicleForm.type,
          capacity: Number(vehicleForm.capacity),
          status: vehicleForm.status
        });
        
        setVehicles(vehicles.map(v => v.id === editingId ? updatedAsset : v));
        setEditingId(null);
      } else {
        // ➕ Append brand new configuration to payload -> /api/fleet
        const newAsset = await api.fleet.create({
          name: vehicleForm.name,
          reg: vehicleForm.reg,
          type: vehicleForm.type,
          capacity: Number(vehicleForm.capacity),
          status: vehicleForm.status
        });
        
        setVehicles([...vehicles, newAsset]);
      }
      
      // Reset Workspace
      setVehicleForm({ name: '', reg: '', type: 'Box Van', capacity: '', status: 'Available' });
    } catch (err) {
      setError(err.message || "Could not push update changes to remote server.");
    } finally {
      setActionLoading(false);
    }
  };

  const editVehicle = (vehicle) => {
    setEditingId(vehicle.id);
    setVehicleForm({ 
      name: vehicle.name, 
      reg: vehicle.reg, 
      type: vehicle.type, 
      capacity: vehicle.capacity, 
      status: vehicle.status 
    });
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Retire this transport asset from the registry permanently?")) return;
    
    setActionLoading(true);
    try {
      // ❌ Execute deletion synchronization hook -> /api/fleet/<id>
      await api.fleet.delete(id);
      setVehicles(vehicles.filter(v => v.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setVehicleForm({ name: '', reg: '', type: 'Box Van', capacity: '', status: 'Available' });
      }
    } catch (err) {
      setError(err.message || "Failed to decommission specified asset safely.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-700 border-gray-200';
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'on trip': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in shop': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing active fleet inventories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fleet Registry</h2>
          <p className="text-sm text-gray-500 mt-1">Manage transport assets, monitor payload capacities, and enforce maintenance schedules.</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs font-semibold animate-shake">
            ⚠️ Alert: {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ADD/EDIT FORM WORKSPACE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit sticky top-6">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              {editingId ? <Edit className="w-4 h-4 text-teal-600" /> : <Plus className="w-4 h-4 text-teal-600" />}
              {editingId ? 'Edit Asset Profile' : 'Register New Asset'}
            </h3>
            {editingId && (
              <button 
                type="button"
                onClick={() => { setEditingId(null); setVehicleForm({ name: '', reg: '', type: 'Box Van', capacity: '', status: 'Available' }); }} 
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Vehicle Description</label>
              <input type="text" name="name" required value={vehicleForm.name} onChange={handleFormChange} placeholder="e.g., Volvo FH16" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Registration No.</label>
              <input type="text" name="reg" required value={vehicleForm.reg} onChange={handleFormChange} placeholder="e.g., TX-9921" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm font-mono uppercase" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Asset Type</label>
                <select name="type" value={vehicleForm.type} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-white font-medium cursor-pointer">
                  <option value="Box Van">Box Van</option>
                  <option value="Heavy Hauler">Heavy Hauler</option>
                  <option value="Flatbed">Flatbed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Payload (Kg)</label>
                <input type="number" name="capacity" required value={vehicleForm.capacity} onChange={handleFormChange} placeholder="25000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Operational Status</label>
              <select name="status" value={vehicleForm.status} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-white font-medium cursor-pointer">
                <option value="Available">Available</option>
                <option value="In Shop">In Shop</option>
                <option value="On Trip">On Trip</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={actionLoading}
              className="w-full bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-teal-800 transition shadow-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> 
              {actionLoading ? 'Saving...' : editingId ? 'Update Asset Info' : 'Confirm Asset Registration'}
            </button>
          </form>
        </div>

        {/* ASSET ROSTER TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Active Asset Roster</h3>
            <button type="button" className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50"><Download className="w-4 h-4" /> Export</button>
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
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      No heavy assets found registered on this channel.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-teal-900">{v.vehicle_code || v.id}</div>
                        <div className="text-xs font-mono font-semibold text-gray-500 uppercase">{v.reg || v.registration_number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{v.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{v.type}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-600">
                        {v.capacity ? (Number(v.capacity) / 1000).toFixed(1) : '0.0'} Tons
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            type="button"
                            disabled={actionLoading}
                            onClick={() => editVehicle(v)} 
                            className="p-1.5 text-gray-400 hover:text-teal-600 bg-gray-50 rounded transition-colors disabled:opacity-40"
                            title="Edit configurations"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            disabled={actionLoading}
                            onClick={() => deleteVehicle(v.id)} 
                            className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded transition-colors disabled:opacity-40"
                            title="Retire asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}