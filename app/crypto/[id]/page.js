'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeWebSocket } from '@/utils/websocket';
import { fetchCryptoData } from '@/redux/features/cryptoSlice';
import { loadPreferences, toggleFavoriteCrypto } from '@/redux/features/preferencesSlice';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function CryptoDetail({ params }) {
  const { id } = React.use(params);
  const dispatch = useDispatch();
  const cryptoData = useSelector((state) => state.crypto.cryptocurrencies[id]);
  const favoriteCryptos = useSelector((state) => state.preferences.favoriteCryptos);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const isConnected = useSelector((state) => state.crypto.websocketConnected);
  const [conversionRates, setConversionRates] = useState({ usd: 1 });

  useEffect(() => {
    if (cryptoData.marketCap === 0)
      dispatch(fetchCryptoData(id));
    dispatch(loadPreferences());
    initializeWebSocket();
  }, [dispatch])

  useEffect(() => {
    let abortController = new AbortController();


    const fetchHistoricalData = async (retries=3 ) => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${selectedCurrency}&days=30`,
          { signal: abortController.signal}
        );

        if (!response.ok) throw new Error('Failed to fetch historical data');

        const data = await response.json();

        const formattedData = data.prices.map((price, index) => ({
          date: new Date(price[0]).toLocaleDateString(),
          price: price[1],
          volume: data.total_volumes[index][1],
        }));

        setHistoricalData(formattedData);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Failed to fetch historical data:', error);

        if (retries > 0) {
          console.log(`Retrying fetch... attempts left: ${retries}`);
          setTimeout(() => fetchHistoricalData(retries - 1), 2000); // Retry after 2 seconds
        }
      }
    };

    fetchHistoricalData();

  }, [id, selectedCurrency]);

  if (!cryptoData) {
    return <div>Cryptocurrency not found</div>;
  }

  useEffect(() => {
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className='flex items-center gap-4 mb-8'>
          <h1 className="text-4xl font-bold ">
            {cryptoData.name} ({cryptoData.symbol})
          </h1>
          <button
            onClick={() => { dispatch(toggleFavoriteCrypto(id)); }}
            className="text-muted-foreground hover:text-primary"
          >
            {favoriteCryptos !== undefined && (
              <Star className={` ${favoriteCryptos.includes(id) ? "text-yellow-400 fill-yellow-400" : "text-neutral-300 dark:text-neutral-700 hover:text-yellow-400 dark:hover:text-yellow-400"}`} />
            )}
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Current Price</CardTitle>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {formatPrice(cryptoData.price)}
                </span>
                <div className="flex items-center">
                  {cryptoData.priceChange24h > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span
                    className={`ml-2 ${cryptoData.priceChange24h > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                      }`}
                  >
                    {cryptoData.priceChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="text-lg text-muted-foreground">
                Market Cap:{' '}
                {cryptoData.marketCap
                  ? formatMarketCap(cryptoData.marketCap)
                  : 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>30-Day Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" className="text-sm" />
                    <YAxis
                      className="text-sm"
                      tickFormatter={(value) => {
                        if (selectedCurrency === 'inr') {
                          if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`; // Trillions
                          if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`; // Billions
                          if (value >= 1e7) return `${(value / 1e7).toFixed(1)}Cr`; // Crores
                          if (value >= 1e5) return `${(value / 1e5).toFixed(1)}L`; // Lacs
                        } else {
                          if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`; // Trillions
                          if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`; // Billions
                          if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`; // Millions
                          if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`; // Thousands
                        }
                        return value; // Default
                      }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Trading Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" className="text-sm" />
                    <YAxis
                      className="text-sm"
                      tickFormatter={(value) => {
                        if (selectedCurrency === 'inr') {
                          if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`; // Trillions
                          if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`; // Billions
                          if (value >= 1e7) return `${(value / 1e7).toFixed(1)}Cr`; // Crores
                          if (value >= 1e5) return `${(value / 1e5).toFixed(1)}L`; // Lacs
                        } else {
                          if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`; // Trillions
                          if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`; // Billions
                          if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`; // Millions
                          if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`; // Thousands
                        }
                        return value; // Default
                      }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}