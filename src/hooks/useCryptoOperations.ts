
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
        setLoading(true);
        
        // Fetch real-time cryptocurrency data
        let realCryptoData: Cryptocurrency[] = [];
        
        try {
          const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d');
          
          if (response.ok) {
            const apiData = await response.json();
            
            realCryptoData = apiData.map((coin: any) => ({
              id: coin.id,
              rank: coin.market_cap_rank,
              name: coin.name,
              symbol: coin.symbol.toUpperCase(),
              price: coin.current_price,
              priceChange1h: coin.price_change_percentage_1h_in_currency || 0,
              priceChange24h: coin.price_change_percentage_24h_in_currency || 0,
              priceChange7d: coin.price_change_percentage_7d_in_currency || 0, 
              volume24h: coin.total_volume,
              marketCap: coin.market_cap,
              image: coin.image || '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
            }));
          } else {
            throw new Error('Failed to fetch from CoinGecko API');
          }
        } catch (error) {
          console.error('Error fetching real-time crypto prices:', error);
          
          // Fallback to updated mock data if API fails
          realCryptoData = [
            {
              id: 'bitcoin',
              rank: 1,
              name: 'Bitcoin',
              symbol: 'BTC',
              price: 94984.66,
              priceChange1h: 0.8,
              priceChange24h: 3.1,
              priceChange7d: 4.5,
              volume24h: 45000000000,
              marketCap: 1800000000000,
              image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
            },
            {
              id: 'ethereum',
              rank: 2,
              name: 'Ethereum',
              symbol: 'ETH',
              price: 3514.25,
              priceChange1h: 0.5,
              priceChange24h: 2.8,
              priceChange7d: 3.5,
              volume24h: 28000000000,
              marketCap: 420000000000,
              image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
            },
            {
              id: 'tether',
              rank: 3,
              name: 'Tether',
              symbol: 'USDT',
              price: 1.01,
              priceChange1h: 0.02,
              priceChange24h: 0.05,
              priceChange7d: 0.1,
              volume24h: 68000000000,
              marketCap: 100000000000,
              image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
            },
            {
              id: 'binancecoin',
              rank: 4,
              name: 'Binance Coin',
              symbol: 'BNB',
              price: 594.32,
              priceChange1h: 1.2,
              priceChange24h: 1.8,
              priceChange7d: 3.7,
              volume24h: 3100000000,
              marketCap: 85000000000,
              image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
            },
            {
              id: 'xrp',
              rank: 5,
              name: 'XRP',
              symbol: 'XRP',
              price: 0.62,
              priceChange1h: 0.7,
              priceChange24h: 1.4,
              priceChange7d: -0.9,
              volume24h: 2200000000,
              marketCap: 32000000000,
              image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
            },
            {
              id: 'cardano',
              rank: 6,
              name: 'Cardano',
              symbol: 'ADA',
              price: 0.46,
              priceChange1h: 0.9,
              priceChange24h: -0.5,
              priceChange7d: 2.8,
              volume24h: 630000000,
              marketCap: 16200000000,
              image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
            },
            {
              id: 'solana',
              rank: 7,
              name: 'Solana',
              symbol: 'SOL',
              price: 149.87,
              priceChange1h: 2.8,
              priceChange24h: 6.2,
              priceChange7d: 15.3,
              volume24h: 3500000000,
              marketCap: 64000000000,
              image: '/lovable-uploads/caa925c0-5fb1-45be-ac96-f03a8ab93361.png'
            }
          ];
        }

        setCryptocurrencies(realCryptoData);

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
    
    // Auto-refresh cryptocurrency data every 2 minutes
    const refreshInterval = setInterval(loadCryptoData, 120000);
    
    return () => clearInterval(refreshInterval);
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
