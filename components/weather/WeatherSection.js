'use client';

import { useSelector } from 'react-redux';
import { Cloud, CloudRain, Sun, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Star } from 'lucide-react';

const WeatherIcon = ({ conditions }) => {
  switch (conditions.toLowerCase()) {
    case 'rain':
      return <CloudRain className="h-6 w-6" />;
    case 'clouds':
      return <Cloud className="h-6 w-6" />;
    default:
      return <Sun className="h-6 w-6" />;
  }
};

export default function WeatherSection() {
  const cities = useSelector((state) => state.weather.cities);
  const favoriteCities = useSelector((state) => state.preferences.favoriteCities);

  return (
    <Card className="space-y-4 p-4 h-fit shadow-md dark:shadow-neutral-800 dark:shadow-sm">
      <h2 className="text-xl font-bold">Weather Updates</h2>
      <div className="grid">
        {Object.entries(cities).map(([city, data]) => (
          <Link key={city} href={`/weather/${encodeURIComponent(city)}`}>
            <Card className="hover:bg-neutral-100 dark:hover:bg-neutral-900 bg-opacity-5 dark:bg-opacity-60  transition-all duration-100 border-t-0 border-x-0 shadow-none border-b rounded-none hover:rounded-md px-1">

              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-1">
                <div className='flex items-center gap-2'>
                  <CardTitle className="text-sm font-medium">{city}</CardTitle>
                  <div
                    className="text-muted-foreground hover:text-primary"
                  >
                    {favoriteCities.includes(city) ? <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> : null}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className="text-sm text-muted-foreground">
                    {data.conditions}
                  </div>
                  <WeatherIcon conditions={data.conditions} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Thermometer className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-xl font-bold">
                      {Math.round(data.temperature)}°C
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Humidity: {data.humidity}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Card>
  );
}