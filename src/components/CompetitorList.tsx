import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft, Trophy, User, Award, RefreshCw } from 'lucide-react';
import { HistoricalComparison } from './HistoricalComparison';
import { 
  competitors, 
  raceResults, 
  races, 
  getLocationById, 
  getRaceById, 
  disciplineNames,
  type Competitor 
} from '../data/mockData';
import fisService from '../services/fisService';

export function CompetitorList() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [syncedCompetitors, setSyncedCompetitors] = useState<Competitor[]>([]);
  const [syncing, setSyncing] = useState(false);

  const syncCompetitors = async () => {
    try {
      setSyncing(true);
      await fisService.syncCompetitors(competitors);
      const stored = await fisService.getStoredCompetitors();
      setSyncedCompetitors(stored);
    } catch (error) {
      console.error('Failed to sync competitors:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    // Load stored competitors on mount
    const loadStoredCompetitors = async () => {
      try {
        const stored = await fisService.getStoredCompetitors();
        setSyncedCompetitors(stored);
      } catch (error) {
        console.error('Failed to load stored competitors:', error);
      }
    };
    loadStoredCompetitors();
  }, []);
  
  if (selectedCompetitor) {
    // Get all results for this competitor
    const competitorResults = raceResults
      .filter(result => result.competitorId === selectedCompetitor.id)
      .map(result => {
        const race = getRaceById(result.raceId);
        const location = race ? getLocationById(race.locationId) : null;
        return {
          ...result,
          race,
          location
        };
      })
      .sort((a, b) => new Date(b.race?.date || '').getTime() - new Date(a.race?.date || '').getTime());

    const wins = competitorResults.filter(r => r.position === 1).length;
    const podiums = competitorResults.filter(r => r.position <= 3).length;
    
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => setSelectedCompetitor(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Competitors
        </Button>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedCompetitor.name}
            </CardTitle>
            <CardDescription>
              <Badge variant="outline" className="mr-2">{selectedCompetitor.country}</Badge>
              <span>Age: {selectedCompetitor.age}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{wins}</div>
                <div className="text-sm text-muted-foreground">Race Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{podiums}</div>
                <div className="text-sm text-muted-foreground">Podiums</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedCompetitor.worldCupWins}</div>
                <div className="text-sm text-muted-foreground">Career Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedCompetitor.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <HistoricalComparison 
          competitorId={selectedCompetitor.id}
          competitorName={selectedCompetitor.name}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {competitorResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Discipline</TableHead>
                    <TableHead className="text-center">Position</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitorResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {result.race ? new Date(result.race.date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {result.location?.name}
                          <Badge variant="outline" className="text-xs">
                            {result.location?.country}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {result.race ? disciplineNames[result.race.discipline] : 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {result.position <= 3 && (
                            <Trophy className={`h-4 w-4 ${
                              result.position === 1 ? 'text-yellow-500' :
                              result.position === 2 ? 'text-gray-400' :
                              'text-amber-600'
                            }`} />
                          )}
                          {result.position}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{result.time}</TableCell>
                      <TableCell className="text-right">{result.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No results available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Sort competitors by total points (descending)
  const sortedCompetitors = [...competitors].sort((a, b) => b.totalPoints - a.totalPoints);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Competitors</h2>
        <Button
          variant="outline"
          onClick={syncCompetitors}
          disabled={syncing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Data'}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedCompetitors.map((competitor, index) => {
          // Calculate recent performance metrics
          const competitorRaceResults = raceResults.filter(r => r.competitorId === competitor.id);
          const wins = competitorRaceResults.filter(r => r.position === 1).length;
          const podiums = competitorRaceResults.filter(r => r.position <= 3).length;
          
          return (
            <Card key={competitor.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{competitor.name}</span>
                  <Badge variant="outline">#{index + 1}</Badge>
                </CardTitle>
                <CardDescription>
                  <Badge variant="outline">{competitor.country}</Badge>
                  <span className="ml-2">Age: {competitor.age}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">{wins}</div>
                      <div className="text-muted-foreground">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{podiums}</div>
                      <div className="text-muted-foreground">Podiums</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{competitor.totalPoints}</div>
                      <div className="text-muted-foreground">Points</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedCompetitor(competitor)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}