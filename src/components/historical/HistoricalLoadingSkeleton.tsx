import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function HistoricalLoadingSkeleton() {
  return (
    <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 headline-small text-on-surface">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-on-primary-container" />
          </div>
          Historical Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-container-lowest">
              <Skeleton className="h-8 w-12 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="rounded-xl bg-surface-container-lowest border-0">
              <CardContent className="p-4">
                <Skeleton className="h-5 w-32 mb-3" />
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="text-center">
                      <Skeleton className="h-6 w-8 mx-auto mb-1" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}