import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('taskflow_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username, password) => {
    const data = await loginUser(username, password);
    const currentUser = { userId: data.userId, username: data.username, role: data.role };
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(currentUser));
    setUser(currentUser);
    return currentUser;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await registerUser(username, email, password);
    const currentUser = { userId: data.userId, username: data.username, role: data.role };
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(currentUser));
    setUser(currentUser);
    return currentUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
