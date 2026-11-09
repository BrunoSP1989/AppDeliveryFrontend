'use client';
import { createContext, useContext, useState } from 'react';
import api from '../../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('store');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('store', JSON.stringify(data.store));
    setUser(data.store);
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('store');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);