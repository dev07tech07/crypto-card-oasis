
import { useState, useEffect } from 'react';
import type { Transaction } from '@/types/crypto';

export const useTransactionsStorage = (userId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Helper function to load transactions from localStorage with proper date parsing
  const loadSavedTransactions = () => {
    try {
      const savedTransactions = localStorage.getItem('cryptoTransactions');
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions);
        
        // Ensure dates are properly converted back to Date objects
        const formattedTransactions = parsedTransactions.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          // Ensure status is a valid enum value
          status: t.status === 'pending' || t.status === 'completed' || t.status === 'cancelled' 
            ? t.status 
            : 'pending'
        }));
        
        setTransactions(formattedTransactions);
        console.log('Loaded transactions:', formattedTransactions);
      } else {
        console.log('No saved transactions found in localStorage');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions from localStorage:', error);
      setTransactions([]);
    }
  };

  // Initial load of transactions
  useEffect(() => {
    loadSavedTransactions();
  }, [userId]);

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

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === 'pending'
  );
  
  return {
    transactions,
    pendingTransactions,
    setTransactions,
    loadSavedTransactions
  };
};
