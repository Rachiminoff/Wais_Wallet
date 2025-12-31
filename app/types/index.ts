export interface Packet {
  id: number;
  name: string;
  amount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  currency: string;
  createdAt: Date;
  isGuest?: boolean;
}

export interface FormattedAmountDisplay {
  symbol: string;
  formatted: string;
  full: string;
}

export interface BalanceUpdate {
  type: 'add' | 'subtract';
  amount: number;
  description: string;
  timestamp: Date;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string; // MMKV-friendly
}

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

const KEYS = {
  USER: 'user_data',
  POCKETS: 'pockets_data',
  SAVINGS: 'savings_data', // 👈 NEW
  EMAIL: 'user_email',
  PASSWORD: 'user_password',
  IS_LOGGED_IN: 'is_logged_in',
  STATS: 'stats_records',
};
