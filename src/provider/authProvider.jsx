import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import { getJwtToken, initAuthTimer, logout } from '../services/authService';

const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(initAuthTimer);

  const setToken = useCallback((newToken) => {
    if (!newToken) {
      logout(false);
    }
    setToken_(newToken);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const requestHadToken = Boolean(
          getJwtToken() || error.config?.headers?.Authorization
        );
        if (error.response?.status === 401 && requestHadToken) {
          logout();
          setToken_(null);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const contextValue = useMemo(
    () => ({ token, setToken }),
    [token, setToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
