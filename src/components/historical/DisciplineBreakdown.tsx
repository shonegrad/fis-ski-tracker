import { Target } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { getDisciplinePerformanceData } from '../../utils/historicalUtils';

interface DisciplineBreakdownProps {
  disciplineBreakdown: {
    [discipline: string]: {
      races: number;
      wins: number;
      podiums: number;
    };
  };
}

export function DisciplineBreakdown({ disciplineBreakdown }: DisciplineBreakdownProps) {
  return (
    <div>
      <h3 className="title-medium text-on-surface mb-4 flex items-center gap-2">
        <Target className="h-5 w-5" />
        Discipline Breakdown
      </h3>
      <div className="grid gap-3">
        {Object.entries(disciplineBreakdown).map(([discipline, data]) => {
          const { winRate, podiumRate, otherResults } = getDisciplinePerformanceData(data);

          return (
            <Card key={discipline} className="rounded-xl bg-surface-container-lowest border border-outline-variant/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="body-large text-on-surface font-medium">{discipline}</h4>
                  <Badge 
                    variant="outline" 
                    className="border-outline bg-surface-container text-on-surface rounded-lg"
                  >
                    {data.races} races
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="body-large text-warning font-medium">{data.wins}</div>
                    <div className="body-small text-on-surface-variant">Wins ({winRate}%)</div>
                  </div>
                  <div className="text-center">
                    <div className="body-large text-primary font-medium">{data.podiums}</div>
                    <div className="body-small text-on-surface-variant">Podiums ({podiumRate}%)</div>
                  </div>
                  <div className="text-center">
                    <div className="body-large text-on-surface font-medium">{otherResults}</div>
                    <div className="body-small text-on-surface-variant">Other</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}