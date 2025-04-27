
import React from 'react';
import { cn } from '@/lib/utils';
import { TRANSACTION_ICONS, TransactionType } from '@/constants/transactionIcons';

interface TransactionIconProps {
  type: string;
  className?: string;
}

export const TransactionIcon: React.FC<TransactionIconProps> = ({ type, className }) => {
  const isValidTransactionType = (type: string): type is TransactionType => {
    return type in TRANSACTION_ICONS && type !== 'default';
  };

  const transactionData = isValidTransactionType(type) 
    ? TRANSACTION_ICONS[type]
    : TRANSACTION_ICONS.default;

  const Icon = transactionData.icon;

  return (
    <div className={cn(
      "h-8 w-8 rounded-full flex items-center justify-center mr-3",
      transactionData.bgColor,
      transactionData.textColor,
      className
    )}>
      <Icon className="h-4 w-4" />
    </div>
  );
};

