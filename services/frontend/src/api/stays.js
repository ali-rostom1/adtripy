import axios from 'axios';
import { API_URL } from '../config';

// Axios instance for stays service
const staysApi = axios.create({
  baseURL: `${API_URL}/stays-service/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
staysApi.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all stays with optional pagination
export const getStays = async (page = 1) => {
  return await staysApi.get('/stays', { params: { page } });
};

// Get a single stay by ID
export const getStayById = async (id) => {
  return await staysApi.get(`/stays/${id}`);
};

// Create a new stay
export const createStay = async (stayData) => {
  return await staysApi.post('/stays', stayData);
};

// Update an existing stay
export const updateStay = async (id, stayData) => {
  return await staysApi.put(`/stays/${id}`, stayData);
};

// Delete a stay
export const deleteStay = async (id) => {
  return await staysApi.delete(`/stays/${id}`);
};