import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      const { access, refresh } = data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // For now, use username from credentials. In production, decode JWT or call /me endpoint
      // The JWT token contains user info, but for simplicity we'll use a default role
      // You should decode the JWT or create a /me endpoint to get full user data
      const userData = {
        username: credentials.username,
        role: 'member', // This should come from JWT decode or API call
        email: credentials.email || '',
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await authAPI.logout(refresh);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isMember = () => user?.role === 'member';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isMember,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
