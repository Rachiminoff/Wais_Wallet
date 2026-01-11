import { createMMKV } from 'react-native-mmkv';
import { Packet, User } from '../types';

/* ====================
   TYPES
==================== */
export interface StatsRecord {
  totalBalanceAllTime: number;
  totalSpentAllTime: number;
  mostCostlyPocket?: {
    id: string;
    name: string;
    amount: number;
  };
  mostExpensiveSavingsGoal?: {
    id: string;
    name: string;
    targetAmount: number;
  };
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

/* ====================
   TRANSACTIONS
==================== */
export type TransactionType =
  | 'ADD_FUNDS'
  | 'SUBTRACT_FUNDS'
  | 'POCKET_CREATE'
  | 'POCKET_DELETE'
  | 'POCKET_ADD_FUNDS'
  | 'POCKET_TO_SAFE'
  | 'SAVINGS_CREATE'
  | 'SAVINGS_ADD'
  | 'SAVINGS_DELETE'
  | 'SAVINGS_EDIT';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: string;
}

/* ====================
   BACKUP
==================== */
export interface AppBackup {
  version: number;
  exportedAt: string;
  data: {
    user: User | null;
    pockets: Packet[];
    savings: SavingsGoal[];
    transactions: Transaction[];
    stats: StatsRecord;
    email: string | null;
    password: string | null;
  };
}

/* ====================
   MMKV INSTANCE
==================== */
const storage = createMMKV();

/* ====================
   STORAGE KEYS
==================== */
const KEYS = {
  USER: 'user_data',
  POCKETS: 'pockets_data',
  SAVINGS: 'savings_data',
  STATS: 'stats_records',
  EMAIL: 'user_email',
  PASSWORD: 'user_password',
  IS_LOGGED_IN: 'is_logged_in',
  TRANSACTIONS: 'transactions_data',
  EXPENSES: 'expenses_data',
};

/* ====================
   TRANSACTIONS
==================== */
export const getTransactions = (): Transaction[] => {
  const data = storage.getString(KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

const saveTransactions = (txs: Transaction[]): void => {
  storage.set(KEYS.TRANSACTIONS, JSON.stringify(txs));
};

const recordTransaction = (
  type: TransactionType,
  amount: number,
  description: string
): void => {
  const txs = getTransactions();

  const tx: Transaction = {
    id: `tx_${Date.now()}`,
    type,
    amount,
    description,
    createdAt: new Date().toISOString(),
  };

  saveTransactions([tx, ...txs]);
};

/* ====================
   STATS
==================== */
export const getStats = (): StatsRecord => {
  const data = storage.getString(KEYS.STATS);
  return data
    ? JSON.parse(data)
    : { totalBalanceAllTime: 0, totalSpentAllTime: 0 };
};

const saveStats = (stats: StatsRecord): void => {
  storage.set(KEYS.STATS, JSON.stringify(stats));
};

const bumpTotalBalance = (amount: number): void => {
  const stats = getStats();
  stats.totalBalanceAllTime += amount;
  saveStats(stats);
};

const bumpTotalSpent = (amount: number): void => {
  const stats = getStats();
  stats.totalSpentAllTime += amount;
  saveStats(stats);
};

const updateMostCostlyPocket = (
  id: string,
  name: string,
  amount: number
): void => {
  const stats = getStats();
  if (!stats.mostCostlyPocket || amount > stats.mostCostlyPocket.amount) {
    stats.mostCostlyPocket = { id, name, amount };
    saveStats(stats);
  }
};

const updateMostExpensiveSavings = (
  id: string,
  name: string,
  targetAmount: number
): void => {
  const stats = getStats();
  if (
    !stats.mostExpensiveSavingsGoal ||
    targetAmount > stats.mostExpensiveSavingsGoal.targetAmount
  ) {
    stats.mostExpensiveSavingsGoal = { id, name, targetAmount };
    saveStats(stats);
  }
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
   TOTAL BALANCE (SOURCE OF TRUTH)
==================== */
export const getCurrentTotalBalance = (): number => {
  const user = getUser();
  const pockets = getPockets();
  const savings = getSavings();

  return (
    (user?.balance ?? 0) +
    pockets.reduce((sum, p) => sum + (p.amount || 0), 0) +
    savings.reduce((sum, s) => sum + (s.currentAmount || 0), 0)
  );
};

/* ====================
   SAFE BALANCE
==================== */
export const addToBalance = (amount: number): void => {
  if (amount <= 0) throw new Error('Invalid amount');

  const user = getUser();
  if (!user) throw new Error('No user');

  user.balance += amount;
  saveUser(user);

  bumpTotalBalance(amount);
  recordTransaction('ADD_FUNDS', amount, 'Added funds to safe balance');
};

/* ====================
   SUBTRACT FUNDS (SAFE + TOTAL VALIDATION)
==================== */
export const subtractFromBalance = (amount: number): void => {
  if (amount <= 0) throw new Error('Invalid amount');

  const user = getUser();
  if (!user) throw new Error('No user');

  const pockets = getPockets();
  const savings = getSavings();

  const totalPocketBalance = pockets.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  const totalSavingsBalance = savings.reduce(
    (sum, s) => sum + (s.currentAmount || 0),
    0
  );

  const totalAvailable =
    user.balance + totalPocketBalance + totalSavingsBalance;

  if (amount > totalAvailable)
    throw new Error('You cannot subtract this amount because it would cause your total balance to be lower than the combined amount in your pockets and savings.'
);
  if (amount > user.balance)
    throw new Error('Insufficient safe balance');

  user.balance -= amount;
  saveUser(user);

  bumpTotalSpent(amount);

  recordTransaction(
    'SUBTRACT_FUNDS',
    amount,
    'Spent from safe balance'
  );
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
==================== */
export const createPocket = (name: string, amount: number, deductFromSafeBalance: boolean = true): void => {
  const user = getUser();
  if (!user) throw new Error('No user');
  if (amount < 0) throw new Error('Invalid amount');
  if (deductFromSafeBalance && user.balance < amount) throw new Error('Insufficient safe balance');

  const pockets = getPockets();
  const newPocket: Packet = {
    id: `pocket_${Date.now()}`,
    name: name.trim(),
    amount,
  };

  savePockets([...pockets, newPocket]);

  if (deductFromSafeBalance && amount > 0) {
    user.balance -= amount;
    saveUser(user);
  }

  updateMostCostlyPocket(newPocket.id, newPocket.name, amount);
  
  if (amount > 0) {
    recordTransaction(
      'POCKET_CREATE',
      amount,
      deductFromSafeBalance 
        ? `Created pocket "${newPocket.name}" from Safe Balance`
        : `Created pocket "${newPocket.name}"`
    );
  } else {
    recordTransaction(
      'POCKET_CREATE',
      0,
      `Created empty pocket "${newPocket.name}"`
    );
  }
};

/* ====================
   ADD FUNDS → POCKET
==================== */
export const addFundsToPocket = (
  pocketId: string,
  amount: number
): void => {
  if (amount <= 0) throw new Error('Invalid amount');

  const pockets = getPockets();
  const index = pockets.findIndex(p => p.id === pocketId);
  if (index === -1) throw new Error('Pocket not found');

  pockets[index].amount += amount;
  savePockets(pockets);

  updateMostCostlyPocket(
    pockets[index].id,
    pockets[index].name,
    pockets[index].amount
  );

  recordTransaction(
    'POCKET_ADD_FUNDS',
    amount,
    `Allocated to ${pockets[index].name} from Safe Balance`
  );
};

export const allocateFromSafeToPocket = (
  pocketId: string,
  amount: number
): void => {
  if (amount <= 0) throw new Error('Invalid amount');

  const user = getUser();
  if (!user) throw new Error('No user');
  if (user.balance < amount) throw new Error('Insufficient safe balance');

  const pockets = getPockets();
  const index = pockets.findIndex(p => p.id === pocketId);
  if (index === -1) throw new Error('Pocket not found');

  pockets[index].amount += amount;
  user.balance -= amount;

  savePockets(pockets);
  saveUser(user);

  updateMostCostlyPocket(
    pockets[index].id,
    pockets[index].name,
    pockets[index].amount
  );

  recordTransaction(
    'POCKET_ADD_FUNDS',
    amount,
    `Allocated to "${pockets[index].name}" from Safe Balance`
  );
};

/* ====================
   UPDATE POCKET
==================== */
export const updatePocket = (
  pocketId: string,
  newName: string,
  newAmount: number,
  adjustSafeBalance = false
): void => {
  const user = getUser();
  if (!user) throw new Error('No user');
  if (newAmount < 0) throw new Error('Invalid amount');

  const pockets = getPockets();
  const index = pockets.findIndex(p => p.id === pocketId);
  if (index === -1) throw new Error('Pocket not found');

  const oldName = pockets[index].name;
  const oldAmount = pockets[index].amount;
  const diff = newAmount - oldAmount;
  const nameChanged = oldName !== newName.trim();
  const amountChanged = diff !== 0;

  if (adjustSafeBalance) {
    if (diff > 0 && user.balance < diff)
      throw new Error('Insufficient safe balance');

    user.balance -= diff; // diff positive deducts, negative credits back
  }

  pockets[index] = {
    ...pockets[index],
    name: newName.trim(),
    amount: newAmount,
  };

  savePockets(pockets);
  saveUser(user);

  updateMostCostlyPocket(
    pockets[index].id,
    pockets[index].name,
    newAmount
  );

  // Record transaction based on what changed
  if (nameChanged && amountChanged) {
    const safeBalanceText = adjustSafeBalance && diff !== 0 
      ? (diff > 0 ? ' from Safe Balance' : ' transferred to Safe Balance')
      : '';
    recordTransaction(
      'POCKET_ADD_FUNDS',
      Math.abs(diff),
      `Edited pocket "${oldName}" → "${newName}" (${diff > 0 ? '+' : '-'}₱${Math.abs(diff).toFixed(2)})${safeBalanceText}`
    );
  } else if (nameChanged) {
    recordTransaction(
      'POCKET_ADD_FUNDS',
      0,
      `Renamed pocket "${oldName}" → "${newName}"`
    );
  } else if (amountChanged) {
    const safeBalanceText = adjustSafeBalance 
      ? (diff > 0 ? ' from Safe Balance' : ' transferred to Safe Balance')
      : '';
    recordTransaction(
      'POCKET_ADD_FUNDS',
      Math.abs(diff),
      `Edited pocket "${newName}" (${diff > 0 ? '+' : '-'}₱${Math.abs(diff).toFixed(2)})${safeBalanceText}`
    );
  }
};

/* ====================
   DELETE POCKET
==================== */
export const deletePocket = (pocketId: string): void => {
  const user = getUser();
  if (!user) throw new Error('No user');

  const pockets = getPockets();
  const pocket = pockets.find(p => p.id === pocketId);
  if (!pocket) throw new Error('Pocket not found');

  user.balance += pocket.amount;
  saveUser(user);

  bumpTotalSpent(pocket.amount);
  savePockets(pockets.filter(p => p.id !== pocketId));

  recordTransaction(
    'POCKET_DELETE',
    pocket.amount,
    `Deleted pocket "${pocket.name}"`
  );
};

/* ====================
   TRANSFER POCKET → SAFE
==================== */
export const transferFunds = (
  fromPocketId: string,
  amount: number
): void => {
  const user = getUser();
  if (!user) throw new Error('No user');
  if (amount <= 0) throw new Error('Invalid amount');

  const pockets = getPockets();
  const index = pockets.findIndex(p => p.id === fromPocketId);
  if (index === -1) throw new Error('Pocket not found');
  if (pockets[index].amount < amount)
    throw new Error('Insufficient funds');

  pockets[index].amount -= amount;
  user.balance += amount;

  savePockets(pockets);
  saveUser(user);

  recordTransaction(
    'POCKET_TO_SAFE',
    amount,
    `Transferred from "${pockets[index].name}" to safe`
  );
};

/* ====================
   EXPENSES
==================== */
export interface Expense {
  id: string;
  amount: number;
  pocketId: string;
  pocketName: string;
  date: string;
  note?: string;
  createdAt: string;
}

export const getExpenses = (): Expense[] => {
  const data = storage.getString(KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

const saveExpenses = (expenses: Expense[]): void => {
  storage.set(KEYS.EXPENSES, JSON.stringify(expenses));
};

export const addExpense = (
  amount: number,
  pocketId: string,
  pocketName: string,
  date: Date,
  note?: string
): void => {
  if (amount <= 0) throw new Error('Invalid amount');

  const user = getUser();
  if (!user) throw new Error('No user');

  // Deduct from safe balance or pocket
  if (pocketId === 'safe_balance') {
    if (user.balance < amount) throw new Error('Insufficient safe balance');
    user.balance -= amount;
    saveUser(user);
  } else {
    const pockets = getPockets();
    const index = pockets.findIndex(p => p.id.toString() === pocketId);
    if (index === -1) throw new Error('Pocket not found');
    if (pockets[index].amount < amount) throw new Error('Insufficient pocket balance');
    
    pockets[index].amount -= amount;
    savePockets(pockets);
  }

  const expenses = getExpenses();
  const newExpense: Expense = {
    id: `expense_${Date.now()}`,
    amount,
    pocketId,
    pocketName,
    date: date.toISOString(),
    note,
    createdAt: new Date().toISOString(),
  };

  saveExpenses([newExpense, ...expenses]);
  bumpTotalSpent(amount);

  recordTransaction(
    'SUBTRACT_FUNDS',
    amount,
    `Expense from ${pocketName}${note ? `: ${note}` : ''}`
  );
};

/* ====================
   SAVINGS
==================== */
export const getSavings = (): SavingsGoal[] => {
  const data = storage.getString(KEYS.SAVINGS);
  return data ? JSON.parse(data) : [];
};

export const saveSavings = (savings: SavingsGoal[]): void => {
  storage.set(KEYS.SAVINGS, JSON.stringify(savings));
};

/* ====================
   CREATE SAVINGS GOAL
==================== */
export const createSavingsGoal = (
  name: string,
  targetAmount: number,
  startingAmount: number
): void => {
  const user = getUser();
  if (!user) throw new Error('No user');
  if (targetAmount <= 0) throw new Error('Invalid target');
  if (startingAmount < 0) throw new Error('Invalid amount');
  if (user.balance < startingAmount)
    throw new Error('Insufficient safe balance');

  const savings = getSavings();

  const newGoal: SavingsGoal = {
    id: `savings_${Date.now()}`,
    name: name.trim(),
    targetAmount,
    currentAmount: startingAmount,
    createdAt: new Date().toISOString(),
  };

  saveSavings([...savings, newGoal]);

  user.balance -= startingAmount;
  saveUser(user);

  updateMostExpensiveSavings(
    newGoal.id,
    newGoal.name,
    newGoal.targetAmount
  );

  recordTransaction(
    'SAVINGS_CREATE',
    startingAmount,
    `Created savings goal "${newGoal.name}"`
  );
};

/* ====================
   ADD TO SAVINGS
==================== */
export const addToSavings = (
  savingsId: string,
  amount: number
): void => {
  if (amount <= 0) throw new Error('Invalid amount');

  const user = getUser();
  if (!user) throw new Error('No user');
  if (user.balance < amount)
    throw new Error('Insufficient safe balance');

  const savings = getSavings();
  const index = savings.findIndex(s => s.id === savingsId);
  if (index === -1) throw new Error('Savings goal not found');

  savings[index].currentAmount += amount;
  saveSavings(savings);

  user.balance -= amount;
  saveUser(user);

  recordTransaction(
    'SAVINGS_ADD',
    amount,
    `Added to savings "${savings[index].name}"`
  );
};

/* ====================
   UPDATE SAVINGS GOAL
==================== */
export const updateSavingsGoal = (
  savingsId: string,
  newName: string,
  newTargetAmount: number
): void => {
  if (newTargetAmount <= 0)
    throw new Error('Invalid target amount');

  const savings = getSavings();
  const index = savings.findIndex(s => s.id === savingsId);
  if (index === -1) throw new Error('Savings goal not found');

  savings[index] = {
    ...savings[index],
    name: newName.trim(),
    targetAmount: newTargetAmount,
  };

  saveSavings(savings);

  updateMostExpensiveSavings(
    savings[index].id,
    savings[index].name,
    newTargetAmount
  );
};

/* ====================
   DELETE SAVINGS GOAL
==================== */
export const deleteSavingsGoal = (
  savingsId: string
): void => {
  const user = getUser();
  if (!user) throw new Error('No user');

  const savings = getSavings();
  const goal = savings.find(s => s.id === savingsId);
  if (!goal) throw new Error('Savings goal not found');

  user.balance += goal.currentAmount;
  saveUser(user);

  bumpTotalSpent(goal.currentAmount);
  saveSavings(savings.filter(s => s.id !== savingsId));

  recordTransaction(
    'SAVINGS_DELETE',
    goal.currentAmount,
    `Deleted savings "${goal.name}"`
  );
};

/* ====================
   UPDATE SAVINGS AMOUNT
==================== */
export const updateSavingsAmount = (
  savingsId: string,
  newAmount: number
): void => {
  if (newAmount < 0) throw new Error('Invalid amount');

  const user = getUser();
  if (!user) throw new Error('No user');

  const savings = getSavings();
  const index = savings.findIndex(s => s.id === savingsId);
  if (index === -1) throw new Error('Savings goal not found');

  const diff = newAmount - savings[index].currentAmount;
  if (diff > 0 && user.balance < diff)
    throw new Error('Insufficient safe balance');

  savings[index].currentAmount = newAmount;
  saveSavings(savings);

  user.balance -= diff;
  saveUser(user);

  recordTransaction(
    'SAVINGS_EDIT',
    Math.abs(diff),
    `Adjusted savings "${savings[index].name}"`
  );
};

/* ====================
   AUTH
==================== */
export const registerUser = (
  email: string,
  password: string,
  name: string
): User => {
  if (storage.getString(KEYS.EMAIL))
    throw new Error('Email already registered');

  const user: User = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase(),
    balance: 15000,
    currency: 'PHP',
    createdAt: new Date(),
    isGuest: false,
  };

  storage.set(KEYS.EMAIL, user.email);
  storage.set(KEYS.PASSWORD, password);
  storage.set(KEYS.IS_LOGGED_IN, false);

  saveUser(user);
  savePockets([]);
  saveSavings([]);
  saveTransactions([]);
  saveStats({
    totalBalanceAllTime: user.balance,
    totalSpentAllTime: 0,
  });

  return user;
};

export const loginUser = (
  email: string,
  password: string
): User => {
  if (
    storage.getString(KEYS.EMAIL) !== email.toLowerCase() ||
    storage.getString(KEYS.PASSWORD) !== password
  )
    throw new Error('Invalid credentials');

  storage.set(KEYS.IS_LOGGED_IN, true);
  return getUser()!;
};

export const logoutUser = (): void => {
  storage.set(KEYS.IS_LOGGED_IN, false);
};

export const isLoggedIn = (): boolean =>
  storage.getBoolean(KEYS.IS_LOGGED_IN) === true;

/* ====================
   FUN STATS
==================== */
export const getFunStats = () => {
  const stats = getStats();
  const user = getUser();
  const pockets = getPockets();
  const savings = getSavings();

  return {
    ...stats,
    currentTotalBalance:
      (user?.balance ?? 0) +
      pockets.reduce((s, p) => s + p.amount, 0) +
      savings.reduce((s, g) => s + g.currentAmount, 0),
  };
};

/* ====================
   DEV
==================== */
export const clearAllData = (): void => {
  storage.clearAll();
};

export const resetSafeBalance = (): void => {
  const user = getUser();
  if (!user) throw new Error('No user');
  user.balance = 0;
  saveUser(user);
};

export const resetAllPockets = (): void => {
  savePockets([]);
};

export const resetAllSavings = (): void => {
  saveSavings([]);
};

/* ====================
   EXPORT / IMPORT
==================== */
export const exportAppData = (): string => {
  const backup: AppBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      user: getUser(),
      pockets: getPockets(),
      savings: getSavings(),
      transactions: getTransactions(),
      stats: getStats(),
      email: storage.getString(KEYS.EMAIL),
      password: storage.getString(KEYS.PASSWORD),
    },
  };

  return JSON.stringify(backup, null, 2);
};

export const importAppData = (json: string): void => {
  let parsed: AppBackup;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid backup file');
  }

  if (!parsed?.data || parsed.version !== 1)
    throw new Error('Unsupported backup format');

  storage.clearAll();

  if (parsed.data.email)
    storage.set(KEYS.EMAIL, parsed.data.email);
  if (parsed.data.password)
    storage.set(KEYS.PASSWORD, parsed.data.password);

  storage.set(KEYS.IS_LOGGED_IN, true);

  if (parsed.data.user)
    saveUser(parsed.data.user);

  savePockets(parsed.data.pockets ?? []);
  saveSavings(parsed.data.savings ?? []);
  saveTransactions(parsed.data.transactions ?? []);
  saveStats(parsed.data.stats ?? {
    totalBalanceAllTime: 0,
    totalSpentAllTime: 0,
  });
};
