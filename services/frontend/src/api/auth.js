import api from "./client";
import authClient from './authClient';

// Authentication endpoints
export const login = async (credentials) => {
  try {
    const response = await authClient.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await authClient.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async (token) => {
  try {
    const response = await authClient.post('/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const refreshToken = (refreshToken) => 
  api.post("/v1/refresh", { refresh_token: refreshToken });

export const forgotPassword = (email) => 
  api.post("/v1/forgot-password", { email });

export const resetPassword = (data) => 
  api.post("/v1/reset-password", data);

export const verifyEmail = (token) => 
  api.get(`/v1/verify-email/${token}`);

export const resendVerificationEmail = () => 
  api.post("/v1/email/verification-notification");

// Phone verification endpoints
export const sendVerificationCode = (phone) => 
  api.post("/v1/send-code", { phone });

export const verifyPhone = (phone, code) => 
  api.post("/v1/verify-phone", { phone, code });

export const updateUserInfo = (data) => 
  api.post("/v1/profile/update", data);

export const getUserProfile = async (token) => {
  try {
    const response = await authClient.get('/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};


