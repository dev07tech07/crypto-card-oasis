
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionItem from '@/components/TransactionItem';
import type { Transaction } from '@/types/crypto';

interface TransactionManagementProps {
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  onApprove: (id: string) => void;
  onCancel: (id: string, reason: string) => void;
}

export const TransactionManagement: React.FC<TransactionManagementProps> = ({
  transactions,
  pendingTransactions,
  onApprove,
  onCancel,
}) => {
  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const cancelledTransactions = transactions.filter(t => t.status === 'cancelled');

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle>Transaction Management</CardTitle>
        <CardDescription>Review and manage user transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="bg-crypto-darker mb-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingTransactions.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingTransactions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingTransactions.length > 0 ? (
              pendingTransactions.map((transaction) => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  isAdmin={true}
                  onApprove={() => onApprove(transaction.id)}
                  onCancel={onCancel}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending transactions to review.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  isAdmin={true}
                  onApprove={() => onApprove(transaction.id)}
                  onCancel={onCancel}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedTransactions.length > 0 ? (
              completedTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed transactions.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            {cancelledTransactions.length > 0 ? (
              cancelledTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No cancelled transactions.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
