// Types shared between frontend and backend

// Entity interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Fund {
  id: string;
  name: string;
  description: string;
  totalCapital: number;
  vintage: number;
}

export interface Portfolio {
  id: string;
  companyName: string;
  investmentDate: string;
  investmentAmount: number;
  ownership: number;
  fundId: string;
}

// Common utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateOwnershipPercentage = (ownership: number): string => {
  return `${(ownership * 100).toFixed(2)}%`;
};

// Constants
export const DEFAULT_CURRENCY = 'USD';
export const DATE_FORMAT = 'YYYY-MM-DD';