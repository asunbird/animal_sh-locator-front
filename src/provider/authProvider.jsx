import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { getJwtToken, logout as clearAuth, refreshToken } from "../services/authService";

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(getJwtToken);

  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      console.log('[AuthProvider] Token set in axios defaults');
    } else {
      delete axios.defaults.headers.common["Authorization"];
      clearAuth();
    }
  }, [token]);

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('[TokenRefresh] 401 error - attempting token refresh');

          if (isRefreshing) {
            return new Promise((resolve) => {
              subscribeTokenRefresh((newToken) => {
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                resolve(axios(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshToken();
            isRefreshing = false;

            if (newToken) {
              console.log('[TokenRefresh] Token refreshed successfully');
              setToken(newToken);
              axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              onTokenRefreshed(newToken);
              return axios(originalRequest);
            } else {
              console.log('[TokenRefresh] Refresh failed - logging out');
              setToken(null);
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error('[TokenRefresh] Error during refresh:', refreshError);
            isRefreshing = false;
            setToken(null);
            return Promise.reject(refreshError);
          }
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
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
