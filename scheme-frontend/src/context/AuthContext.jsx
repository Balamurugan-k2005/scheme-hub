import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

// Base backend URL
axios.defaults.baseURL = 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up dynamic Axios request interceptor
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          config.headers['Authorization'] = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Automatically clear session if token is expired or unauthorized
        if (error.response && (error.response.status === 401 || (error.response.status === 403 && error.config.url.includes('/api/auth/me')))) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  // Load user details when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadCurrentUser();
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  }, [token]);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
      await loadProfile();
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await axios.get('/api/profile');
      setProfile(res.data);
    } catch (err) {
      // Profile might not exist yet for fresh users
      setProfile(null);
    }
  };

  const login = async (loginData) => {
    const res = await axios.post('/api/auth/login', loginData);
    setToken(res.data.token);
  };

  const register = async (registerData) => {
    await axios.post('/api/auth/register', registerData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    const res = await axios.put('/api/profile', profileData);
    setProfile(res.data);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        loading,
        login,
        register,
        logout,
        loadProfile,
        updateProfile,
      }}
    >
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
