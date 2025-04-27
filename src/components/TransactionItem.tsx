
import React from 'react';
import type { Transaction } from '@/types/crypto';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, CreditCard, Wallet, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TransactionItemProps {
  transaction: Transaction;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  isAdmin = false,
  onApprove,
  onCancel
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [cancellationReason, setCancellationReason] = React.useState('');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <CreditCard className="h-4 w-4" />;
      case 'sell':
        return <Wallet className="h-4 w-4" />;
      case 'deposit':
        return <ArrowDown className="h-4 w-4" />;
      case 'withdrawal':
        return <ArrowUp className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getTransactionTitle = () => {
    switch (transaction.type) {
      case 'buy':
        return `Buy ${transaction.cryptoSymbol || 'Crypto'}`;
      case 'sell':
        return `Sell ${transaction.cryptoSymbol || 'Crypto'}`;
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      default:
        return 'Transaction';
    }
  };

  const handleCancel = () => {
    if (onCancel && cancellationReason.trim()) {
      onCancel(transaction.id, cancellationReason);
      setIsDialogOpen(false);
      setCancellationReason('');
    }
  };

  return (
    <>
      <Card className={cn(
        "crypto-card hover:shadow-sm transition-all mb-4",
        transaction.status === 'pending' && isAdmin && "border-yellow-500/30"
      )}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center mr-3",
                transaction.type === 'buy' ? "bg-crypto-accent/10 text-crypto-accent" : 
                transaction.type === 'sell' ? "bg-red-500/10 text-red-500" :
                transaction.type === 'deposit' ? "bg-blue-500/10 text-blue-500" :
                "bg-purple-500/10 text-purple-500"
              )}>
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <h3 className="font-medium">{getTransactionTitle()}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium">{formatAmount(transaction.amount)}</p>
                {transaction.cryptoAmount && transaction.cryptoSymbol && (
                  <p className="text-xs text-muted-foreground">
                    {transaction.cryptoAmount.toFixed(6)} {transaction.cryptoSymbol}
                  </p>
                )}
              </div>
              <Badge className={cn("ml-2", getStatusColor(transaction.status))}>
                {transaction.status}
              </Badge>
            </div>
          </div>
          
          {transaction.paymentDetails && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-sm font-medium mb-1">Payment Details:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {transaction.paymentDetails.name && (
                  <div>
                    <span className="text-muted-foreground">Name:</span> {transaction.paymentDetails.name}
                  </div>
                )}
                {transaction.paymentDetails.cardNumber && (
                  <div>
                    <span className="text-muted-foreground">Card:</span> •••• {transaction.paymentDetails.cardNumber.slice(-4)}
                  </div>
                )}
                {transaction.paymentDetails.walletAddress && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Wallet:</span> {transaction.paymentDetails.walletAddress.substring(0, 15)}...
                  </div>
                )}
                {transaction.paymentDetails.country && (
                  <div>
                    <span className="text-muted-foreground">Country:</span> {transaction.paymentDetails.country}
                  </div>
                )}
                {transaction.paymentDetails.phoneNumber && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span> {transaction.paymentDetails.phoneNumber}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {transaction.cancellationReason && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-sm font-medium text-red-400">Cancellation Reason:</p>
              <p className="text-xs text-muted-foreground">{transaction.cancellationReason}</p>
            </div>
          )}
          
          {isAdmin && transaction.status === 'pending' && (
            <div className="mt-3 pt-3 border-t border-gray-800 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                onClick={() => setIsDialogOpen(true)}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button 
                size="sm"
                className="bg-crypto-accent hover:bg-crypto-accent/80 text-black"
                onClick={() => onApprove && onApprove(transaction.id)}
              >
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-crypto-card border-gray-800">
          <DialogHeader>
            <DialogTitle>Cancel Transaction</DialogTitle>
            <DialogDescription>
              Please provide a reason for canceling this transaction. This will be visible to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason" className="text-sm font-medium">
              Cancellation Reason
            </Label>
            <Input
              id="reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="mt-1 bg-crypto-darker border-gray-700"
              placeholder="Enter reason for cancellation"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleCancel}
              disabled={!cancellationReason.trim()}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionItem;
