'use client';

import { useSelector } from 'react-redux';
import { Cloud, CloudRain, Sun, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Weather Updates</h2>
      <div className="grid gap-4">
        {Object.entries(cities).map(([city, data]) => (
          <Link key={city} href={`/weather/${encodeURIComponent(city)}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{city}</CardTitle>
                <WeatherIcon conditions={data.conditions} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Thermometer className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {Math.round(data.temperature)}°C
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Humidity: {data.humidity}%
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {data.conditions}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}