import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);

  const login = (newPrincipal) => {
    setIsAuthenticated(true);
    setPrincipal(newPrincipal);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPrincipal(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, principal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
