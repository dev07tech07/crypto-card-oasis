
import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Cryptocurrency {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  volume24h: number;
  marketCap: number;
  image: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  status: 'pending' | 'completed' | 'cancelled';
  amount: number;
  cryptoAmount?: number;
  cryptocurrency?: string;
  cryptoSymbol?: string;
  date: Date;
  paymentDetails?: {
    cardNumber?: string;
    name?: string;
    walletAddress?: string;
    country?: string;
    phoneNumber?: string;
  };
  cancellationReason?: string;
}

interface CryptoContextType {
  cryptocurrencies: Cryptocurrency[];
  loading: boolean;
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  approveTransaction: (transactionId: string) => void;
  cancelTransaction: (transactionId: string, reason: string) => void;
  getUserTransactions: (userId: string) => Transaction[];
  addToWatchlist: (cryptoId: string) => void;
  removeFromWatchlist: (cryptoId: string) => void;
  watchlist: string[];
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: { children: React.ReactNode }) {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    // Load mock data and transactions from localStorage on initial mount
    const loadCryptoData = async () => {
      try {
        // Generate mock cryptocurrency data
        const mockCryptoData: Cryptocurrency[] = [
          {
            id: 'bitcoin',
            rank: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            price: 42000,
            priceChange1h: 0.5,
            priceChange24h: 2.3,
            priceChange7d: -1.5,
            volume24h: 28000000000,
            marketCap: 800000000000,
            image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
          },
          {
            id: 'ethereum',
            rank: 2,
            name: 'Ethereum',
            symbol: 'ETH',
            price: 2200,
            priceChange1h: -0.2,
            priceChange24h: 1.8,
            priceChange7d: 4.5,
            volume24h: 15000000000,
            marketCap: 260000000000,
            image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
          },
          {
            id: 'tether',
            rank: 3,
            name: 'Tether',
            symbol: 'USDT',
            price: 1,
            priceChange1h: 0.01,
            priceChange24h: -0.05,
            priceChange7d: 0.1,
            volume24h: 65000000000,
            marketCap: 83000000000,
            image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
          },
          {
            id: 'binancecoin',
            rank: 4,
            name: 'Binance Coin',
            symbol: 'BNB',
            price: 310,
            priceChange1h: 0.8,
            priceChange24h: -1.2,
            priceChange7d: 2.7,
            volume24h: 2100000000,
            marketCap: 48000000000,
            image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
          },
          {
            id: 'xrp',
            rank: 5,
            name: 'XRP',
            symbol: 'XRP',
            price: 0.55,
            priceChange1h: 1.2,
            priceChange24h: 3.4,
            priceChange7d: -0.7,
            volume24h: 1800000000,
            marketCap: 28000000000,
            image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
          },
          {
            id: 'cardano',
            rank: 6,
            name: 'Cardano',
            symbol: 'ADA',
            price: 0.32,
            priceChange1h: 0.3,
            priceChange24h: -2.1,
            priceChange7d: 1.8,
            volume24h: 430000000,
            marketCap: 11200000000,
            image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
          },
          {
            id: 'solana',
            rank: 7,
            name: 'Solana',
            symbol: 'SOL',
            price: 62.5,
            priceChange1h: 2.4,
            priceChange24h: 5.6,
            priceChange7d: 12.3,
            volume24h: 1500000000,
            marketCap: 26000000000,
            image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
          }
        ];

        setCryptocurrencies(mockCryptoData);

        // Load saved transactions or initialize with empty array
        const savedTransactions = localStorage.getItem('cryptoTransactions');
        if (savedTransactions) {
          // Convert string dates back to Date objects
          const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
            ...t,
            date: new Date(t.date)
          }));
          setTransactions(parsedTransactions);
        }

        // Load watchlist from localStorage
        const savedWatchlist = localStorage.getItem('cryptoWatchlist');
        if (savedWatchlist) {
          setWatchlist(JSON.parse(savedWatchlist));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading crypto data:', error);
        setLoading(false);
      }
    };

    loadCryptoData();
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cryptoTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cryptoWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === 'pending'
  );

  const addTransaction = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date()
    };
    setTransactions((prev) => [...prev, transaction]);
  };

  const approveTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status: 'completed' }
          : transaction
      )
    );

    // Find the transaction
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || !transaction.userId) return;
    
    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => u.id === transaction.userId);
    
    if (userIndex !== -1) {
      const updatedUsers = [...storedUsers];
      
      // Handle different transaction types
      if (transaction.type === 'deposit') {
        // For deposits, add the full amount to wallet
        updatedUsers[userIndex].walletBalance = (updatedUsers[userIndex].walletBalance || 0) + transaction.amount;
      } 
      else if (transaction.type === 'buy') {
        // For crypto purchases, add the crypto value minus 14% commission
        const cryptoValue = transaction.amount * 0.86; // Apply 14% commission
        updatedUsers[userIndex].walletBalance = (updatedUsers[userIndex].walletBalance || 0) + cryptoValue;
      }
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Also update the current user if they're logged in
      const currentUser = JSON.parse(localStorage.getItem('cryptoUser') || '{}');
      if (currentUser.id === transaction.userId) {
        if (transaction.type === 'deposit') {
          currentUser.walletBalance = (currentUser.walletBalance || 0) + transaction.amount;
        } else if (transaction.type === 'buy') {
          currentUser.walletBalance = (currentUser.walletBalance || 0) + transaction.amount * 0.86; // 14% commission
        }
        localStorage.setItem('cryptoUser', JSON.stringify(currentUser));
      }
    }
  };

  const cancelTransaction = (transactionId: string, reason: string) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status: 'cancelled', cancellationReason: reason }
          : transaction
      )
    );
  };

  const getUserTransactions = (userId: string) => {
    return transactions.filter((transaction) => transaction.userId === userId);
  };

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
