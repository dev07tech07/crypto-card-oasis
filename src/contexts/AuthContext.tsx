
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { handleLogin, handleRegister, handleLogout } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedCredentials, setSavedCredentials] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('cryptoUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('cryptoUser');
      }
    }
    
    // Load saved credentials if available
    const rememberedCredentials = localStorage.getItem('rememberedCredentials');
    if (rememberedCredentials) {
      try {
        setSavedCredentials(JSON.parse(rememberedCredentials));
      } catch (error) {
        console.error('Failed to parse saved credentials', error);
        localStorage.removeItem('rememberedCredentials');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    return handleLogin(email, password, rememberMe, setUser, setSavedCredentials);
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    return handleRegister(name, email, password, setUser);
  };

  const logout = () => {
    handleLogout(setUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    savedCredentials,
    setUser // Export setUser to allow updating user state
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { User };
