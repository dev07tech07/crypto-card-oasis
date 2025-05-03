
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useCrypto } from '@/contexts/CryptoContext';
import { CryptoHolding } from '@/types/crypto';
import { Bitcoin } from "lucide-react";

const CryptoHoldingsCard: React.FC = () => {
  const { user } = useAuth();
  const { cryptocurrencies } = useCrypto();
  
  if (!user || !user.cryptoHoldings || user.cryptoHoldings.length === 0) {
    return (
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bitcoin className="mr-2 h-5 w-5 text-crypto-accent" />
            <span>Crypto Holdings</span>
          </CardTitle>
          <CardDescription>Your cryptocurrency portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            You don't own any cryptocurrencies yet. Start by buying some crypto!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Enhance holdings with current price data
  const enhancedHoldings = user.cryptoHoldings.map((holding: CryptoHolding) => {
    const cryptoData = cryptocurrencies.find(c => 
      c.id === holding.cryptoId || 
      c.symbol.toLowerCase() === holding.symbol.toLowerCase()
    );
    
    return {
      ...holding,
      currentPrice: cryptoData?.price || 0,
      value: (cryptoData?.price || 0) * holding.amount,
      image: cryptoData?.image || '',
    };
  });
  
  const totalValue = enhancedHoldings.reduce((sum, holding) => sum + holding.value, 0);
  
  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bitcoin className="mr-2 h-5 w-5 text-crypto-accent" />
          <span>Crypto Holdings</span>
        </CardTitle>
        <CardDescription>Your cryptocurrency portfolio (${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Coin</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Value (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enhancedHoldings.map((holding) => (
              <TableRow key={holding.symbol}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {holding.image && (
                      <img 
                        src={holding.image} 
                        alt={holding.name} 
                        className="w-6 h-6 mr-2 rounded-full"
                      />
                    )}
                    <span>{holding.name} ({holding.symbol})</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {holding.amount.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8
                  })}
                </TableCell>
                <TableCell className="text-right">
                  ${holding.value.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CryptoHoldingsCard;
