import React, { createContext, useState, useEffect, useContext } from 'react';
// Remove AsyncStorage import
import { login as loginApi, logout as logoutApi, register as registerApi } from '../services/authService';
import { Alert } from 'react-native';

const AuthContext = createContext();

// Mock storage for testing (remove this when you install AsyncStorage)
const mockStorage = {
  _data: {},
  setItem: function(key, value) {
    this._data[key] = value;
    return Promise.resolve();
  },
  getItem: function(key) {
    return Promise.resolve(this._data[key]);
  },
  removeItem: function(key) {
    delete this._data[key];
    return Promise.resolve();
  }
};

// Use this instead of AsyncStorage
const storage = mockStorage;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    setLoading(true);
    try {
      // Check if token exists in storage
      const token = await storage.getItem('token');
      if (token) {
        const userJson = await storage.getItem('user');
        const userData = userJson ? JSON.parse(userJson) : null;
        setUser(userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginApi(email, password);
      // Store auth data in storage
      await storage.setItem('token', response.access_token);
      await storage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password, password_confirmation, userType) => {
    setLoading(true);
    try {
      const response = await registerApi(firstName, lastName, email, password, password_confirmation, userType);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutApi();
      // Clear storage
      await storage.removeItem('token');
      await storage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear storage on error
      await storage.removeItem('token');
      await storage.removeItem('user');
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  // Functions to get current user and check if authenticated
  const getCurrentUser = async () => {
    const userJson = await storage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  };

  const isAuthenticated = async () => {
    const token = await storage.getItem('token');
    return !!token;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      loading,
      login,
      register,
      logout,
      refreshUser: checkUserLoggedIn
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};