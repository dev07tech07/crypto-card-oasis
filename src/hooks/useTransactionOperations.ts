
import type { Transaction } from '../types/crypto';
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
    setTransactions((prev) => {
      const updatedTransactions = prev.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status: 'completed' }
          : transaction
      );
      localStorage.setItem('cryptoTransactions', JSON.stringify(updatedTransactions));
      return updatedTransactions;
    });

    // Find the transaction
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction || !transaction.userId) return;
    
    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => u.id === transaction.userId);
    
    if (userIndex !== -1) {
      const updatedUsers = [...storedUsers];
      
      if (transaction.type === 'deposit') {
        updatedUsers[userIndex].walletBalance = (updatedUsers[userIndex].walletBalance || 0) + transaction.amount;
      } 
      else if (transaction.type === 'buy') {
        const cryptoValue = transaction.amount * 0.86; // Apply 14% commission
        updatedUsers[userIndex].walletBalance = (updatedUsers[userIndex].walletBalance || 0) + cryptoValue;
      }
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Update current user if logged in
      const currentUser = JSON.parse(localStorage.getItem('cryptoUser') || '{}');
      if (currentUser.id === transaction.userId) {
        if (transaction.type === 'deposit') {
          currentUser.walletBalance = (currentUser.walletBalance || 0) + transaction.amount;
        } else if (transaction.type === 'buy') {
          currentUser.walletBalance = (currentUser.walletBalance || 0) + transaction.amount * 0.86;
        }
        localStorage.setItem('cryptoUser', JSON.stringify(currentUser));
      }
    }
    
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
          ? { ...transaction, status: 'cancelled', cancellationReason: reason }
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
