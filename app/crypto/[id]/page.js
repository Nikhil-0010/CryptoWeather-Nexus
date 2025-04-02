'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CryptoDetail({ params }) {
  const { id } = params;
  const cryptoData = useSelector((state) => state.crypto.cryptocurrencies[id]);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    // Simulate historical data (in a real app, this would come from an API)
    const generateHistoricalData = () => {
      const data = [];
      const basePrice = cryptoData?.price || 30000;
      const baseVolume = cryptoData?.marketCap / 1000 || 1000000;

      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const priceVariation = (Math.random() * 0.1 - 0.05) * basePrice;
        const volumeVariation = (Math.random() * 0.2 - 0.1) * baseVolume;

        data.push({
          date: date.toLocaleDateString(),
          price: basePrice + priceVariation,
          volume: baseVolume + volumeVariation,
        });
      }
      return data;
    };

    setHistoricalData(generateHistoricalData());
  }, [cryptoData]);

  if (!cryptoData) {
    return <div>Cryptocurrency not found</div>;
  }

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

        <h1 className="text-4xl font-bold mb-8">
          {cryptoData.name} ({cryptoData.symbol})
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Price</CardTitle>
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
                    className={`ml-2 ${
                      cryptoData.priceChange24h > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {cryptoData.priceChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="text-lg text-muted-foreground">
                Market Cap: {formatMarketCap(cryptoData.marketCap)}
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
                    <XAxis dataKey="date" />
                    <YAxis />
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
                    <XAxis dataKey="date" />
                    <YAxis />
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