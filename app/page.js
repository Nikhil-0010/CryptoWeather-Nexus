'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { fetchWeatherData } from '@/redux/features/weatherSlice';
import { fetchCryptoData } from '@/redux/features/cryptoSlice';
import { fetchNewsData } from '@/redux/features/newsSlice';
import { initializeWebSocket, initializeWeatherAlerts } from '@/utils/websocket';
import WeatherSection from '@/components/weather/WeatherSection';
import CryptoSection from '@/components/crypto/CryptoSection';
import NewsSection from '@/components/news/NewsSection';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize WebSocket connection
    initializeWebSocket();
    initializeWeatherAlerts();

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
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm-6 lg-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">CryptoWeather Nexus</h1>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm-6 lg-8 py-8">
        <div className="grid grid-cols-1 md-cols-2 lg-cols-3 gap-8">
          <WeatherSection />
          <CryptoSection />
          <NewsSection />
        </div>
      </div>
    </main>
  );
}