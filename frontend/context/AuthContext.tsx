import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  token: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const data = res.data as User;
    setUser(data);
    await AsyncStorage.setItem('user', JSON.stringify(data));
    await AsyncStorage.setItem('token', data.token);
    return data;
  };

  const register = async (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  }) => {
    const res = await authApi.register(values);
    const data = res.data as User;
    setUser(data);
    await AsyncStorage.setItem('user', JSON.stringify(data));
    await AsyncStorage.setItem('token', data.token);
    return data;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  };

  return { user, loading, login, register, logout };
});
