import { createMMKV } from 'react-native-mmkv';
import { Packet, User } from '../types';

const storage = createMMKV();

/* ====================
   STORAGE KEYS
==================== */
const KEYS = {
  USER: 'user_data',
  POCKETS: 'pockets_data',
  EMAIL: 'user_email',
  PASSWORD: 'user_password',
  IS_LOGGED_IN: 'is_logged_in',
};

/* ====================
   USER
==================== */
export const getUser = (): User | null => {
  const data = storage.getString(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (user: User): void => {
  storage.set(KEYS.USER, JSON.stringify(user));
};

/* ====================
   SAFE BALANCE (TOP-UP)
==================== */
export const addToBalance = (amount: number): void => {
  if (amount <= 0) throw new Error('Invalid amount');

  const user = getUser();
  if (!user) throw new Error('No user');

  user.balance += amount;
  saveUser(user);
};

/* ====================
   POCKETS
==================== */
export const getPockets = (): Packet[] => {
  const data = storage.getString(KEYS.POCKETS);
  return data ? JSON.parse(data) : [];
};

export const savePockets = (pockets: Packet[]): void => {
  storage.set(KEYS.POCKETS, JSON.stringify(pockets));
};

/* ====================
   CREATE POCKET
   SAFE → POCKET
==================== */
export const createPocket = (
  name: string,
  amount: number
): void => {
  const user = getUser();
  if (!user) throw new Error('No user');

  if (amount <= 0) throw new Error('Invalid amount');
  if (user.balance < amount)
    throw new Error('Insufficient safe balance');

  const pockets = getPockets();

  const newPocket: Packet = {
    id: `pocket_${Date.now()}`,
    name,
    amount,
  };

  savePockets([...pockets, newPocket]);

  // MOVE money
  user.balance -= amount;
  saveUser(user);
};

/* ====================
   ADD FUNDS → POCKET
   (TOP-UP)
==================== */
export const addFundsToPocket = (
  pocketId: string,
  amount: number
): void => {
  if (amount <= 0) throw new Error('Invalid amount');

  const pockets = getPockets();
  const index = pockets.findIndex(
    p => p.id === pocketId
  );

  if (index === -1)
    throw new Error('Pocket not found');

  // ADD money (no SAFE change)
  pockets[index].amount += amount;

  savePockets(pockets);
};

/* ====================
   UPDATE POCKET
==================== */
export const updatePocket = (
  pocketId: string,
  newName: string,
  newAmount: number
): void => {
  const user = getUser();
  if (!user) throw new Error('No user');

  if (newAmount < 0)
    throw new Error('Invalid amount');

  const pockets = getPockets();
  const index = pockets.findIndex(
    p => p.id === pocketId
  );

  if (index === -1)
    throw new Error('Pocket not found');

  const oldAmount = pockets[index].amount;
  const diff = newAmount - oldAmount;

  // Need money from SAFE
  if (diff > 0 && user.balance < diff)
    throw new Error('Insufficient safe balance');

  pockets[index] = {
    ...pockets[index],
    name: newName,
    amount: newAmount,
  };

  // Reallocate only
  user.balance -= diff;

  savePockets(pockets);
  saveUser(user);
};

/* ====================
   DELETE POCKET
==================== */
export const deletePocket = (
  pocketId: string
): void => {
  const user = getUser();
  if (!user) throw new Error('No user');

  const pockets = getPockets();
  const pocket = pockets.find(
    p => p.id === pocketId
  );

  if (!pocket)
    throw new Error('Pocket not found');

  // Return allocation
  user.balance += pocket.amount;

  saveUser(user);
  savePockets(
    pockets.filter(p => p.id !== pocketId)
  );
};

/* ====================
   TRANSFER
   (NO MONEY CREATED)
==================== */
export const transferFunds = (
  fromPocketId: string,
  amount: number
): void => {
  const user = getUser();
  if (!user) throw new Error('No user');

  if (amount <= 0)
    throw new Error('Invalid amount');

  const pockets = getPockets();
  const index = pockets.findIndex(
    p => p.id === fromPocketId
  );

  if (index === -1)
    throw new Error('Pocket not found');

  if (pockets[index].amount < amount)
    throw new Error('Insufficient funds');

  pockets[index].amount -= amount;
  user.balance += amount;

  savePockets(pockets);
  saveUser(user);
};

/* ====================
   AUTH
==================== */
export const registerUser = (
  email: string,
  password: string,
  name: string
): User => {
  const existing = storage.getString(KEYS.EMAIL);
  if (existing === email.toLowerCase())
    throw new Error('Email already registered');

  const user: User = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase(),
    balance: 15000,
    currency: 'PHP',
    createdAt: new Date().toISOString(),
    isGuest: false,
  };

  storage.set(KEYS.EMAIL, user.email);
  storage.set(KEYS.PASSWORD, password);
  storage.set(KEYS.IS_LOGGED_IN, false);

  saveUser(user);
  savePockets([]);

  return user;
};

export const loginUser = (
  email: string,
  password: string
): User => {
  const storedEmail = storage.getString(KEYS.EMAIL);
  const storedPassword = storage.getString(KEYS.PASSWORD);

  if (
    storedEmail !== email.toLowerCase() ||
    storedPassword !== password
  ) {
    throw new Error('Invalid credentials');
  }

  storage.set(KEYS.IS_LOGGED_IN, true);
  return getUser()!;
};

export const logoutUser = (): void => {
  storage.set(KEYS.IS_LOGGED_IN, false);
};

export const isLoggedIn = (): boolean => {
  return storage.getBoolean(KEYS.IS_LOGGED_IN) === true;
};

/* ====================
   DEV
==================== */
export const clearAllData = (): void => {
  storage.clearAll();
};
