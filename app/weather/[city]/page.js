'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft, Thermometer, Droplets } from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WeatherDetail({ params }) {
  const { city } = params;
  const decodedCity = decodeURIComponent(city);
  const weatherData = useSelector((state) => state.weather.cities[decodedCity]);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    // Simulate historical data (in a real app, this would come from an API)
    const generateHistoricalData = () => {
      const data = [];
      const baseTemp = weatherData?.temperature || 20;
      const baseHumidity = weatherData?.humidity || 50;

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toLocaleDateString(),
          temperature: baseTemp + (Math.random() * 4 - 2),
          humidity: baseHumidity + (Math.random() * 10 - 5),
        });
      }
      return data;
    };

    setHistoricalData(generateHistoricalData());
  }, [weatherData]);

  if (!weatherData) {
    return <div>City not found</div>;
  }

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

        <h1 className="text-4xl font-bold mb-8">{decodedCity} Weather</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Thermometer className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {Math.round(weatherData.temperature)}°C
                  </span>
                </div>
                <div className="flex items-center">
                  <Droplets className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {weatherData.humidity}%
                  </span>
                </div>
              </div>
              <div className="text-lg text-muted-foreground">
                {weatherData.conditions}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7-Day Temperature History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Humidity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}