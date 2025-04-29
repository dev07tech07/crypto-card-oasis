
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TransactionList } from '@/components/admin/transactions/TransactionList';
import { Transaction } from '@/types/crypto';

interface FutureTabProps {
  pendingTransactions: Transaction[];
  onApprove: (id: string) => void;
  onCancel: (id: string, reason: string) => void;
}

const FutureTab: React.FC<FutureTabProps> = ({
  pendingTransactions,
  onApprove,
  onCancel
}) => {
  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle>Purchase Requests</CardTitle>
        <CardDescription>Accept or reject pending purchase requests</CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionList
          transactions={pendingTransactions.filter(t => t.type === 'buy')}
          isAdmin={true}
          onApprove={onApprove}
          onCancel={onCancel}
          emptyMessage="No pending purchase requests."
        />
      </CardContent>
    </Card>
  );
};

export default FutureTab;
