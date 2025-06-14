import api from "./client";

// Authentication endpoints
export const login = (credentials) => 
  api.post("/v1/login", credentials);

export const register = (userData) => 
  api.post("/v1/register", userData);

export const logout = () => 
  api.post("/v1/logout");

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
