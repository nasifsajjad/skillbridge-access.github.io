
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  deviceId?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@nbinstitution.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Demo User',
    role: 'user' as const,
  },
];

// Generate a unique device ID
const generateDeviceId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('nbUser');
      const storedDeviceId = localStorage.getItem('nbDeviceId');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          
          // Check if device ID matches
          if (parsedUser.deviceId && parsedUser.deviceId === storedDeviceId) {
            setUser(parsedUser);
          } else {
            // Clear invalid session
            localStorage.removeItem('nbUser');
            toast.error('Your session has expired. Please log in again.');
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('nbUser');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchedUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!matchedUser) {
        throw new Error('Invalid email or password');
      }
      
      // Generate new device ID for this session
      const deviceId = generateDeviceId();
      localStorage.setItem('nbDeviceId', deviceId);
      
      // Create user session with device ID
      const userWithDevice = {
        id: matchedUser.id,
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
        deviceId,
      };
      
      localStorage.setItem('nbUser', JSON.stringify(userWithDevice));
      setUser(userWithDevice);
      
      toast.success(`Welcome back, ${matchedUser.name}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered');
      }
      
      // In a real app, you would call an API to create the user
      // Since this is a mock, we'll just create a session
      
      // Generate new device ID for this session
      const deviceId = generateDeviceId();
      localStorage.setItem('nbDeviceId', deviceId);
      
      // Create user session
      const newUser = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        role: 'user' as const,
        deviceId,
      };
      
      localStorage.setItem('nbUser', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('nbUser');
    localStorage.removeItem('nbDeviceId');
    setUser(null);
    toast.success('You have been logged out');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
