
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useCrypto } from '@/contexts/CryptoContext';
import OverviewTab from '@/components/dashboard/OverviewTab';
import TransactionsTab from '@/components/dashboard/TransactionsTab';
import FutureTab from '@/components/dashboard/FutureTab';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { getUserTransactions, approveTransaction, cancelTransaction } = useCrypto();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    navigate('/login');
    return null;
  }

  const userTransactions = user ? getUserTransactions(user.id) : [];
  const pendingTransactions = userTransactions.filter(t => t.status === 'pending');
  const completedTransactions = userTransactions.filter(t => t.status === 'completed');
  const cancelledTransactions = userTransactions.filter(t => t.status === 'cancelled');

  const handleApproveTransaction = (transactionId: string) => {
    approveTransaction(transactionId);
    // Refresh the user transactions after approval
    getUserTransactions(user.id);
  };

  const handleCancelTransaction = (transactionId: string, reason: string) => {
    cancelTransaction(transactionId, reason);
    // Refresh the user transactions after cancellation
    getUserTransactions(user.id);
  };

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="pt-8 pb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-crypto-darker">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab 
            walletBalance={user.walletBalance} 
            pendingTransactions={pendingTransactions}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionsTab 
            userTransactions={userTransactions}
            pendingTransactions={pendingTransactions}
            completedTransactions={completedTransactions}
            cancelledTransactions={cancelledTransactions}
          />
        </TabsContent>
        
        <TabsContent value="future">
          <FutureTab 
            pendingTransactions={pendingTransactions}
            onApprove={handleApproveTransaction}
            onCancel={handleCancelTransaction}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
