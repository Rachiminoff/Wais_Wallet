import { createMMKV } from 'react-native-mmkv';

// Custom error class for auth errors
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Initialize MMKV storage
let storage: any = null;

try {
  storage = createMMKV();
} catch (error) {
  console.error('Failed to initialize MMKV storage:', error);
  // Create a fallback storage object
  storage = {
    set: (key: string, value: any) => {
      throw new AuthError('Storage not available', 'STORAGE_INIT_FAILED');
    },
    getString: (key: string) => null,
    getBoolean: (key: string) => false,
    remove: (key: string) => false,
    clearAll: () => {},
  };
}

// User data type
export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  currency: string;
  createdAt: string;
  isGuest: boolean;
}

// Auth storage keys
const KEYS = {
  USER: 'user_data',
  EMAIL: 'user_email',
  PASSWORD: 'user_password',
  IS_LOGGED_IN: 'is_logged_in',
  SESSION_TOKEN: 'session_token',
};

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
const isValidPassword = (password: string): boolean => {
  return password ? password.length >= 6 : false;
};

/**
 * Save user data to MMKV storage
 */
export const saveUser = (user: User): void => {
  try {
    if (!user || !user.id) {
      throw new AuthError('Invalid user data', 'INVALID_USER_DATA');
    }
    storage.set(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error saving user to MMKV:', error);
    throw new AuthError('Failed to save user data', 'SAVE_USER_FAILED');
  }
};

/**
 * Get user data from MMKV storage
 */
export const getUser = (): User | null => {
  try {
    const userData = storage.getString(KEYS.USER);
    if (!userData) {
      return null;
    }
    const parsedUser = JSON.parse(userData);
    
    // Validate user structure
    if (!parsedUser.id || !parsedUser.email || !parsedUser.name) {
      throw new AuthError('Corrupted user data', 'CORRUPTED_USER_DATA');
    }
    
    return parsedUser;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error retrieving user from MMKV:', error);
    throw new AuthError('Failed to retrieve user data', 'GET_USER_FAILED');
  }
};

/**
 * Register a new user (store email and password)
 */
export const registerUser = (email: string, password: string, name: string): User => {
  try {
    // Validate inputs
    if (!email || !email.trim()) {
      throw new AuthError('Email is required', 'EMPTY_EMAIL');
    }
    if (!isValidEmail(email)) {
      throw new AuthError('Invalid email format', 'INVALID_EMAIL_FORMAT');
    }
    if (!password) {
      throw new AuthError('Password is required', 'EMPTY_PASSWORD');
    }
    if (!isValidPassword(password)) {
      throw new AuthError('Password must be at least 6 characters', 'WEAK_PASSWORD');
    }
    if (!name || !name.trim()) {
      throw new AuthError('Name is required', 'EMPTY_NAME');
    }

    // Check if email already exists
    const existingEmail = storage.getString(KEYS.EMAIL);
    if (existingEmail === email) {
      throw new AuthError('Email already registered', 'EMAIL_ALREADY_EXISTS');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      balance: 0,
      currency: 'PHP',
      createdAt: new Date().toISOString(),
      isGuest: false,
    };

    storage.set(KEYS.EMAIL, newUser.email);
    storage.set(KEYS.PASSWORD, password);
    saveUser(newUser);
    // Don't auto-login - user needs to login manually after signup
    setLoggedIn(false);
    
    return newUser;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error registering user:', error);
    throw new AuthError('Registration failed', 'REGISTRATION_FAILED');
  }
};

/**
 * Login user by validating email and password
 */
export const loginUser = (email: string, password: string): User | null => {
  try {
    // Validate inputs
    if (!email || !email.trim()) {
      throw new AuthError('Email is required', 'EMPTY_EMAIL');
    }
    if (!password) {
      throw new AuthError('Password is required', 'EMPTY_PASSWORD');
    }

    const storedEmail = storage.getString(KEYS.EMAIL);
    const storedPassword = storage.getString(KEYS.PASSWORD);

    // Check if account exists
    if (!storedEmail || !storedPassword) {
      throw new AuthError('Account doesn\'t exist or password is incorrect', 'LOGIN_FAILED');
    }

    // Check if email matches
    const normalizedEmail = email.toLowerCase().trim();
    if (storedEmail !== normalizedEmail) {
      throw new AuthError('Account doesn\'t exist or password is incorrect', 'LOGIN_FAILED');
    }

    // Check if password is correct
    if (storedPassword !== password) {
      throw new AuthError('Account doesn\'t exist or password is incorrect', 'LOGIN_FAILED');
    }

    setLoggedIn(true);
    return getUser();
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error logging in user:', error);
    throw new AuthError('Login failed', 'LOGIN_FAILED');
  }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = (): boolean => {
  try {
    const loggedIn = storage.getBoolean(KEYS.IS_LOGGED_IN);
    return loggedIn === true;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

/**
 * Set login status
 */
export const setLoggedIn = (logged: boolean): void => {
  try {
    if (typeof logged !== 'boolean') {
      throw new AuthError('Invalid login status', 'INVALID_LOGIN_STATUS');
    }
    storage.set(KEYS.IS_LOGGED_IN, logged);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error setting login status:', error);
    throw new AuthError('Failed to update login status', 'SET_LOGIN_FAILED');
  }
};

/**
 * Logout user and clear session
 */
export const logoutUser = (): void => {
  try {
    storage.set(KEYS.IS_LOGGED_IN, false);
    storage.remove(KEYS.SESSION_TOKEN);
    storage.remove(KEYS.USER);
    storage.remove(KEYS.EMAIL);
    storage.remove(KEYS.PASSWORD);
  } catch (error) {
    console.error('Error logging out user:', error);
    throw new AuthError('Logout failed', 'LOGOUT_FAILED');
  }
};

/**
 * Clear all storage data (for testing purposes)
 */
export const clearAllStorage = (): void => {
  try {
    storage.clearAll();
    console.log('All storage cleared successfully');
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new AuthError('Failed to clear storage', 'CLEAR_STORAGE_FAILED');
  }
};

/**
 * Update user balance
 */
export const updateUserBalance = (newBalance: number): void => {
  try {
    if (typeof newBalance !== 'number' || newBalance < 0) {
      throw new AuthError('Invalid balance amount', 'INVALID_BALANCE');
    }

    const user = getUser();
    if (!user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND');
    }

    user.balance = newBalance;
    saveUser(user);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error('Error updating user balance:', error);
    throw new AuthError('Failed to update balance', 'UPDATE_BALANCE_FAILED');
  }
};

/**
 * Clear all data (for testing/reset)
 */
export const clearAllData = (): void => {
  try {
    storage.clearAll();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw new AuthError('Failed to clear data', 'CLEAR_DATA_FAILED');
  }
};
