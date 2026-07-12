import React, { useState } from 'react';
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
  // Mock reactive local dataset matching schema attributes
  const [fuelLogs, setFuelLogs] = useState([
    { id: 'FUEL-001', vehicle: 'VAN-05', odometer: 42150, quantity: 55, cost: 92.40, date: 'Jul 12, 2026' },
    { id: 'FUEL-002', vehicle: 'TRUCK-11', odometer: 185300, quantity: 210, cost: 346.50, date: 'Jul 10, 2026' },
    { id: 'FUEL-003', vehicle: 'MINI-03', odometer: 89400, quantity: 45, cost: 74.25, date: 'Jul 08, 2026' }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 'EXP-001', tripId: 'TR-402', type: 'Toll', amount: 24.50, desc: 'Main Highway Toll Plaza', date: 'Jul 12, 2026' },
    { id: 'EXP-002', tripId: 'TR-402', type: 'Food', amount: 18.00, desc: 'Driver Meal Allowance', date: 'Jul 11, 2026' },
    { id: 'EXP-003', tripId: 'TR-391', type: 'Permit', amount: 150.00, desc: 'Interstate Carrier Clearance', date: 'Jul 09, 2026' }
  ]);

  // View & Form toggle control states
  const [activeForm, setActiveForm] = useState('fuel'); // 'fuel' | 'expense'
  const [fuelForm, setFuelForm] = useState({ vehicle: 'VAN-05', odometer: '', quantity: '', cost: '' });
  const [expenseForm, setExpenseForm] = useState({ tripId: '', type: 'Toll', amount: '', desc: '' });

  const handleFuelSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: `FUEL-${Math.floor(100 + Math.random() * 900)}`,
      vehicle: fuelForm.vehicle,
      odometer: parseInt(fuelForm.odometer) || 0,
      quantity: parseFloat(fuelForm.quantity) || 0,
      cost: parseFloat(fuelForm.cost) || 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setFuelLogs([newLog, ...fuelLogs]);
    setFuelForm({ vehicle: 'VAN-05', odometer: '', quantity: '', cost: '' });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      tripId: expenseForm.tripId ? expenseForm.tripId.toUpperCase() : 'GENERAL',
      type: expenseForm.type,
      amount: parseFloat(expenseForm.amount) || 0,
      desc: expenseForm.desc || 'Operational Expense Charge',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setExpenses([newExpense, ...expenses]);
    setExpenseForm({ tripId: '', type: 'Toll', amount: '', desc: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Financial Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fuel Spend</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">
              ${fuelLogs.reduce((acc, log) => acc + log.cost, 0).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg"><Fuel className="w-5 h-5 text-teal-700" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trip Incidentals</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">
              ${expenses.reduce((acc, exp) => acc + exp.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Fuel Rate</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">$1.66 / L</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg"><TrendingUp className="w-5 h-5 text-amber-600" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Total Ledger Value</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">
              ${(fuelLogs.reduce((acc, log) => acc + log.cost, 0) + expenses.reduce((acc, exp) => acc + exp.amount, 0)).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg"><Receipt className="w-5 h-5 text-purple-600" /></div>
        </div>
      </div>

      {/* Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COMPONENT COLUMN: LOGGING INTERACTIVE FORM */}
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
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Target Asset</label>
                  <select 
                    value={fuelForm.vehicle}
                    onChange={(e) => setFuelForm({...fuelForm, vehicle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 outline-none"
                  >
                    <option value="VAN-05">VAN-05 (Ford Transit)</option>
                    <option value="TRUCK-11">TRUCK-11 (Volvo Heavy)</option>
                    <option value="MINI-03">MINI-03 (Scania Box)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Current Odometer Reading (km)</label>
                  <input 
                    type="number" required placeholder="e.g. 42680"
                    value={fuelForm.odometer}
                    onChange={(e) => setFuelForm({...fuelForm, odometer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Fuel Volume (Liters)</label>
                    <input 
                      type="number" step="any" required placeholder="55"
                      value={fuelForm.quantity}
                      onChange={(e) => setFuelForm({...fuelForm, quantity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Total Refill Cost ($)</label>
                    <input 
                      type="number" step="any" required placeholder="92.40"
                      value={fuelForm.cost}
                      onChange={(e) => setFuelForm({...fuelForm, cost: e.target.value})}
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
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Trip Reference ID</label>
                    <input 
                      type="text" required placeholder="Ex: TR-402"
                      value={expenseForm.tripId}
                      onChange={(e) => setExpenseForm({...expenseForm, tripId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none font-mono uppercase font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cost Category</label>
                    <select 
                      value={expenseForm.type}
                      onChange={(e) => setExpenseForm({...expenseForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-teal-600 outline-none"
                    >
                      <option value="Toll">Toll Charges</option>
                      <option value="Food">Driver Meals</option>
                      <option value="Permit">Transit Permits</option>
                      <option value="Fine">Regulatory Fines</option>
                      <option value="Other">Other Expenses</option>
                    </select>
                  </div>
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
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description / Particulars</label>
                  <input 
                    type="text" required placeholder="Enter receipt notes..."
                    value={expenseForm.desc}
                    onChange={(e) => setExpenseForm({...expenseForm, desc: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-lg shadow-sm transition text-sm flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Save Expense Record
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: LIVE FINANCIAL HISTORY TABLES */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fuel History Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <Fuel className="w-4 h-4 text-teal-700" /> Fuel Transaction Log
              </h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm"><SlidersHorizontal className="w-3 h-3" /> Filter</button>
                <button className="flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm"><Download className="w-3 h-3" /> Export</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3">Vehicle</th>
                    <th className="px-6 py-3">Odometer</th>
                    <th className="px-6 py-3">Volume</th>
                    <th className="px-6 py-3">Total Cost</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {fuelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/40 transition">
                      <td className="px-6 py-3 flex items-center gap-2 text-gray-900 font-bold"><Truck className="w-3.5 h-3.5 text-gray-400" />{log.vehicle}</td>
                      <td className="px-6 py-3 font-mono text-xs text-gray-500">{log.odometer.toLocaleString()} km</td>
                      <td className="px-6 py-3">{log.quantity} L</td>
                      <td className="px-6 py-3 text-gray-900 font-bold">${log.cost.toFixed(2)}</td>
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
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Particulars / Description</th>
                    <th className="px-6 py-3">Charge</th>
                    <th className="px-6 py-3">Logged Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50/40 transition">
                      <td className="px-6 py-3 font-mono text-xs text-gray-900 font-bold">{exp.tripId}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                          exp.type === 'Toll' ? 'bg-blue-100 text-blue-700' :
                          exp.type === 'Permit' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {exp.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-gray-400" />{exp.desc}</td>
                      <td className="px-6 py-3 text-gray-900 font-bold">${exp.amount.toFixed(2)}</td>
                      <td className="px-6 py-3 text-xs text-gray-400 whitespace-nowrap"><Calendar className="w-3 h-3 inline mr-1" />{exp.date}</td>
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