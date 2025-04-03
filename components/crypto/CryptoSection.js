'use client';

import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Star } from 'lucide-react';

export default function CryptoSection() {
  const cryptos = useSelector((state) => state.crypto.cryptocurrencies);
  const favoriteCryptos = useSelector((state) => state.preferences.favoriteCryptos);
  const favoriteCities = useSelector((state) => state.preferences.favoriteCities);
  const isConnected = useSelector((state) => state.crypto.websocketConnected);

  // State for selected currency and conversion rates
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [conversionRates, setConversionRates] = useState({ usd: 1 });

  React.useEffect(() => {
    async function fetchConversionRates() {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const filteredRates = {
          inr: data.rates.INR || 82.5,
          eur: data.rates.EUR || 0.92,
          gbp: data.rates.GBP || 0.78,
          jpy: data.rates.JPY || 110.0,
        };
        setConversionRates({
          usd: 1,
          ...filteredRates,
        });
      } catch (error) {
        console.error('Failed to fetch conversion rates:', error);
      }
    }

    fetchConversionRates();
  }, []);

  const formatPrice = (price) => {
    const convertedPrice = price * conversionRates[selectedCurrency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.toUpperCase(),
    }).format(convertedPrice);
  };

  const formatMarketCap = (marketCap) => {
    const convertedMarketCap = marketCap * conversionRates[selectedCurrency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.toUpperCase(),
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(convertedMarketCap);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  return (
    <Card className="space-y-4 p-4 h-fit shadow-md dark:shadow-neutral-800 dark:shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Crypto Prices</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 border rounded-md text-sm bg-white dark:bg-neutral-900 flex items-center justify-between">
                  {selectedCurrency.toUpperCase()}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32 bg-white dark:bg-neutral-900 border rounded-md shadow-md z-10">
                {Object.keys(conversionRates).map((currency) => (
                  <DropdownMenuItem
                    key={currency}
                    onClick={() => handleCurrencyChange(currency)}
                    className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    {currency.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>
      <div className="grid">
        {Object.values(cryptos).map((crypto) => (
          <Link key={crypto.id} href={`/crypto/${crypto.id}`}>
            <Card className="hover:bg-neutral-100 dark:hover:bg-neutral-900 bg-opacity-5 dark:bg-opacity-60 transition-all duration-100 border-t-0 border-x-0 shadow-none border-b rounded-none hover:rounded-md px-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-1">
                <div className='flex items-center gap-2'>
                  <CardTitle className="text-sm font-medium">
                    {crypto.name} ({crypto.symbol})
                  </CardTitle>
                  <div
                    className="text-muted-foreground hover:text-primary"
                  >
                    {favoriteCryptos.includes(crypto.id) ? <Star className="w-5 h-5 text-yellow-400 fill-yellow-400"/> : null }
                  </div>
                </div>
                {crypto.priceChange24h > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold">{formatPrice(crypto.price)}</div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span
                    className={
                      crypto.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {crypto.priceChange24h.toFixed(2)}%
                  </span>
                  <span className="text-muted-foreground">
                    MCap:{' '}
                    {crypto.marketCap
                      ? formatMarketCap(crypto.marketCap)
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Card>
  );
}