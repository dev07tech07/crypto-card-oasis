
import { useAuth } from '@/contexts/AuthContext';
import { useCryptoData } from './useCryptoData';
import { useTransactionsStorage } from './useTransactionsStorage';
import { useWatchlistStorage } from './useWatchlistStorage';
import type { Transaction } from '@/types/crypto';

export const useCryptoOperations = () => {
  const { user } = useAuth();
  const { cryptocurrencies, loading } = useCryptoData();
  const { transactions, pendingTransactions, setTransactions, loadSavedTransactions } = useTransactionsStorage(user?.id);
  const { watchlist, setWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStorage();

  return {
    cryptocurrencies,
    transactions,
    loading,
    watchlist,
    pendingTransactions,
    setTransactions,
    setWatchlist,
    addToWatchlist,
    removeFromWatchlist
  };
};
