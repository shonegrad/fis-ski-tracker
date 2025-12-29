import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Cloud, Wind, Thermometer, Eye, CloudSnow } from 'lucide-react';
import { fallbackDataService } from '../services/dataService';

interface WeatherWidgetProps {
  locationId: string;
  date?: string;
}

interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    windSpeed: number;
    humidity: number;
    visibility: number;
    icon: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

export function WeatherWidget({ locationId, date }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fallbackDataService.getWeatherData(locationId);
        setWeather(data);
      } catch (err) {
        setError('Failed to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [locationId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error || 'Weather data unavailable'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Weather */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-lg font-semibold">{weather.current.temperature}°C</div>
                <div className="text-xs text-muted-foreground">Temperature</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-lg font-semibold">{weather.current.windSpeed} km/h</div>
                <div className="text-xs text-muted-foreground">Wind Speed</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-sm font-semibold">{weather.current.visibility} km</div>
                <div className="text-xs text-muted-foreground">Visibility</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CloudSnow className="h-4 w-4 text-white" />
              <div>
                <div className="text-sm font-semibold">{weather.current.condition}</div>
                <div className="text-xs text-muted-foreground">Condition</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm font-semibold">{weather.current.humidity}%</div>
                <div className="text-xs text-muted-foreground">Humidity</div>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">3-Day Forecast</h4>
            <div className="grid grid-cols-3 gap-2">
              {weather.forecast.map((day, index) => (
                <div key={index} className="text-center p-2 border rounded">
                  <div className="text-xs font-medium">{day.day}</div>
                  <div className="text-xs text-muted-foreground">{day.condition}</div>
                  <div className="text-sm">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-muted-foreground">/{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}