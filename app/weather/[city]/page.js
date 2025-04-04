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
import { fetchWeatherData, get7DayForecast } from '@/redux/features/weatherSlice';
import { toggleFavoriteCity, loadPreferences } from '@/redux/features/preferencesSlice';
import CustomTooltip from '@/components/CustomTooltip';
import ChartSkeleton from '@/components/ChartSkeleton';


export default function WeatherDetail({ params }) {
  const { city } = React.use(params);
  const decodedCity = decodeURIComponent(city);
  const weatherData = useSelector((state) => state.weather.cities[decodedCity]);
  const [historicalData, setHistoricalData] = useState([]);
  const favoriteCities = useSelector((state) => state.preferences.favoriteCities);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(loadPreferences());
    if (weatherData.humidity === 0 && weatherData.temperature === 0 && weatherData.conditions === '') {
      dispatch(fetchWeatherData(decodedCity));
    }
  }, [dispatch, decodedCity]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const forecast = await get7DayForecast(decodedCity);
        const formattedForecast = forecast.map((entry) => ({
          ...entry,
          formattedDate: entry.date.split('-').reverse().join('-'),
          date: new Date(entry.date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
          }),
        }));
        setHistoricalData(formattedForecast);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }finally{
        setIsLoading(false);
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
    <div className="min-h-screen bg-background p-6 lg:p-8">
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
              <CardTitle className='text-xl'>Current Conditions</CardTitle>
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
              <CardTitle className='text-xl'>7-Day Temperature History</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 sm:p-6" >
              <div className="h-[300px]">
                {isLoading ? 
                ( <ChartSkeleton length={10} width={8} /> ):(
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" className='text-sm'dy={5} />
                    <YAxis className='text-sm'/>
                    <Tooltip content={<CustomTooltip />}/>
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className='text-xl'>Humidity History</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 sm:p-6">
              <div className="h-[300px]">
                {isLoading ? 
                ( <ChartSkeleton length={15} width={10} /> ):(
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" className='text-sm' dy={5} />
                    <YAxis className='text-sm'/>
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}