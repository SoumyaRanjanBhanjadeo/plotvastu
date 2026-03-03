'use client';

import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      // Verify token validity
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore error
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };
}
