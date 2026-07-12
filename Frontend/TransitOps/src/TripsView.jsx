import React, { useState } from 'react';
import { 
  MapPin, 
  Play, 
  Save, 
  AlertCircle, 
  Map as MapIcon, 
  Activity, 
  Users, 
  Clock, 
  ShieldAlert
} from 'lucide-react';

export default function TripsView() {
  // Simulated Database Collections / Endpoints
  const [vehicles] = useState([
    { id: 'V-101', name: 'VOLVO FH16 - TR-9842', capacity: 10000, status: 'Available' },
    { id: 'V-102', name: 'Ford Transit - VAN-05', capacity: 500, status: 'Available' },
    { id: 'V-103', name: 'Scania R500 - TRUCK-04', capacity: 25000, status: 'Available' }
  ]);

  const [drivers] = useState([
    { id: 'D-101', name: 'Marcus Thorne (License: Class A)', status: 'Available' },
    { id: 'D-102', name: 'Alex (License: LMV)', status: 'Available' },
    { id: 'D-103', name: 'Suresh (License: HMV)', status: 'Available' }
  ]);

  const [liveTrips] = useState([
    { 
      id: 'TR001', 
      source: 'Gandhinagar Depot', 
      dest: 'Ahmedabad Hub', 
      vehicle: 'VAN-05', 
      driver: 'Alex', 
      status: 'Dispatched', 
      meta: '45 min ETA',
      progress: 60
    },
    { 
      id: 'TR004', 
      source: 'Vatva Industrial Area', 
      dest: 'Sanand Warehouse', 
      vehicle: 'TRUCK-04', 
      driver: 'Suresh', 
      status: 'Draft', 
      meta: 'Awaiting driver',
      progress: 0
    },
    { 
      id: 'TR006', 
      source: 'Mansa', 
      dest: 'Kalol Depot', 
      vehicle: 'Unassigned', 
      driver: 'Unassigned', 
      status: 'Cancelled', 
      meta: 'Vehicle went to shop',
      progress: 0
    }
  ]);

  // Form State
  const [tripForm, setTripForm] = useState({
    source: '',
    destination: '',
    vehicleId: 'V-101',
    driverId: 'D-101',
    cargoWeight: '',
    plannedDistance: ''
  });

  const handleInputChange = (e) => {
    setTripForm({ ...tripForm, [e.target.name]: e.target.value });
  };

  // Validation Logic
  const selectedVehicle = vehicles.find(v => v.id === tripForm.vehicleId);
  const weight = Number(tripForm.cargoWeight);
  const isOverweight = selectedVehicle && weight > selectedVehicle.capacity;
  const excessWeight = isOverweight ? weight - selectedVehicle.capacity : 0;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Dispatched': return 'bg-blue-500 text-white';
      case 'Draft': return 'bg-gray-400 text-white';
      case 'Cancelled': return 'bg-red-500 text-white';
      case 'Completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trip Dispatcher</h2>
          <p className="text-sm text-gray-500 mt-1">Assign, track, and manage fleet routes in real-time.</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div> Draft</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Dispatched</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Completed</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Cancelled</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CREATE NEW TRIP FORM */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-0">
          <h3 className="text-sm font-bold flex items-center gap-2 text-gray-800 mb-6 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-teal-600" /> Create New Trip
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Source</label>
                <input type="text" name="source" placeholder="e.g. San Francisco Hub" value={tripForm.source} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Destination</label>
                <input type="text" name="destination" placeholder="Enter arrival city" value={tripForm.destination} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-gray-50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Vehicle (Available Only)</label>
              <select name="vehicleId" value={tripForm.vehicleId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-white">
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} - {v.capacity}kg capacity</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Driver (Available Only)</label>
              <select name="driverId" value={tripForm.driverId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-white">
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Cargo Weight (kg)</label>
                <input type="number" name="cargoWeight" placeholder="e.g. 12000" value={tripForm.cargoWeight} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none text-sm ${isOverweight ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-teal-600 bg-gray-50'}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Planned Distance (km)</label>
                <input type="number" name="plannedDistance" placeholder="e.g. 450" value={tripForm.plannedDistance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-gray-50" />
              </div>
            </div>

            {/* Error Validation Block */}
            {isOverweight && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 space-y-1">
                <p><strong>Vehicle Capacity:</strong> {selectedVehicle?.capacity} kg</p>
                <p><strong>Cargo Weight:</strong> {weight} kg</p>
                <div className="flex items-center gap-1.5 mt-2 text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4" /> Capacity exceeded by {excessWeight} kg &rarr; Dispatch blocked
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button disabled={isOverweight || !tripForm.cargoWeight} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium shadow-sm transition ${isOverweight || !tripForm.cargoWeight ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-teal-700 text-white hover:bg-teal-800'}`}>
                <Play className="w-4 h-4 fill-current" /> {isOverweight ? 'Dispatch Disabled' : 'Dispatch Trip'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
                <Save className="w-4 h-4" /> Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE BOARD */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2 text-gray-800 tracking-wider">
                <Activity className="w-5 h-5 text-green-500" /> LIVE BOARD <span className="bg-green-100 text-green-700 text-[10px] uppercase px-2 py-0.5 rounded-full">Active</span>
              </h3>
              <button className="text-sm font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1">
                View Map <MapIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveTrips.map((trip) => (
                <div key={trip.id} className="border border-gray-200 rounded-xl p-4 hover:border-teal-200 hover:shadow-md transition bg-gray-50/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-mono text-sm font-bold text-gray-800">{trip.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm ${getStatusStyle(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                        <div className="w-0.5 h-6 bg-gray-200"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                      <div className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                        <p>{trip.source}</p>
                        <p>{trip.dest}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-xs">
                    <div className="text-gray-500 font-medium">
                      <span className="block text-gray-900 font-semibold">{trip.vehicle}</span>
                      {trip.driver}
                    </div>
                    <div className="text-right font-medium text-gray-500">
                      {trip.meta}
                    </div>
                  </div>
                  
                  {trip.progress > 0 && (
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${trip.progress}%` }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM ROW: KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Fleet Health</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">98.2%</p>
              </div>
              <Activity className="w-8 h-8 text-green-100" />
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">142</p>
              </div>
              <Users className="w-8 h-8 text-blue-100" />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-amber-500 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Avg Delivery Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">4.2h</p>
              </div>
              <Clock className="w-8 h-8 text-amber-100" />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-red-500 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Safety Alerts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">03</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-red-100" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}