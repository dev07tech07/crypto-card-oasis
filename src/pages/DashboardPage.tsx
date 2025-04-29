import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TransactionItem from '@/components/TransactionItem';
import { useAuth } from '@/contexts/AuthContext';
import { useCrypto } from '@/contexts/CryptoContext';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Bitcoin, LineChart, User, HelpCircle } from 'lucide-react';
import { TransactionList } from '@/components/admin/transactions/TransactionList';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { getUserTransactions } = useCrypto();
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
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="crypto-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-crypto-accent" />
                <span>Wallet Balance</span>
              </CardTitle>
              <CardDescription>Your current balance and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-3xl font-bold">
                  ${user.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-crypto-accent hover:bg-crypto-accent/80 text-black" 
                  onClick={() => navigate('/dashboard/deposit')}
                >
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-700" 
                  onClick={() => navigate('/dashboard/withdraw')}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="crypto-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5 text-yellow-500" />
                <span>Pending Transactions</span>
                {pendingTransactions.length > 0 && (
                  <span className="ml-2 bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full text-xs">
                    {pendingTransactions.length}
                  </span>
                )}
              </CardTitle>
              <CardDescription>Transactions awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTransactions.length > 0 ? (
                <div className="space-y-3">
                  {pendingTransactions.slice(0, 3).map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                  {pendingTransactions.length > 3 && (
                    <Button 
                      variant="link" 
                      className="text-crypto-accent p-0 h-auto" 
                      onClick={() => setActiveTab('transactions')}
                    >
                      View all pending transactions
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No pending transactions</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="crypto-card">
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Commonly used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:border-crypto-accent/50 hover:bg-crypto-accent/10"
                  onClick={() => navigate('/market')}
                >
                  <Bitcoin className="mr-2 h-4 w-4 text-crypto-accent" />
                  Buy Crypto
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:border-crypto-accent/50 hover:bg-crypto-accent/10"
                  onClick={() => navigate('/market')}
                >
                  <LineChart className="mr-2 h-4 w-4 text-crypto-accent" />
                  Markets
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:border-crypto-accent/50 hover:bg-crypto-accent/10"
                  onClick={() => navigate('/dashboard/account')}
                >
                  <User className="mr-2 h-4 w-4 text-crypto-accent" />
                  Account
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:border-crypto-accent/50 hover:bg-crypto-accent/10"
                  onClick={() => navigate('/support')}
                >
                  <HelpCircle className="mr-2 h-4 w-4 text-crypto-accent" />
                  Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          <Card className="crypto-card">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage your transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="bg-crypto-darker mb-4">
                  <TabsTrigger value="all">
                    All ({userTransactions.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pendingTransactions.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedTransactions.length})
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Cancelled ({cancelledTransactions.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {userTransactions.length > 0 ? (
                    userTransactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No transactions found. Start by buying some crypto!
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="pending" className="space-y-4">
                  {pendingTransactions.length > 0 ? (
                    pendingTransactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No pending transactions
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  {completedTransactions.length > 0 ? (
                    completedTransactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No completed transactions
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="space-y-4">
                  {cancelledTransactions.length > 0 ? (
                    cancelledTransactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No cancelled transactions
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="future">
          <Card className="crypto-card">
            <CardHeader>
              <CardTitle>Purchase Requests</CardTitle>
              <CardDescription>Accept or reject pending purchase requests</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList
                transactions={pendingTransactions.filter(t => t.type === 'buy')}
                isAdmin={true}
                onApprove={getUserTransactions}
                onCancel={getUserTransactions}
                emptyMessage="No pending purchase requests."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
