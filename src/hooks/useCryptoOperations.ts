import { useState, useEffect } from 'react';
import type { Cryptocurrency, Transaction } from '../types/crypto';

export const useCryptoOperations = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
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

        // Load saved transactions
        const savedTransactions = localStorage.getItem('cryptoTransactions');
        if (savedTransactions) {
          const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
            ...t,
            date: new Date(t.date)
          }));
          setTransactions(parsedTransactions);
        }

        // Load watchlist
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

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('cryptoTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('cryptoWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  return {
    cryptocurrencies,
    transactions,
    loading,
    watchlist,
    setTransactions,
    setWatchlist
  };
};
