import axios from 'axios';
import { useAuthStore } from '../store/AuthStore';

// Create an axios instance with baseURL
const staysClient = axios.create({
  // Use AUTH_API_URL since it's acting as the gateway to all services
  baseURL: import.meta.env.VITE_AUTH_API_URL + '/api/v1',
});

// Add a request interceptor with better error handling
staysClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    console.log("Token being sent:", token ? "Valid token" : "No token"); 
    console.log("Request URL:", config.baseURL + config.url);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor with better logging
staysClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Export as default
export default staysClient;