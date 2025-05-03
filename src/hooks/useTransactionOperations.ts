
import type { Transaction, CryptoHolding } from '../types/crypto';
import { toast } from '@/hooks/use-toast';

export const useTransactionOperations = (
  transactions: Transaction[],
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  const addTransaction = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date()
    };
    
    setTransactions((prev) => {
      const updatedTransactions = [...prev, transaction];
      localStorage.setItem('cryptoTransactions', JSON.stringify(updatedTransactions));
      return updatedTransactions;
    });
    
    toast({
      title: "Transaction Created",
      description: "Your transaction has been submitted and is awaiting approval",
    });
  };

  const approveTransaction = (transactionId: string) => {
    // Find the transaction first to use it in the updates
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || !transaction.userId) {
      console.error('Transaction not found or missing user ID');
      return;
    }
    
    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => u.id === transaction.userId);
    
    if (userIndex !== -1) {
      const updatedUsers = [...storedUsers];
      
      // Initialize crypto holdings if not exists
      if (!updatedUsers[userIndex].cryptoHoldings) {
        updatedUsers[userIndex].cryptoHoldings = [];
      }
      
      // Handle different transaction types
      if (transaction.type === 'deposit') {
        updatedUsers[userIndex].walletBalance = (updatedUsers[userIndex].walletBalance || 0) + transaction.amount;
      } 
      else if (transaction.type === 'withdrawal') {
        // Subtract withdrawal amount from wallet balance
        updatedUsers[userIndex].walletBalance = Math.max(0, (updatedUsers[userIndex].walletBalance || 0) - transaction.amount);
      }
      else if (transaction.type === 'buy' && transaction.cryptocurrency && transaction.cryptoSymbol && transaction.cryptoAmount) {
        // For crypto purchases, add to specific crypto holdings AND subtract the amount from wallet
        
        // First subtract the purchase amount from wallet balance
        updatedUsers[userIndex].walletBalance = Math.max(0, (updatedUsers[userIndex].walletBalance || 0) - transaction.amount);
        
        // Then update crypto holdings
        const existingHoldingIndex = updatedUsers[userIndex].cryptoHoldings.findIndex(
          (holding: CryptoHolding) => holding.cryptoId === transaction.cryptocurrency || holding.symbol.toLowerCase() === transaction.cryptoSymbol?.toLowerCase()
        );
        
        if (existingHoldingIndex !== -1) {
          // Update existing holding
          updatedUsers[userIndex].cryptoHoldings[existingHoldingIndex].amount += transaction.cryptoAmount;
        } else {
          // Add new holding
          updatedUsers[userIndex].cryptoHoldings.push({
            cryptoId: transaction.cryptocurrency || '',
            name: transaction.cryptocurrency || '',
            symbol: transaction.cryptoSymbol || '',
            amount: transaction.cryptoAmount || 0,
          });
        }
        
        // Log the updated holdings for debugging
        console.log(`Updated crypto holdings for user ${transaction.userId}:`, updatedUsers[userIndex].cryptoHoldings);
      }
      else if (transaction.type === 'sell' && transaction.cryptocurrency && transaction.cryptoSymbol && transaction.cryptoAmount) {
        // Add the sold amount to wallet balance
        updatedUsers[userIndex].walletBalance = (updatedUsers[userIndex].walletBalance || 0) + transaction.amount;
        
        // Find and reduce the crypto holding
        const existingHoldingIndex = updatedUsers[userIndex].cryptoHoldings.findIndex(
          (holding: CryptoHolding) => holding.cryptoId === transaction.cryptocurrency || holding.symbol.toLowerCase() === transaction.cryptoSymbol?.toLowerCase()
        );
        
        if (existingHoldingIndex !== -1) {
          // Reduce the amount
          updatedUsers[userIndex].cryptoHoldings[existingHoldingIndex].amount -= transaction.cryptoAmount;
          
          // Remove the holding if amount is zero or less
          if (updatedUsers[userIndex].cryptoHoldings[existingHoldingIndex].amount <= 0) {
            updatedUsers[userIndex].cryptoHoldings.splice(existingHoldingIndex, 1);
          }
        }
      }
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Update current user if logged in
      const currentUser = JSON.parse(localStorage.getItem('cryptoUser') || '{}');
      if (currentUser.id === transaction.userId) {
        if (transaction.type === 'deposit') {
          currentUser.walletBalance = (currentUser.walletBalance || 0) + transaction.amount;
        } 
        else if (transaction.type === 'withdrawal') {
          currentUser.walletBalance = Math.max(0, (currentUser.walletBalance || 0) - transaction.amount);
        } 
        else if (transaction.type === 'buy' && transaction.cryptocurrency && transaction.cryptoSymbol && transaction.cryptoAmount) {
          // Initialize crypto holdings if not exists
          if (!currentUser.cryptoHoldings) {
            currentUser.cryptoHoldings = [];
          }
          
          // Update wallet balance
          currentUser.walletBalance = Math.max(0, (currentUser.walletBalance || 0) - transaction.amount);
          
          // Update crypto holdings
          const existingHoldingIndex = currentUser.cryptoHoldings.findIndex(
            (holding: CryptoHolding) => holding.cryptoId === transaction.cryptocurrency || holding.symbol.toLowerCase() === transaction.cryptoSymbol?.toLowerCase()
          );
          
          if (existingHoldingIndex !== -1) {
            // Update existing holding
            currentUser.cryptoHoldings[existingHoldingIndex].amount += transaction.cryptoAmount;
          } else {
            // Add new holding
            currentUser.cryptoHoldings.push({
              cryptoId: transaction.cryptocurrency || '',
              name: transaction.cryptocurrency || '',
              symbol: transaction.cryptoSymbol || '',
              amount: transaction.cryptoAmount || 0,
            });
          }
          
          // Log for debugging
          console.log(`Updated current user's crypto holdings:`, currentUser.cryptoHoldings);
        }
        else if (transaction.type === 'sell' && transaction.cryptocurrency && transaction.cryptoSymbol && transaction.cryptoAmount) {
          // Update wallet balance
          currentUser.walletBalance = (currentUser.walletBalance || 0) + transaction.amount;
          
          // Update crypto holdings
          const existingHoldingIndex = currentUser.cryptoHoldings.findIndex(
            (holding: CryptoHolding) => holding.cryptoId === transaction.cryptocurrency || holding.symbol.toLowerCase() === transaction.cryptoSymbol?.toLowerCase()
          );
          
          if (existingHoldingIndex !== -1) {
            // Reduce the amount
            currentUser.cryptoHoldings[existingHoldingIndex].amount -= transaction.cryptoAmount;
            
            // Remove the holding if amount is zero or less
            if (currentUser.cryptoHoldings[existingHoldingIndex].amount <= 0) {
              currentUser.cryptoHoldings.splice(existingHoldingIndex, 1);
            }
          }
        }
        
        localStorage.setItem('cryptoUser', JSON.stringify(currentUser));
      }
    }
    
    // Finally, update the transaction status
    setTransactions((prev) => {
      const updatedTransactions = prev.map((t) =>
        t.id === transactionId
          ? { ...t, status: 'completed' as const }
          : t
      );
      localStorage.setItem('cryptoTransactions', JSON.stringify(updatedTransactions));
      return updatedTransactions;
    });
    
    toast({
      title: "Transaction Approved",
      description: "Your transaction has been successfully processed",
      variant: "default"
    });
  };

  const cancelTransaction = (transactionId: string, reason: string) => {
    setTransactions((prev) => {
      const updatedTransactions = prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status: 'cancelled' as const, cancellationReason: reason }
          : transaction
      );
      localStorage.setItem('cryptoTransactions', JSON.stringify(updatedTransactions));
      return updatedTransactions;
    });
    
    toast({
      title: "Transaction Cancelled",
      description: reason || "Your transaction has been cancelled",
      variant: "destructive"
    });
  };

  const getUserTransactions = (userId: string) => {
    return transactions.filter((transaction) => transaction.userId === userId);
  };

  return {
    addTransaction,
    approveTransaction,
    cancelTransaction,
    getUserTransactions
  };
};
