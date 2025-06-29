import axios from 'axios';
import { useAuthStore } from '../store/AuthStore';

// Create an axios instance with baseURL
const staysClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL + '/api/v1',
});

// Add a request interceptor to automatically add the auth token to every request
staysClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
staysClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('Authentication error:', error.response?.data);
      
      // If token issues, could redirect to login
      if (error.response?.data?.error_type === 'token_expired') {
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default staysClient;