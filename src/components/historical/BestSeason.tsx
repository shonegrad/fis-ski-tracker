import { Trophy } from 'lucide-react';
import { Badge } from '../ui/badge';

interface BestSeasonProps {
  bestSeason: string;
}

export function BestSeason({ bestSeason }: BestSeasonProps) {
  return (
    <div>
      <h3 className="title-medium text-on-surface mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Best Season
      </h3>
      <Badge className="bg-tertiary-container text-on-tertiary-container border-0 rounded-lg body-large px-4 py-2">
        {bestSeason}
      </Badge>
    </div>
  );
}