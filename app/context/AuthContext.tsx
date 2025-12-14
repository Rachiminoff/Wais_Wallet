import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import {
    AuthError,
    getUser,
    loginUser,
    logoutUser,
    registerUser,
    saveUser,
    updateUserBalance,
    User
} from '../utils/mmkvStorage';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  updateBalance: (newBalance: number) => Promise<{ success: boolean; error?: string }>;
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from MMKV on app start
  useEffect(() => {
    const initAuth = () => {
      try {
        setLoading(true);
        
        // ONE-TIME MIGRATION: Update any existing USD users to PHP
        const existingUser = getUser();
        if (existingUser && existingUser.currency === 'USD') {
          existingUser.currency = 'PHP';
          saveUser(existingUser);
          console.log('Migrated user currency from USD to PHP');
        }
        
        // TEMPORARY: Logout on app refresh for security
        logoutUser();
        setUser(null);
        setIsAuthenticated(false);
      } catch (err) {
        const errorMessage = err instanceof AuthError ? err.message : 'Failed to initialize authentication';
        console.error('Auth initialization error:', errorMessage);
        setError(errorMessage);
        setIsAuthenticated(false);
      } finally {
        // Add a small delay to ensure router is ready before marking loading as false
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        setError(null);
        setLoading(true);

        // Basic validation
        if (!email?.trim() || !password?.trim()) {
          const errorMsg = 'Email and password are required';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        const userData = loginUser(email, password);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          return { success: true };
        }

        const errorMsg = 'Invalid email or password';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } catch (err) {
        const errorMessage = err instanceof AuthError ? err.message : 'Login failed';
        setError(errorMessage);
        console.error('Login error:', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
      try {
        setError(null);
        setLoading(true);

        // Validation
        if (!email?.trim() || !password?.trim() || !name?.trim()) {
          const errorMsg = 'All fields are required';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        if (password.length < 6) {
          const errorMsg = 'Password must be at least 6 characters';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        const newUser = registerUser(email, password, name);
        // Don't auto-login after signup - user needs to login manually
        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof AuthError ? err.message : 'Registration failed';
        setError(errorMessage);
        console.error('Signup error:', errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    try {
      logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : 'Logout failed';
      console.error('Logout error:', errorMessage);
      setError(errorMessage);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateBalance = useCallback(
    async (newBalance: number): Promise<{ success: boolean; error?: string }> => {
      try {
        setError(null);

        if (typeof newBalance !== 'number' || newBalance < 0) {
          const errorMsg = 'Invalid balance amount';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        updateUserBalance(newBalance);
        const updatedUser = getUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof AuthError ? err.message : 'Failed to update balance';
        setError(errorMessage);
        console.error('Balance update error:', errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const updateUser = useCallback(
    async (userData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
      try {
        setError(null);

        if (!user) {
          const errorMsg = 'User not logged in';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        if (!userData || Object.keys(userData).length === 0) {
          const errorMsg = 'No data to update';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        const updatedUser = { ...user, ...userData };
        saveUser(updatedUser);
        setUser(updatedUser);
        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof AuthError ? err.message : 'Failed to update user';
        setError(errorMessage);
        console.error('User update error:', errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    updateBalance,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
