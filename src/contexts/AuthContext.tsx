
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

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
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Admin login
    if (email === 'admin@example.com' && password === 'password') {
      const adminUser: User = {
        id: 'admin-id',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        walletBalance: 100000
      };
      setUser(adminUser);
      localStorage.setItem('cryptoUser', JSON.stringify(adminUser));
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard",
      });
      return true;
    }
    
    // Mock user login - in a real app, this would be an API call
    if (email && password) {
      // Check if this is a registered user in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = registeredUsers.find((u: any) => u.email === email);
      
      if (foundUser && foundUser.password === password) {
        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: 'user',
          walletBalance: foundUser.walletBalance || 0
        };
        setUser(userData);
        localStorage.setItem('cryptoUser', JSON.stringify(userData));
        toast({
          title: "Login Successful",
          description: "Welcome back to CryptoCard Oasis",
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock user registration - in a real app, this would be an API call
    if (name && email && password) {
      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (registeredUsers.some((u: any) => u.email === email)) {
        toast({
          title: "Registration Failed",
          description: "Email already exists",
          variant: "destructive"
        });
        return false;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        password, // In a real app, this would be hashed
        role: 'user',
        walletBalance: 0
      };

      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: 'user' as const,
        walletBalance: newUser.walletBalance
      };

      setUser(userData);
      localStorage.setItem('cryptoUser', JSON.stringify(userData));
      
      toast({
        title: "Registration Successful",
        description: "Welcome to CryptoCard Oasis",
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cryptoUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin'
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
