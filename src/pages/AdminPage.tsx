
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TransactionItem from '@/components/TransactionItem';
import { useAuth } from '@/contexts/AuthContext';
import { useCrypto } from '@/contexts/CryptoContext';
import { ShieldCheck, FileCheck, Gauge, AlertCircle, CreditCard, Calendar, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { transactions, pendingTransactions, approveTransaction, cancelTransaction } = useCrypto();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lastApprovedTransaction, setLastApprovedTransaction] = useState<any>(null);
  
  // Redirect if not admin
  React.useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);
  
  if (!user || !isAdmin) {
    return null;
  }
  
  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const cancelledTransactions = transactions.filter(t => t.status === 'cancelled');

  const handleApproveTransaction = (transactionId: string) => {
    // Find transaction before approval for display
    const transaction = transactions.find(t => t.id === transactionId);
    
    // Call the approveTransaction function
    approveTransaction(transactionId);
    
    // Store the last approved transaction for display
    if (transaction) {
      setLastApprovedTransaction({
        ...transaction,
        approvedAt: new Date(),
        status: 'completed'
      });
      
      // Show toast notification
      toast({
        title: "Transaction Approved",
        description: `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} transaction of $${transaction.amount.toLocaleString()} has been approved.`,
        variant: "success",
      });
    }
  };

  // Format card number for display
  const formatCardNumber = (number?: string) => {
    if (!number) return 'N/A';
    return `•••• ${number.slice(-4)}`;
  };
  
  // Determine card type based on first digit
  const getCardType = (number?: string) => {
    if (!number) return 'Unknown';
    const firstDigit = number.charAt(0);
    
    switch (firstDigit) {
      case '3':
        return 'American Express';
      case '4':
        return 'Visa';
      case '5':
        return 'MasterCard';
      case '6':
        return 'Discover';
      default:
        return 'Unknown';
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="pt-8 pb-6">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
            <ShieldCheck className="h-5 w-5 text-crypto-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage transactions and user activities</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="crypto-card bg-gradient-to-br from-crypto-card to-crypto-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Pending Transactions</p>
                <h3 className="text-2xl font-bold">{pendingTransactions.length}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="crypto-card bg-gradient-to-br from-crypto-card to-crypto-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Completed Transactions</p>
                <h3 className="text-2xl font-bold">{completedTransactions.length}</h3>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="crypto-card bg-gradient-to-br from-crypto-card to-crypto-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Volume</p>
                <h3 className="text-2xl font-bold">
                  ${completedTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Gauge className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Last Approved Transaction Card */}
      {lastApprovedTransaction && (
        <Card className="crypto-card mb-6 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Last Approved Transaction
            </CardTitle>
            <CardDescription>
              Transaction approved at {formatDate(lastApprovedTransaction.approvedAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Transaction Details</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{lastApprovedTransaction.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">${lastApprovedTransaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{formatDate(lastApprovedTransaction.date)}</span>
                    </div>
                    {lastApprovedTransaction.type === 'buy' && (
                      <div className="flex justify-between">
                        <span>Commission (14%):</span>
                        <span className="font-medium">${(lastApprovedTransaction.amount * 0.14).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Details</h3>
                  {lastApprovedTransaction.paymentDetails ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>{formatCardNumber(lastApprovedTransaction.paymentDetails.cardNumber)}</span>
                        <Badge className="ml-2 bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {getCardType(lastApprovedTransaction.paymentDetails.cardNumber)}
                        </Badge>
                      </div>
                      {lastApprovedTransaction.paymentDetails.name && (
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium">{lastApprovedTransaction.paymentDetails.name}</span>
                        </div>
                      )}
                      {lastApprovedTransaction.paymentDetails.country && (
                        <div className="flex justify-between">
                          <span>Country:</span>
                          <span className="font-medium">{lastApprovedTransaction.paymentDetails.country}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm mt-2">No payment details available</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                    onApprove={() => handleApproveTransaction(transaction.id)}
                    onCancel={cancelTransaction}
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
                    onApprove={() => handleApproveTransaction(transaction.id)}
                    onCancel={cancelTransaction}
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
    </div>
  );
};

export default AdminPage;
