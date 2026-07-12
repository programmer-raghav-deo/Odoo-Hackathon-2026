import React, { useState, useEffect } from 'react';
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
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [liveTrips, setLiveTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State aligned with backend expectations
  const [tripForm, setTripForm] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    plannedDistance: ''
  });

  // Fetch data on mount
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setIsLoading(true);
        const [vehiclesRes, driversRes, tripsRes] = await Promise.all([
          fetch('/api/vehicles/dispatch-pool'),
          fetch('/api/drivers/dispatch-pool'),
          fetch('/api/trips')
        ]);

        const vehiclesData = await vehiclesRes.json();
        const driversData = await driversRes.json();
        const tripsData = await tripsRes.json();

        setVehicles(vehiclesData || []);
        setDrivers(driversData || []);
        setLiveTrips(tripsData || []);

        // Pre-select first available options if they exist
        setTripForm(prev => ({
          ...prev,
          vehicleId: vehiclesData[0]?.id || '',
          driverId: driversData[0]?.id || ''
        }));
      } catch (error) {
        console.error("Error fetching deployment pool data:", error);
        setErrorMessage('Failed to connect to backend registry services.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    setTripForm({ ...tripForm, [e.target.name]: e.target.value });
  };

  // Validation Logic mapped to backend property 'max_capacity_kg'
  const selectedVehicle = vehicles.find(v => v.id === Number(tripForm.vehicleId));
  const weight = Number(tripForm.cargoWeight);
  const isOverweight = selectedVehicle && weight > selectedVehicle.max_capacity_kg;
  const excessWeight = isOverweight ? weight - selectedVehicle.max_capacity_kg : 0;

  // Action: Save Draft Trip
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch('/api/trips/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: tripForm.source,
          destination: tripForm.destination,
          vehicle_id: Number(tripForm.vehicleId),
          driver_id: Number(tripForm.driverId),
          cargo_weight_kg: Number(tripForm.cargoWeight),
          planned_distance_km: Number(tripForm.plannedDistance)
        })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save draft trip.');
      }

      // Refresh trip feed
      const tripsRes = await fetch('/api/trips');
      setLiveTrips(await tripsRes.json());
      alert('Draft trip saved successfully.');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Action: Create and Dispatch Trip immediately
  const handleDispatchTrip = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      // 1. First save as a draft to get a backend record ID
      const draftRes = await fetch('/api/trips/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: tripForm.source,
          destination: tripForm.destination,
          vehicle_id: Number(tripForm.vehicleId),
          driver_id: Number(tripForm.driverId),
          cargo_weight_kg: Number(tripForm.cargoWeight),
          planned_distance_km: Number(tripForm.plannedDistance)
        })
      });

      const draftData = await draftRes.json();
      if (!draftRes.ok) throw new Error(draftData.message || 'Draft step failed.');

      // 2. Transition status to Dispatched using the returned record's id
      const dispatchRes = await fetch(`/api/trips/${draftData.id || draftData.trip_id}/dispatch`, {
        method: 'POST'
      });

      if (!dispatchRes.ok) {
        const errData = await dispatchRes.json();
        throw new Error(errData.message || 'Capacity or authorization validation failed.');
      }

      // Refresh dynamic data feeds
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch('/api/trips'),
        fetch('/api/vehicles/dispatch-pool'),
        fetch('/api/drivers/dispatch-pool')
      ]);

      setLiveTrips(await tripsRes.json());
      const vData = await vehiclesRes.json();
      const dData = await driversRes.json();
      setVehicles(vData);
      setDrivers(dData);
      
      setTripForm(prev => ({ ...prev, source: '', destination: '', cargoWeight: '', plannedDistance: '', vehicleId: vData[0]?.id || '', driverId: dData[0]?.id || '' }));
      alert('Trip successfully dispatched!');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Dispatched': case 'On Trip': return 'bg-blue-500 text-white';
      case 'Draft': return 'bg-gray-400 text-white';
      case 'Cancelled': return 'bg-red-500 text-white';
      case 'Completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (isLoading) return <div className="p-6 text-center text-gray-500 font-medium">Loading TransitOps Dispatch Systems...</div>;

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

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span><strong>API Operation Blocked:</strong> {errorMessage}</span>
        </div>
      )}

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
                <input type="text" name="source" placeholder="e.g. Depot A" value={tripForm.source} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Destination</label>
                <input type="text" name="destination" placeholder="e.g. Hub B" value={tripForm.destination} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-gray-50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Vehicle (Available Only)</label>
              <select name="vehicleId" value={tripForm.vehicleId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-white">
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.model} ({v.reg_number}) - {v.max_capacity_kg}kg capacity</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Driver (Available Only)</label>
              <select name="driverId" value={tripForm.driverId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-white">
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} (License: {d.license_category})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Cargo Weight (kg)</label>
                <input type="number" name="cargoWeight" placeholder="e.g. 500" value={tripForm.cargoWeight} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none text-sm ${isOverweight ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-teal-600 bg-gray-50'}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Planned Distance (km)</label>
                <input type="number" name="plannedDistance" placeholder="e.g. 45" value={tripForm.plannedDistance} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm bg-gray-50" />
              </div>
            </div>

            {isOverweight && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 space-y-1">
                <p><strong>Vehicle Capacity:</strong> {selectedVehicle?.max_capacity_kg} kg</p>
                <p><strong>Cargo Weight:</strong> {weight} kg</p>
                <div className="flex items-center gap-1.5 mt-2 text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4" /> Capacity exceeded by {excessWeight} kg &rarr; Dispatch blocked
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={handleDispatchTrip} disabled={isOverweight || !tripForm.cargoWeight} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium shadow-sm transition ${isOverweight || !tripForm.cargoWeight ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-teal-700 text-white hover:bg-teal-800'}`}>
                <Play className="w-4 h-4 fill-current" /> {isOverweight ? 'Dispatch Disabled' : 'Dispatch Trip'}
              </button>
              <button onClick={handleSaveDraft} disabled={!tripForm.source} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
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
                <Activity className="w-5 h-5 text-green-500" /> LIVE BOARD
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveTrips.map((trip, idx) => (
                <div key={trip.id || idx} className="border border-gray-200 rounded-xl p-4 hover:border-teal-200 hover:shadow-md transition bg-gray-50/30 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-mono text-sm font-bold text-gray-800">{trip.trip_code || `TR-${trip.id}`}</span>
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
                        <p>{trip.destination || trip.dest}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-xs">
                    <div className="text-gray-500 font-medium">
                      <span className="block text-gray-900 font-semibold">{trip.vehicle || `Asset ID: ${trip.vehicle_id}`}</span>
                      {trip.driver || `Driver ID: ${trip.driver_id}`}
                    </div>
                    <div className="text-right font-medium text-gray-500">
                      {trip.eta_or_notes || `${trip.planned_distance_km} km`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}