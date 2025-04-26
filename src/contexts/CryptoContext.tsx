
import React, { createContext, useContext } from 'react';
import { useCryptoOperations } from '@/hooks/useCryptoOperations';
import { useTransactionOperations } from '@/hooks/useTransactionOperations';
import type { CryptoContextType } from '@/types/crypto';

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: { children: React.ReactNode }) {
  const {
    cryptocurrencies,
    transactions,
    loading,
    watchlist,
    setTransactions,
    setWatchlist
  } = useCryptoOperations();

  const {
    addTransaction,
    approveTransaction,
    cancelTransaction,
    getUserTransactions
  } = useTransactionOperations(transactions, setTransactions);

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === 'pending'
  );

  const addToWatchlist = (cryptoId: string) => {
    if (!watchlist.includes(cryptoId)) {
      setWatchlist((prev) => [...prev, cryptoId]);
    }
  };

  const removeFromWatchlist = (cryptoId: string) => {
    setWatchlist((prev) => prev.filter(id => id !== cryptoId));
  };

  const value = {
    cryptocurrencies,
    loading,
    transactions,
    pendingTransactions,
    addTransaction,
    approveTransaction,
    cancelTransaction,
    getUserTransactions,
    addToWatchlist,
    removeFromWatchlist,
    watchlist
  };

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
}

export const useCrypto = (): CryptoContextType => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};
