'use client';

import WeatherSection from '@/components/weather/WeatherSection';
import CryptoSection from '@/components/crypto/CryptoSection';
import NewsSection from '@/components/news/NewsSection';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
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
