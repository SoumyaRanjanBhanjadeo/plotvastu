'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  
  // Use ref to access handleSessionExpired in useEffect
  const handleSessionExpiredRef = useRef();

  const handleSessionExpired = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiresAt');
    setUser(null);
    setIsAuthenticated(false);
    setShowSessionExpired(true);
  }, []);

  // Store the function in ref so useEffect can access it
  handleSessionExpiredRef.current = handleSessionExpired;

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

    // Listen for session expired event from API interceptor
    const handleSessionExpiredEvent = () => {
      handleSessionExpiredRef.current?.();
    };

    window.addEventListener('sessionExpired', handleSessionExpiredEvent);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpiredEvent);
    };
  }, []);

  const verifyToken = async () => {
    try {
      // Check if token is expired before making request
      const expiresAt = localStorage.getItem('tokenExpiresAt');
      if (expiresAt && Date.now() > parseInt(expiresAt)) {
        handleSessionExpired();
        return;
      }
      
      const response = await authAPI.getMe();
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setIsAuthenticated(true);
    } catch (error) {
      handleSessionExpired();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAgain = () => {
    setShowSessionExpired(false);
    window.location.href = '/';
  };

  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data.data;
      
      // Calculate token expiration (7 days from now, matching backend)
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      
      setUser(user);
      setIsAuthenticated(true);
      setShowSessionExpired(false);
      
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
      localStorage.removeItem('tokenExpiresAt');
      setUser(null);
      setIsAuthenticated(false);
      setShowSessionExpired(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    showSessionExpired,
    login,
    logout,
    handleLoginAgain,
  };
}
