import React, { useState } from 'react';
import { 
  Sliders, 
  Shield, 
  Bell, 
  Globe, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';

export default function SettingsView() {
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Unified State Object mirroring backend properties
  const [settings, setSettings] = useState({
    companyName: "LogiRoute Global Ltd",
    currency: "USD ($)",
    distanceUnit: "Kilometers (km)",
    alertFuelThreshold: "15%",
    maintenanceInterval: "10000",
    twoFactorAuth: true,
    sessionTimeout: "30",
    webhookUrl: "https://api.logiroute.com/v1/hooks"
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Settings Summary Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">System State</p>
            <p className="text-2xl font-extrabold text-teal-700 mt-1">Operational</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-teal-700" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Webhooks</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">04 <span className="text-xs text-gray-400 font-medium">Live Links</span></p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg"><RefreshCw className="w-5 h-5 text-blue-600" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Security Profile</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">Tier-1 <span className="text-xs text-emerald-600 font-bold">Secure</span></p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg"><Shield className="w-5 h-5 text-purple-600" /></div>
        </div>
      </div>

      {/* Main Structural Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: INTERNAL CONFIGURATION DIRECTORY */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 h-fit space-y-1">
          <button 
            onClick={() => setActiveSubTab('general')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition text-left ${
              activeSubTab === 'general' ? 'bg-teal-700 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Globe className="w-4 h-4" /> Localization & Fleet Profiles
          </button>
          <button 
            onClick={() => setActiveSubTab('notifications')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition text-left ${
              activeSubTab === 'notifications' ? 'bg-teal-700 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Bell className="w-4 h-4" /> Telemetry Notification Limits
          </button>
          <button 
            onClick={() => setActiveSubTab('security')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition text-left ${
              activeSubTab === 'security' ? 'bg-teal-700 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Shield className="w-4 h-4" /> Admin Access & Webhooks
          </button>
        </div>

        {/* RIGHT COLUMN: ADMINISTRATIVE WORKSPACE PRESETS */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700" /> System Control Variables
            </h3>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold animate-fade-in bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> Configurations Saved Successfully
              </span>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            
            {/* PANEL: GENERAL LOCALIZATION SECTIONS */}
            {activeSubTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Company Registered Name</label>
                  <input 
                    type="text" name="companyName" value={settings.companyName} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none font-medium" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Preferred Currency System</label>
                    <select 
                      name="currency" value={settings.currency} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-600 outline-none font-medium"
                    >
                      <option value="USD ($)">USD ($) - United States Dollar</option>
                      <option value="EUR (€)">EUR (€) - Eurozone System</option>
                      <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Distance Metric Class</label>
                    <select 
                      name="distanceUnit" value={settings.distanceUnit} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-600 outline-none font-medium"
                    >
                      <option value="Kilometers (km)">Kilometers (km)</option>
                      <option value="Miles (mi)">Miles (mi)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: NOTIFICATION MATRIX PARAMETERS */}
            {activeSubTab === 'notifications' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Low Fuel Trigger Warning Threshold</label>
                    <select 
                      name="alertFuelThreshold" value={settings.alertFuelThreshold} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-600 outline-none font-medium"
                    >
                      <option value="10%">10% Remaining Volume</option>
                      <option value="15%">15% Remaining Volume</option>
                      <option value="20%">20% Remaining Volume</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Routine Service Interval Cadence</label>
                    <input 
                      type="number" name="maintenanceInterval" value={settings.maintenanceInterval} onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-600 outline-none font-semibold"
                      placeholder="e.g. 10000" 
                    />
                    <span className="text-[10px] text-gray-400 mt-1 inline-block font-medium">Configured in unit limits selected above.</span>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: DATA AND GATEWAY CONFIGURATIONS */}
            {activeSubTab === 'security' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Enforce Two-Factor Sign-In (2FA)</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Mandates mobile hardware tokens across dispatch accounts.</p>
                  </div>
                  <input 
                    type="checkbox" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleInputChange}
                    className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600 focus:ring-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Active Event Dispatch Webhook Delivery URL</label>
                  <input 
                    type="text" name="webhookUrl" value={settings.webhookUrl} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-600 focus:ring-2 focus:ring-teal-600 outline-none" 
                  />
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Modifications instantly affect multi-user dispatch logs.</span>
              </div>
              <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2">
                <Save className="w-4 h-4" /> Save System Variables
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}