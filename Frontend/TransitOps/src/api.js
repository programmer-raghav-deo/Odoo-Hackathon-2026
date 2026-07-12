const BASE_URL = 'http://localhost:5000/api';

/**
 * Enhanced fetch wrapper that enforces session state tracking across ports
 */
async function customFetch(url, options = {}) {
  // Enforce session credentials so Flask cookies work over separate ports
  options.credentials = 'include'; 
  
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}
export const api = {
  // 🔐 1. AUTHENTICATION ENDPOINTS
  auth: {
    register: (userData) => 
      fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData), // expects: name, email, password, role
      }).then(handleResponse),

    login: (credentials) => 
      fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials), // expects: email, password
      }).then(handleResponse),

    logout: () => 
      fetch(`${BASE_URL}/auth/logout`, { method: 'POST' }).then(handleResponse),
  },

  // 📊 2. METRICS & CORE DASHBOARD ENDPOINTS
  dashboard: {
    getKpis: () => fetch(`${BASE_URL}/dashboard/kpis`).then(handleResponse),
    getRecentTrips: () => fetch(`${BASE_URL}/dashboard/recent-trips`).then(handleResponse),
  },

  // 🚚 3. VEHICLE REGISTRY ENDPOINTS
  vehicles: {
    getAll: () => fetch(`${BASE_URL}/vehicles`).then(handleResponse),
    create: (vehicleData) => 
      fetch(`${BASE_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      }).then(handleResponse),
    getDispatchPool: () => fetch(`${BASE_URL}/vehicles/dispatch-pool`).then(handleResponse),
  },

  // 👥 4. DRIVER MANAGEMENT ENDPOINTS
  drivers: {
    getAll: () => fetch(`${BASE_URL}/drivers`).then(handleResponse),
    create: (driverData) => 
      fetch(`${BASE_URL}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverData),
      }).then(handleResponse),
    updateStatus: (driverId, status) => 
      fetch(`${BASE_URL}/drivers/${driverId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).then(handleResponse),
    getDispatchPool: () => fetch(`${BASE_URL}/drivers/dispatch-pool`).then(handleResponse),
  },

  // 🗺️ 5. LOGISTICS & DISPATCH (TRIPS) ENDPOINTS
  trips: {
    createDraft: (tripData) => 
      fetch(`${BASE_URL}/trips/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      }).then(handleResponse),
    dispatch: (tripId) => fetch(`${BASE_URL}/trips/${tripId}/dispatch`, { method: 'POST' }).then(handleResponse),
    complete: (tripId) => fetch(`${BASE_URL}/trips/${tripId}/complete`, { method: 'POST' }).then(handleResponse),
    cancel: (tripId) => fetch(`${BASE_URL}/trips/${tripId}/cancel`, { method: 'POST' }).then(handleResponse),
  },

  // 🔧 6. MAINTENANCE LIFECYCLE ENDPOINTS
  maintenance: {
    logService: (logData) => 
      fetch(`${BASE_URL}/maintenance/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
      }).then(handleResponse),
    closeService: (logId) => fetch(`${BASE_URL}/maintenance/${logId}/close`, { method: 'POST' }).then(handleResponse),
  },

  // ⛽ 7. EXPENSES & FUEL TRANSACTIONS
  expenses: {
    logFuel: (fuelData) => 
      fetch(`${BASE_URL}/expenses/fuel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fuelData),
      }).then(handleResponse),
    logOther: (expenseData) => 
      fetch(`${BASE_URL}/expenses/other`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      }).then(handleResponse),
  },

  // 📈 8. LIVE ANALYTICS ENGINE
  analytics: {
    getSummary: () => fetch(`${BASE_URL}/analytics/summary`).then(handleResponse),
    getRoi: () => fetch(`${BASE_URL}/analytics/roi`).then(handleResponse),
  }
};