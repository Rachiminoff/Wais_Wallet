import { createMMKV } from 'react-native-mmkv';
import { Packet, User } from '../types';

// Initialize MMKV storage
const storage = createMMKV();

// --------------------
// STORAGE KEYS
// --------------------
const KEYS = {
  USER: 'user_data',
  POCKETS: 'pockets_data',
  EMAIL: 'user_email',
  PASSWORD: 'user_password',
  IS_LOGGED_IN: 'is_logged_in',
};

// --------------------
// USER HELPERS
// --------------------
export const getUser = (): User | null => {
  const data = storage.getString(KEYS.USER);
  if (!data) return null;
  return JSON.parse(data);
};

export const saveUser = (user: User) => {
  storage.set(KEYS.USER, JSON.stringify(user));
};

export const addToBalance = (amount: number) => {
  const user = getUser();
  if (!user) return;
  user.balance += amount;
  saveUser(user);
};

export const updateUserBalance = (newBalance: number) => {
  const user = getUser();
  if (!user) return;
  user.balance = newBalance;
  saveUser(user);
};

// --------------------
// POCKET HELPERS
// --------------------
export const getPockets = (): Packet[] => {
  const data = storage.getString(KEYS.POCKETS);
  if (!data) return [];
  return JSON.parse(data);
};

export const savePockets = (pockets: Packet[]) => {
  storage.set(KEYS.POCKETS, JSON.stringify(pockets));
};

export const addToPocket = (pocketId: string, amount: number) => {
  const pockets = getPockets();
  const idx = pockets.findIndex((p) => p.id === pocketId);
  if (idx === -1) return;

  pockets[idx].amount += amount;
  savePockets(pockets);

  // Subtract from safe balance
  const user = getUser();
  if (!user) return;
  if (user.balance < amount) return; // prevent negative
  user.balance -= amount;
  saveUser(user);
};

// --------------------
// AUTH HELPERS
// --------------------
export const registerUser = (email: string, password: string, name: string): User => {
  const existingEmail = storage.getString(KEYS.EMAIL);
  if (existingEmail === email) {
    throw new Error('Email already registered');
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase(),
    balance: 15000, // default safe balance
    currency: 'PHP',
    createdAt: new Date().toISOString(),
    isGuest: false,
  };

  storage.set(KEYS.EMAIL, email.toLowerCase());
  storage.set(KEYS.PASSWORD, password);
  saveUser(newUser);
  storage.set(KEYS.IS_LOGGED_IN, false); // user must login manually

  return newUser;
};

export const loginUser = (email: string, password: string): User | null => {
  const storedEmail = storage.getString(KEYS.EMAIL);
  const storedPassword = storage.getString(KEYS.PASSWORD);

  if (storedEmail !== email.toLowerCase() || storedPassword !== password) {
    throw new Error('Email or password incorrect');
  }

  storage.set(KEYS.IS_LOGGED_IN, true);
  return getUser();
};

export const logoutUser = () => {
  storage.set(KEYS.IS_LOGGED_IN, false);
};

export const isLoggedIn = (): boolean => {
  return storage.getBoolean(KEYS.IS_LOGGED_IN) || false;
};

// --------------------
// CLEAR STORAGE
// --------------------
export const clearAllData = () => {
  storage.clearAll();
};
