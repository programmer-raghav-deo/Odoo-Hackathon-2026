import React, { useState } from 'react';
import { 
  Truck, AlertCircle, Eye, EyeOff, User, MonitorDot, Building2 
} from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  // UI State
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Data State (Maps directly to your DB Schema)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Dispatcher', // Matches RBAC schema
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData(prev => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic frontend validation for Signup
    if (!isLoginView && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      /* ===============================================================
      BACKEND CONNECTION TODO (To be uncommented later):
      ===============================================================
      const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
      const payload = isLoginView 
        ? { email: formData.email, password: formData.password }
        : { name: formData.fullName, email: formData.email, password: formData.password, role: formData.role };

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');
      
      // Store JWT Token: localStorage.setItem('transitops_token', data.token);
      // set user role from DB: const userRole = data.user.role;
      ===============================================================
      */
      
      // MOCK BACKEND DELAY FOR HACKATHON
      setTimeout(() => {
        setIsLoading(false);
        // Switch to the dashboard, passing the role for RBAC
        onLoginSuccess(formData.role); 
      }, 800);

    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-gray-200 min-h-[600px]">
        
        {/* Left Pane - Branding */}
        <div className="md:w-1/2 bg-teal-700 text-white p-10 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-teal-600 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="bg-white p-2 rounded">
                <Truck className="text-teal-700 w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-wide">TransitOps</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Precision Logistics for Global Fleet Management.
            </h1>
            <p className="text-teal-100 text-sm leading-relaxed max-w-md">
              TransitOps empowers dispatchers and safety officers with real-time telematics, 
              driver behavioral analytics, and predictive maintenance scheduling.
            </p>
          </div>
        </div>

        {/* Right Pane - Form Area */}
        <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            
            {/* View Toggle (Login vs Signup) */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
              <button 
                onClick={() => { setIsLoginView(true); setError(null); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLoginView ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsLoginView(false); setError(null); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${!isLoginView ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Create Account
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLoginView ? 'Welcome back' : 'Join TransitOps'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {isLoginView ? 'Please enter your credentials to access the fleet.' : 'Register to manage assets, drivers, and trips.'}
            </p>

            {/* Error Message Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-3 mb-6 text-sm">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name - Only on Signup */}
              {!isLoginView && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm"
                    placeholder="John Doe"
                    required={!isLoginView}
                  />
                </div>
              )}

              {/* Email - Both Views */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm"
                  placeholder="name@transitops.net"
                  required
                />
              </div>

              {/* Password - Both Views */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Password</label>
                  {isLoginView && (
                    <a href="#" className="text-xs text-teal-600 font-medium hover:underline">Forgot password?</a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm pr-10"
                    placeholder={isLoginView ? "Enter your password" : "Create a strong password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Only on Signup */}
              {!isLoginView && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm"
                    placeholder="Repeat your password"
                    required={!isLoginView}
                  />
                </div>
              )}

              {/* Access Level (RBAC) - Both Views (or just Signup based on preference, shown here for both to match your UI) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 mt-2">Access Level</label>
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => handleRoleSelect('Driver')} className={`py-2 border rounded-lg flex flex-col items-center transition-colors ${formData.role === 'Driver' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <User className="w-4 h-4 mb-1" /><span className="text-[10px] font-bold uppercase tracking-wide">Driver</span>
                  </button>
                  <button type="button" onClick={() => handleRoleSelect('Dispatcher')} className={`py-2 border rounded-lg flex flex-col items-center transition-colors ${formData.role === 'Dispatcher' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <MonitorDot className="w-4 h-4 mb-1" /><span className="text-[10px] font-bold uppercase tracking-wide">Dispatcher</span>
                  </button>
                  <button type="button" onClick={() => handleRoleSelect('Fleet Manager')} className={`py-2 border rounded-lg flex flex-col items-center transition-colors ${formData.role === 'Fleet Manager' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <Building2 className="w-4 h-4 mb-1" /><span className="text-[10px] font-bold uppercase tracking-wide">Fleet Mgr</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-teal-800 transition mt-4 shadow-sm"
              >
                {isLoading ? 'Processing...' : (isLoginView ? 'Sign In to Fleet →' : 'Create Account →')}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}