import { BarChart3 } from 'lucide-react';

interface OverallStatisticsProps {
  stats: {
    totalRaces: number;
    wins: number;
    podiums: number;
    averagePoints: number;
  };
  winPercentage: string;
  podiumPercentage: string;
}

export function OverallStatistics({ stats, winPercentage, podiumPercentage }: OverallStatisticsProps) {
  return (
    <div>
      <h3 className="title-medium text-on-surface mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Overall Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
          <div className="headline-medium text-on-surface">{stats.totalRaces}</div>
          <div className="body-small text-on-surface-variant">Total Races</div>
        </div>
        <div className="text-center p-4 bg-warning-container rounded-xl">
          <div className="headline-medium text-on-warning-container">{stats.wins}</div>
          <div className="body-small text-on-warning-container">Wins ({winPercentage}%)</div>
        </div>
        <div className="text-center p-4 bg-primary-container rounded-xl">
          <div className="headline-medium text-on-primary-container">{stats.podiums}</div>
          <div className="body-small text-on-primary-container">Podiums ({podiumPercentage}%)</div>
        </div>
        <div className="text-center p-4 bg-success-container rounded-xl">
          <div className="headline-medium text-on-success-container">{stats.averagePoints}</div>
          <div className="body-small text-on-success-container">Avg Points</div>
        </div>
      </div>
    </div>
  );
}