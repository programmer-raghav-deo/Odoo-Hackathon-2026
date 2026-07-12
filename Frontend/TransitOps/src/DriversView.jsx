import React, { useState } from 'react';
import { Users, Map, AlertTriangle, ShieldCheck, Filter, Download } from 'lucide-react';

export default function DriversView() {
  const [drivers] = useState([
    { id: 'DR-101', name: 'Mark Antony', license: 'LSC-9823-TX', category: 'HMV', expiry: '10 Dec 2026', contact: '+1-555-0101', completion: 80, score: 92, status: 'On Trip' },
    { id: 'DR-102', name: 'John Steiner', license: 'LSC-7734-NY', category: 'LRV', expiry: '01 Oct 2023', contact: '+1-555-0102', completion: 45, score: 61, status: 'Suspended' },
    { id: 'DR-103', name: 'Sarah Fowler', license: 'LSC-1122-CA', category: 'LMV', expiry: '22 Nov 2027', contact: '+1-555-0103', completion: 95, score: 98, status: 'Available' },
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'on trip': return 'bg-blue-100 text-blue-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Drivers & Safety Profiles</h2>
        <p className="text-sm text-gray-500 mt-1">Manage personnel, track license compliance, and monitor safety performance metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between border-t-4 border-t-blue-500">
          <div><p className="text-xs font-bold text-gray-500 uppercase">Total Drivers</p><p className="text-3xl font-bold text-gray-900 mt-1">142</p></div>
          <div className="bg-blue-50 p-3 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between border-t-4 border-t-orange-500">
          <div><p className="text-xs font-bold text-gray-500 uppercase">On Trip</p><p className="text-3xl font-bold text-gray-900 mt-1">58</p></div>
          <div className="bg-orange-50 p-3 rounded-lg"><Map className="w-6 h-6 text-orange-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between border-t-4 border-t-red-500">
          <div><p className="text-xs font-bold text-gray-500 uppercase">Critical Alerts</p><p className="text-3xl font-bold text-gray-900 mt-1">3</p></div>
          <div className="bg-red-50 p-3 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between border-t-4 border-t-teal-500">
          <div><p className="text-xs font-bold text-gray-500 uppercase">Safety Score</p><p className="text-3xl font-bold text-gray-900 mt-1">94%</p></div>
          <div className="bg-teal-50 p-3 rounded-lg"><ShieldCheck className="w-6 h-6 text-teal-600" /></div>
        </div>
      </div>

      {/* Driver Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50/50">
          <div className="flex gap-6 text-sm font-semibold text-gray-500">
            <button className="text-teal-700 border-b-2 border-teal-700 pb-4 -mb-4">All Drivers</button>
            <button className="hover:text-gray-900 pb-4 -mb-4">Compliance</button>
          </div>
          <div className="flex gap-3">
            <button className="flex gap-2 text-sm text-gray-600 bg-white border px-3 py-1.5 rounded-lg hover:bg-gray-50"><Filter className="w-4 h-4" /> Filter</button>
            <button className="flex gap-2 text-sm text-gray-600 bg-white border px-3 py-1.5 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4" /> Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Driver Name</th>
                <th className="px-6 py-4">License No.</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Completion %</th>
                <th className="px-6 py-4">Safety Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {drivers.map((driver, idx) => {
                const isExpired = new Date(driver.expiry) < new Date('2024-01-01');
                return (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4"><div className="font-semibold">{driver.name}</div><div className="text-xs text-gray-400">{driver.id}</div></td>
                    <td className="px-6 py-4 font-mono text-gray-600">{driver.license}</td>
                    <td className={`px-6 py-4 ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>{driver.expiry}{isExpired && <span className="block text-[10px] text-red-500 font-bold">Expired</span>}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5"><div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${driver.completion}%` }}></div></div>
                        <span className="text-xs font-semibold">{driver.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">{driver.score}</td>
                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold ${getStatusColor(driver.status)}`}>{driver.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}