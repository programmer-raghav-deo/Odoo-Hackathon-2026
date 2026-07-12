import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from './api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    currency: 'USD ($)',
    distanceUnit: 'Kilometers (km)'
  });

  // Optional: Check if a user session already exists when app loads
  useEffect(() => {
    // If your backend partner sets up a /api/auth/me endpoint later, fetch it here
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, globalSettings, setGlobalSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);