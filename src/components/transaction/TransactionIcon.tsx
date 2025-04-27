
import React from 'react';
import { CreditCard, Wallet, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionIconProps {
  type: string;
}

export const TransactionIcon: React.FC<TransactionIconProps> = ({ type }) => {
  const getIcon = () => {
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

  return (
    <div className={cn(
      "h-8 w-8 rounded-full flex items-center justify-center mr-3",
      type === 'buy' ? "bg-crypto-accent/10 text-crypto-accent" : 
      type === 'sell' ? "bg-red-500/10 text-red-500" :
      type === 'deposit' ? "bg-blue-500/10 text-blue-500" :
      "bg-purple-500/10 text-purple-500"
    )}>
      {getIcon()}
    </div>
  );
};
