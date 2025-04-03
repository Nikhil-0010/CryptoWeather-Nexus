'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWeatherData } from '@/redux/features/weatherSlice';
import { fetchCryptoData } from '@/redux/features/cryptoSlice';
import { fetchNewsData } from '@/redux/features/newsSlice';
import { initializeWebSocket, initializeWeatherAlerts } from '@/utils/websocket';
import WeatherSection from '@/components/weather/WeatherSection';
import CryptoSection from '@/components/crypto/CryptoSection';
import NewsSection from '@/components/news/NewsSection';
import { ThemeToggle } from '@/components/ThemeToggle';
import { loadPreferences } from '@/redux/features/preferencesSlice';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize WebSocket connection
    initializeWebSocket();
    initializeWeatherAlerts();

    dispatch(loadPreferences());
    

    // Fetch initial data
    ['New York', 'London', 'Tokyo'].forEach((city) => {
      dispatch(fetchWeatherData(city));
    });

    ['bitcoin', 'ethereum', 'cardano'].forEach((crypto) => {
      dispatch(fetchCryptoData(crypto));
    });

    dispatch(fetchNewsData());
    

  }, [dispatch]);

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-4 ">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">CryptoWeather Nexus</h1>
            <div className='border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800'>
            <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4  py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          <div className='grid grid-cols-1 md:grid-row-2 xl:grid-row-2 xl:grid-cols-1 gap-8'>
          <CryptoSection />
          <WeatherSection />
          </div>
          <NewsSection />
        </div>
      </div>
    </main>
  );
}