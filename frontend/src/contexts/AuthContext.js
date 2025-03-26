import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // For demonstration purposes, create a mock user
  const [currentUser] = useState({
    username: 'demouser',
    displayName: 'Demo User',
    profilePicture: null
  });

  const value = {
    currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}