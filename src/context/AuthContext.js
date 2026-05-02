import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      // Adjust the endpoint to match the Favo backend
      const response = await api.post('/auth/login', { email, password });
      
      // Axios puts the response body in response.data
      const resultData = response.data;

      // Check if login was successful based on status or data
      if (resultData && resultData.ok) {
        // Token is inside resultData.data.token
        const token = resultData.data?.token;
        const user = { role: resultData.data?.role, id: resultData.data?.userId };
        
        setUserInfo(user);
        setUserToken(token);
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, error: resultData.error || 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      // Favo backend sends error in error.response.data.error
      const errorMsg = error.response?.data?.error || error.message || 'Login failed';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return { success: true };
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem('userToken');
      let userInfo = await AsyncStorage.getItem('userInfo');
      setUserToken(userToken);
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
      }
    } catch (e) {
      console.log('isLogged in error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, register, userToken, userInfo, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
