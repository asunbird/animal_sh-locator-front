import { createContext, useEffect, useState } from 'react';
import { refreshToken, getJwtToken } from './services/authService';

// Create an empty context object that will be used to share the authentication state and functions between components.
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getJwtToken()));
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const savedSession = localStorage.getItem('user_session');
      if (savedSession) {
        const newToken = await refreshToken();
        setIsAuthenticated(Boolean(newToken));
      }
      setIsCheckingAuth(false);
    }
    initAuth();
  }, []);

  if (isCheckingAuth) return null; // Or a loading spinner

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

