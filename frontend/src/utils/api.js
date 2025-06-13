import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { 
  API_BASE_URL, 
  API_ANDROID_URL, 
  API_IOS_URL, 
  API_TIMEOUT 
} from '@env';

// Base URL is loaded from environment variables
// .env file should be git ignored to keep these URLs private
const baseURL = Platform.select({
  android: API_ANDROID_URL, 
  ios: API_IOS_URL,
  default: API_BASE_URL
});

// Create axios instance with custom config
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: parseInt(API_TIMEOUT, 10) || 15000, // Timeout from env or 15 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Try to get token from AsyncStorage
    const token = await AsyncStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 (Unauthorized) - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${baseURL}/refresh`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );
          
          const { access_token } = response.data;
          
          // Store new access token
          await AsyncStorage.setItem('accessToken', access_token);
          
          // Update authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        // You'll need to implement redirect to login logic here
        // or handle in your authentication store
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;