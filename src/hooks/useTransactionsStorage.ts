
import { useEffect } from 'react';
import { useLoadTransactions } from './transaction/useLoadTransactions';
import { useSaveTransactions } from './transaction/useSaveTransactions';
import { useFilterTransactions } from './transaction/useFilterTransactions';
import type { Transaction } from '@/types/crypto';

export const useTransactionsStorage = (userId?: string) => {
  const { transactions, setTransactions, loadSavedTransactions } = useLoadTransactions();
  const { pendingTransactions } = useFilterTransactions(transactions);
  
  // Hook up the save functionality
  useSaveTransactions(transactions);

  // Initial load of transactions
  useEffect(() => {
    loadSavedTransactions();
  }, [userId]);

  return {
    transactions,
    pendingTransactions,
    setTransactions,
    loadSavedTransactions
  };
};
