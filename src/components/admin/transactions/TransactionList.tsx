
import React from 'react';
import TransactionItem from '@/components/TransactionItem';
import type { Transaction } from '@/types/crypto';

interface TransactionListProps {
  transactions: Transaction[];
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
  emptyMessage: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isAdmin = false,
  onApprove,
  onCancel,
  emptyMessage
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionItem 
          key={transaction.id} 
          transaction={transaction}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};
