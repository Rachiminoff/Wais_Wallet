import { BalanceUpdate, FormattedAmountDisplay, Packet, User } from '../types';

// ====================
// DATA MANAGEMENT
// ====================

export const getCurrentUser = async (): Promise<User> => {
  return {
    id: 'user_1',
    name: 'JUANITA',
    email: 'jaunita.batumbakal@gmail.com',
    balance: 0,
    currency: 'PHP',
    createdAt: new Date(),
  };
};

export const getPacketsForUser = async (userId: string): Promise<Packet[]> => {
  return [
    { id: 1, name: 'Rent', amount: 2000.00 },      // Changed from 0
    { id: 2, name: 'Bills', amount: 1000.00 },     // Changed from 0
    { id: 3, name: 'Grocery', amount: 1500.00 },   // Changed from 1000
    { id: 4, name: 'Pang-Gala', amount: 500.00 },  // Changed from 0
    { id: 5, name: 'Transportation', amount: 700.00 },
    { id: 6, name: 'Savings', amount: 3000.00 },
  ];
};

// ====================
// BALANCE CALCULATIONS
// ====================

export const calculateAllocatedAmount = (packets: Packet[]): number => {
  return packets.reduce((sum, packet) => sum + packet.amount, 0);
};

export const calculateSafeBalance = (totalBalance: number, packets: Packet[]): number => {
  const allocatedAmount = calculateAllocatedAmount(packets);
  return totalBalance - allocatedAmount;
};

export const calculateBalances = (
  totalBalance: number,
  packets: Packet[]
): { safeBalance: number; totalBalance: number; allocatedAmount: number } => {
  const allocatedAmount = calculateAllocatedAmount(packets);
  const safeBalance = totalBalance - allocatedAmount;
  
  return { safeBalance, totalBalance, allocatedAmount };
};

// ====================
// BALANCE OPERATIONS
// ====================

export const updateTotalBalance = (
  currentTotalBalance: number,
  operation: 'add' | 'subtract',
  amount: number
): { newTotalBalance: number; isValid: boolean; message?: string } => {
  
  if (amount <= 0) {
    return { 
      newTotalBalance: currentTotalBalance, 
      isValid: false, 
      message: 'Amount must be greater than 0' 
    };
  }
  
  if (operation === 'subtract' && amount > currentTotalBalance) {
    return { 
      newTotalBalance: currentTotalBalance, 
      isValid: false, 
      message: 'Cannot subtract more than total balance' 
    };
  }
  
  const newTotalBalance = operation === 'add' 
    ? currentTotalBalance + amount 
    : currentTotalBalance - amount;
    
  return { 
    newTotalBalance, 
    isValid: true 
  };
};

export const validateAmount = (amountStr: string): { isValid: boolean; amount?: number; message?: string } => {
  const amount = parseFloat(amountStr);
  
  if (isNaN(amount)) {
    return { isValid: false, message: 'Please enter a valid number' };
  }
  
  if (amount <= 0) {
    return { isValid: false, message: 'Amount must be greater than 0' };
  }
  
  if (!/^\d+(\.\d{1,2})?$/.test(amountStr)) {
    return { isValid: false, message: 'Maximum 2 decimal places allowed' };
  }
  
  return { isValid: true, amount };
};

// ====================
// FORMATTING UTILITIES
// ====================

export const formatCurrencyDisplay = (
  amount: number, 
  currency: string = 'PHP'
): FormattedAmountDisplay => {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const symbol = '₱';
  
  return {
    symbol,
    formatted: formatted,
    full: `${symbol}${formatted}`,
  };
};

export const formatInputAmount = (amountStr: string): string => {
  // Remove non-numeric characters except decimal point
  let cleaned = amountStr.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 2 decimal places
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  return cleaned;
};

// ====================
// TRANSACTION HISTORY
// ====================

export const createTransaction = (
  type: 'add' | 'subtract',
  amount: number,
  description?: string
): BalanceUpdate => {
  return {
    type,
    amount,
    description: description || `${type === 'add' ? 'Added' : 'Subtracted'} ${formatCurrencyDisplay(amount, 'PHP').full}`,
    timestamp: new Date(),
  };
};