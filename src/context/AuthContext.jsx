import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = async (email, password) => {
    // Simulated validation
    if (!email || !password) return { success: false, error: 'Please fill in all fields' };
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Server connection error. Is backend running?' };
    }
  };

  const register = async (details) => {
    const { name, email, phone, password, confirmPassword } = details;
    if (!name || !email || !phone || !password) {
      return { success: false, error: 'Please fill in all fields' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Server connection error. Is backend running?' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = async (role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/switch-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Error switching role:', err);
    }
  };

  const [allUsers, setAllUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users`);
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setAllUsers(prev => prev.filter(u => u.id !== id));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete user' };
    } catch (err) {
      console.error('Error deleting user:', err);
      return { success: false, error: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchRole, allUsers, fetchAllUsers, deleteUser }}>
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
