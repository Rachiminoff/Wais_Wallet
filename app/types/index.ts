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