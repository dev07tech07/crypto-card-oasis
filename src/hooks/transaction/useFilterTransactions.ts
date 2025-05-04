
import { useMemo } from 'react';
import type { Transaction } from '@/types/crypto';

export const useFilterTransactions = (transactions: Transaction[]) => {
  const pendingTransactions = useMemo(() => 
    transactions.filter(transaction => transaction.status === 'pending'),
    [transactions]
  );
  
  return { pendingTransactions };
};
