import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TrendingUp } from 'lucide-react';
import { historicalDataService, type HistoricalData } from '../services/historicalDataService';
import { calculatePercentage } from '../utils/historicalUtils';
import { OverallStatistics } from './historical/OverallStatistics';
import { BestSeason } from './historical/BestSeason';
import { DisciplineBreakdown } from './historical/DisciplineBreakdown';
import { HistoricalLoadingSkeleton } from './historical/HistoricalLoadingSkeleton';

interface HistoricalComparisonProps {
  competitorId: string;
  competitorName: string;
}

export function HistoricalComparison({ competitorId, competitorName }: HistoricalComparisonProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<string>('5');

  const fetchHistoricalData = async (years: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await historicalDataService.fetchHistoricalData(competitorId, years);
      setHistoricalData(data);
    } catch (err) {
      setError('Failed to load historical data');
      console.error('Historical data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData(parseInt(selectedYears));
  }, [competitorId, selectedYears]);

  const handleYearsChange = (years: string) => {
    setSelectedYears(years);
  };

  if (loading) {
    return <HistoricalLoadingSkeleton />;
  }

  if (error || !historicalData) {
    return (
      <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 headline-small text-on-surface">
            <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-on-error-container" />
            </div>
            Historical Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="body-large text-on-surface-variant">{error || 'Historical data unavailable'}</p>
            <Button 
              onClick={() => fetchHistoricalData(parseInt(selectedYears))}
              variant="outline"
              className="border-outline hover:bg-surface-container"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { stats } = historicalData;
  const winPercentage = calculatePercentage(stats.wins, stats.totalRaces);
  const podiumPercentage = calculatePercentage(stats.podiums, stats.totalRaces);

  return (
    <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 headline-small text-on-surface">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-on-primary-container" />
            </div>
            Historical Performance - {competitorName}
          </div>
          <Select value={selectedYears} onValueChange={handleYearsChange}>
            <SelectTrigger className="w-[120px] bg-surface-container-lowest border-outline-variant">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-high border-outline-variant">
              <SelectItem value="3">3 Years</SelectItem>
              <SelectItem value="5">5 Years</SelectItem>
              <SelectItem value="10">10 Years</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
        <p className="body-small text-on-surface-variant">
          Period: {historicalData.period}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <OverallStatistics 
            stats={stats} 
            winPercentage={winPercentage} 
            podiumPercentage={podiumPercentage} 
          />
          
          <BestSeason bestSeason={stats.bestSeason} />
          
          <DisciplineBreakdown disciplineBreakdown={stats.disciplineBreakdown} />

          <div className="pt-4 border-t border-outline-variant/20 body-small text-on-surface-variant">
            Last updated: {new Date(historicalData.lastUpdated).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}