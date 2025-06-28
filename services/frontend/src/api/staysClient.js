import axios from 'axios';
import { useAuthStore } from '../store/AuthStore';

const staysClient = axios.create({
  baseURL: `${import.meta.env.VITE_STAYS_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token
staysClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default staysClient;