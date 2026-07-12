import React, { useState, useEffect } from 'react';
import { 
  Fuel, 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  PlusCircle,
  FileText,
  Calendar,
  Truck,
  SlidersHorizontal,
  Download
} from 'lucide-react';

export default function FuelExpensesView() {
  // Live dataset states fetched from backend
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View & Form toggle control states
  const [activeForm, setActiveForm] = useState('fuel'); // 'fuel' | 'expense'
  
  // Forms states mapped to match exact backend request bodies
  const [fuelForm, setFuelForm] = useState({ vehicle_id: '1', liters: '', fuel_cost: '' });
  const [expenseForm, setExpenseForm] = useState({ trip_id: '', vehicle_id: '1', toll: '', other_cost: '' });

  // Fetch live ledger records from backend
  const fetchLedgerData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to synchronize ledger records');
      
      const data = await response.json();
      // Expecting backend payload structure to map to these states
      setFuelLogs(data.fuel_logs || []);
      setExpenses(data.other_expenses || []);
      setError(null);
    } catch (err) {
      console.error("Backend communication error:", err);
      setError("Unable to connect to live fleet expense database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, []);

  // Handler for POST /api/expenses/fuel
  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      vehicle_id: parseInt(fuelForm.vehicle_id),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD formatting matching backend
      liters: parseFloat(fuelForm.liters) || 0,
      fuel_cost: parseFloat(fuelForm.fuel_cost) || 0
    };

    try {
      const response = await fetch('/api/expenses/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Transaction submission rejected');

      // Refresh data grid updates dynamically from database
      fetchLedgerData();
      setFuelForm({ vehicle_id: '1', liters: '', fuel_cost: '' });
    } catch (err) {
      alert("Failed to log fuel entry: Check backend service status.");
    }
  };

  // Handler for POST /api/expenses/other
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      trip_id: parseInt(expenseForm.trip_id),
      vehicle_id: parseInt(expenseForm.vehicle_id),
      toll: expenseForm.type === 'Toll' ? parseFloat(expenseForm.amount) || 0 : 0.00,
      other_cost: expenseForm.type !== 'Toll' ? parseFloat(expenseForm.amount) || 0 : 0.00
    };

    try {
      const response = await fetch('/api/expenses/other', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Expense entry submission rejected');

      fetchLedgerData();
      setExpenseForm({ trip_id: '', vehicle_id: '1', toll: '', other_cost: '' });
    } catch (err) {
      alert("Failed to commit operational expense: Verify active Trip ID.");
    }
  };

  // Derived financial calculation values
  const totalFuelSpend = fuelLogs.reduce((acc, log) => acc + (log.fuel_cost || 0), 0);
  const totalIncidentals = expenses.reduce((acc, exp) => acc + (exp.toll || 0) + (exp.other_cost || 0), 0);
  const totalVolume = fuelLogs.reduce((acc, log) => acc + (log.liters || 0), 0);
  const avgFuelRate = totalVolume > 0 ? (totalFuelSpend / totalVolume) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-gray-500 animate-pulse uppercase tracking-widest">
          Syncing Operational Expenses Ledger...
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

      {/* Financial Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fuel Spend</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">${totalFuelSpend.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg"><Fuel className="w-5 h-5 text-teal-700" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trip Incidentals</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">${totalIncidentals.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Fuel Rate</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">
              ${avgFuelRate > 0 ? `${avgFuelRate.toFixed(2)} / L` : "0.00 / L"}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg"><TrendingUp className="w-5 h-5 text-amber-600" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Ledger Value</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">
              ${(totalFuelSpend + totalIncidentals).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg"><Receipt className="w-5 h-5 text-purple-600" /></div>
        </div>
      </div>

      {/* Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: LOGGING INTERACTIVE FORM */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit sticky top-0">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button 
              onClick={() => setActiveForm('fuel')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 flex items-center justify-center gap-2 ${
                activeForm === 'fuel' ? 'border-teal-700 text-teal-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Fuel className="w-4 h-4" /> Log Fuel Transaction
            </button>
            <button 
              onClick={() => setActiveForm('expense')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 flex items-center justify-center gap-2 ${
                activeForm === 'expense' ? 'border-teal-700 text-teal-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <DollarSign className="w-4 h-4" /> Log Operational Expense
            </button>
          </div>

          <div className="p-6">
            {activeForm === 'fuel' ? (
              <form onSubmit={handleFuelSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Target Asset ID</label>
                  <select 
                    value={fuelForm.vehicle_id}
                    onChange={(e) => setFuelForm({...fuelForm, vehicle_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 outline-none"
                  >
                    <option value="1">Vehicle Asset #1</option>
                    <option value="2">Vehicle Asset #2</option>
                    <option value="3">Vehicle Asset #3</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Volume (Liters)</label>
                    <input 
                      type="number" step="any" required placeholder="55"
                      value={fuelForm.liters}
                      onChange={(e) => setFuelForm({...fuelForm, liters: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Total Cost ($)</label>
                    <input 
                      type="number" step="any" required placeholder="92.40"
                      value={fuelForm.fuel_cost}
                      onChange={(e) => setFuelForm({...fuelForm, fuel_cost: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none font-bold"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-lg shadow-sm transition text-sm flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Commit Fuel Entry
                </button>
              </form>
            ) : (
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Trip ID Reference</label>
                    <input 
                      type="number" required placeholder="Ex: 1"
                      value={expenseForm.trip_id}
                      onChange={(e) => setExpenseForm({...expenseForm, trip_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Asset ID</label>
                    <input 
                      type="number" required placeholder="Ex: 1"
                      value={expenseForm.vehicle_id}
                      onChange={(e) => setExpenseForm({...expenseForm, vehicle_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cost Category</label>
                  <select 
                    value={expenseForm.type}
                    onChange={(e) => setExpenseForm({...expenseForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 outline-none"
                  >
                    <option value="Toll">Toll Charges</option>
                    <option value="Other">Other Expenses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Amount ($)</label>
                  <input 
                    type="number" step="any" required placeholder="50.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none font-bold"
                  />
                </div>
                <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-lg shadow-sm transition text-sm flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Save Expense Record
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE FINANCIAL HISTORY TABLES */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fuel History Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <Fuel className="w-4 h-4 text-teal-700" /> Fuel Transaction Log
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Vehicle ID</th>
                    <th className="px-6 py-3">Volume</th>
                    <th className="px-6 py-3">Total Cost</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {fuelLogs.map((log, index) => (
                    <tr key={log.id || index} className="hover:bg-gray-50/40 transition">
                      <td className="px-6 py-3 flex items-center gap-2 text-gray-900 font-bold">
                        <Truck className="w-3.5 h-3.5 text-gray-400" /> Asset #{log.vehicle_id}
                      </td>
                      <td className="px-6 py-3">{log.liters} L</td>
                      <td className="px-6 py-3 text-gray-900 font-bold">${log.fuel_cost?.toFixed(2)}</td>
                      <td className="px-6 py-3 text-xs text-gray-400 whitespace-nowrap">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Expenses Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" /> Incidental Fleet Ledger
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Trip ID</th>
                    <th className="px-6 py-3">Vehicle ID</th>
                    <th className="px-6 py-3">Toll Charges</th>
                    <th className="px-6 py-3">Other Costs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {expenses.map((exp, index) => (
                    <tr key={exp.id || index} className="hover:bg-gray-50/40 transition">
                      <td className="px-6 py-3 font-mono text-xs text-gray-900 font-bold">TRIP-{exp.trip_id}</td>
                      <td className="px-6 py-3 text-xs text-gray-600 font-semibold">Asset #{exp.vehicle_id}</td>
                      <td className="px-6 py-3 text-gray-900 font-medium">${exp.toll?.toFixed(2)}</td>
                      <td className="px-6 py-3 text-gray-900 font-bold">${exp.other_cost?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}