import axios from 'axios';
import { getJwtToken, logout } from '../src/services/authService';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

axiosClient.interceptors.request.use((config) => {
  const token = getJwtToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestHadToken = Boolean(
      getJwtToken() || error.config?.headers?.Authorization
    );
    if (error.response?.status === 401 && requestHadToken) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
