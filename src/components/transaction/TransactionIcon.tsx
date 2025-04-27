
import React from 'react';
import { cn } from '@/lib/utils';
import { TRANSACTION_ICONS } from '@/constants/transactionIcons';

interface TransactionIconProps {
  type: string;
}

export const TransactionIcon: React.FC<TransactionIconProps> = ({ type }) => {
  const transactionData = TRANSACTION_ICONS[type as keyof typeof TRANSACTION_ICONS] || TRANSACTION_ICONS.default;
  const Icon = transactionData.icon;

  return (
    <div className={cn(
      "h-8 w-8 rounded-full flex items-center justify-center mr-3",
      transactionData.bgColor,
      transactionData.textColor
    )}>
      <Icon className="h-4 w-4" />
    </div>
  );
};
