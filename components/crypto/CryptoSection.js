'use client';

import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function CryptoSection() {
  const cryptos = useSelector((state) => state.crypto.cryptocurrencies);
  const isConnected = useSelector((state) => state.crypto.websocketConnected);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(marketCap);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Crypto Prices</h2>
        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      <div className="grid gap-4">
        {Object.values(cryptos).map((crypto) => (
          <Link key={crypto.id} href={`/crypto/${crypto.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {crypto.name} ({crypto.symbol})
                </CardTitle>
                {crypto.priceChange24h > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(crypto.price)}</div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span
                    className={crypto.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}
                  >
                    {crypto.priceChange24h.toFixed(2)}%
                  </span>
                  <span className="text-muted-foreground">
                    MCap: {crypto.marketCap ? formatMarketCap(crypto.marketCap) : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}