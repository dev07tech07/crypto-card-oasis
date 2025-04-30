
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useCrypto } from '@/contexts/CryptoContext';
import OverviewTab from '@/components/dashboard/OverviewTab';
import TransactionsTab from '@/components/dashboard/TransactionsTab';
import FutureTab from '@/components/dashboard/FutureTab';
import { toast } from '@/hooks/use-toast';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { getUserTransactions, approveTransaction, cancelTransaction, transactions } = useCrypto();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Show a welcome toast when dashboard loads
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name}`,
      });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const userTransactions = user ? getUserTransactions(user.id) : [];
  const pendingTransactions = userTransactions.filter(t => t.status === 'pending');
  const completedTransactions = userTransactions.filter(t => t.status === 'completed');
  const cancelledTransactions = userTransactions.filter(t => t.status === 'cancelled');

  const handleApproveTransaction = (transactionId: string) => {
    approveTransaction(transactionId);
  };

  const handleCancelTransaction = (transactionId: string, reason: string) => {
    cancelTransaction(transactionId, reason);
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
