
import { useEffect } from 'react';
import type { Transaction } from '@/types/crypto';

export const useSaveTransactions = (transactions: Transaction[]) => {
  // Save transactions to localStorage on any change
  useEffect(() => {
    if (transactions.length > 0) {
      try {
        localStorage.setItem('cryptoTransactions', JSON.stringify(transactions));
        console.log('Saved transactions to localStorage:', transactions);
      } catch (error) {
        console.error('Error saving transactions to localStorage:', error);
      }
    }
  }, [transactions]);
};
