import React, { useState } from 'react';
import { 
  Truck, AlertCircle, Eye, EyeOff, User, MonitorDot, Building2 
} from 'lucide-react';
import { api } from './api'; // Enforces central customFetch communication rules

export default function Login({ onLoginSuccess }) {
  // UI State
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Data State (Maps precisely to your Flask backend endpoints & SQLAlchemy models)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Dispatcher', // Default role matching user_role ENUM constraints
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

    // Front-end structural alignment verification
    if (!isLoginView && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLoginView) {
        // 🔐 Execute Sign-In transaction -> maps to app.route("/api/auth/login")
        const response = await api.auth.login({
          email: formData.email,
          password: formData.password
        });
        
        setIsLoading(false);
        // Bubble up role profile to parent context (e.g., 'Dispatcher')
        onLoginSuccess(response.user.role || formData.role); 
      } else {
        // 🔐 Execute Registry compilation -> maps to app.route("/api/auth/register")
        const response = await api.auth.register({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role // 'Fleet Manager', 'Dispatcher', 'Safety Officer', or 'Financial Analyst'
        });

        setIsLoading(false);
        // Auto-shift user smoothly over to the sign-in context pane upon registration
        setIsLoginView(true);
        setError("Registration complete! Please enter your credentials below to log in.");
      }
    } catch (err) {
      // Clean display translation from back-end JSON responses (e.g., "Email is already registered.")
      setError(err.message || "Could not synchronize verification tokens with the server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden border border-gray-200 min-h-[600px]">
        
        {/* Left Pane - Branding Layout Banner */}
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

        {/* Right Pane - Interface Workspace */}
        <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            
            {/* Context Workspace Toggle Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
              <button 
                type="button"
                onClick={() => { setIsLoginView(true); setError(null); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${isLoginView ? 'bg-white shadow-sm text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
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

            {/* Application Feedback Banner Component */}
            {error && (
              <div className={`p-3 rounded-lg flex items-start gap-3 mb-6 text-sm border ${
                error.includes("successfully") || error.includes("complete")
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${error.includes("successfully") || error.includes("complete") ? 'text-emerald-600' : 'text-red-500'}`} />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name Fields Layer */}
              {!isLoginView && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm font-medium"
                    placeholder="John Doe"
                    required={!isLoginView}
                  />
                </div>
              )}

              {/* Email Address Inputs */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-sm font-medium"
                  placeholder="name@transitops.net"
                  required
                />
              </div>

              {/* Security Credentials Layer */}
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

              {/* Password Match Verification Field */}
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

              {/* Access Control Level Matrix (Role-Based Selection) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2 mt-2">Access Level Authorization</label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    type="button" 
                    onClick={() => handleRoleSelect('Safety Officer')} 
                    className={`py-2 border rounded-lg flex flex-col items-center transition-colors ${formData.role === 'Safety Officer' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <User className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Safety Off.</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleRoleSelect('Dispatcher')} 
                    className={`py-2 border rounded-lg flex flex-col items-center transition-colors ${formData.role === 'Dispatcher' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <MonitorDot className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Dispatcher</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleRoleSelect('Fleet Manager')} 
                    className={`py-2 border rounded-lg flex flex-col items-center transition-colors ${formData.role === 'Fleet Manager' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Building2 className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Fleet Mgr</span>
                  </button>
                </div>
              </div>

              {/* Action Processor Element */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-teal-800 transition mt-4 shadow-sm flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? 'Processing Verification...' : (isLoginView ? 'Sign In to Fleet Registry →' : 'Authorize New Account →')}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}