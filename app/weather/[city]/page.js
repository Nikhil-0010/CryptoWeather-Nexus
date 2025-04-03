'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { Star } from 'lucide-react';
import { fetchWeatherData, get7DayForecast, getCityCoordinates } from '@/redux/features/weatherSlice';
import { toggleFavoriteCity, loadPreferences } from '@/redux/features/preferencesSlice';

export default function WeatherDetail({ params }) {
  const { city } = React.use(params);
  const decodedCity = decodeURIComponent(city);
  const weatherData = useSelector((state) => state.weather.cities[decodedCity]);
  const [historicalData, setHistoricalData] = useState([]);
  const favoriteCities = useSelector((state) => state.preferences.favoriteCities);

  const dispatch = useDispatch();

  console.log(weatherData);

  useEffect(() => {
    dispatch(loadPreferences());
    if (weatherData.humidity === 0 && weatherData.temperature === 0 && weatherData.conditions === '') {
      dispatch(fetchWeatherData(decodedCity));
    }
  }, [dispatch, decodedCity]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { lat, lon } = await getCityCoordinates(decodedCity);
        const forecast = await get7DayForecast(lat, lon);
        setHistoricalData(forecast);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    if (!weatherData?.forecast) {
      fetchData();
    } else {
      setHistoricalData(weatherData.forecast);
    }

  }, [decodedCity]);

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

        <div className='flex items-center gap-4 mb-8'>
          <h1 className="text-4xl font-bold">{decodedCity} Weather</h1>
          <button
            onClick={() => {dispatch(toggleFavoriteCity(decodedCity));}}
            className="text-muted-foreground hover:text-primary"
          >
            <Star className={` ${favoriteCities.includes(decodedCity) ? "text-yellow-400 fill-yellow-400" : "text-neutral-300 dark:text-neutral-700 hover:text-yellow-400 dark:hover:text-yellow-400"}`} />
          </button>
        </div>

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