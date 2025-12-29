import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft, Trophy, Clock, MapPin, Calendar, RefreshCw } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { CourseDetails } from './CourseDetails';
import { 
  getRacesBySeason, 
  getLocationById, 
  getCompetitorById, 
  getRaceResults, 
  disciplineNames,
  type Race 
} from '../data/mockData';
import fisService from '../services/fisService';

interface RaceResultsProps {
  selectedSeason: '2024/2025' | '2025/2026';
}

export function RaceResults({ selectedSeason }: RaceResultsProps) {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [liveResults, setLiveResults] = useState<any>(null);
  const [loadingLive, setLoadingLive] = useState(false);

  const refreshLiveData = async (raceId: string) => {
    if (loadingLive) return;
    
    try {
      setLoadingLive(true);
      const data = await fisService.getRaceResults(raceId);
      setLiveResults(data);
    } catch (error) {
      console.error('Failed to refresh live data:', error);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    if (selectedRace && selectedRace.status === 'completed') {
      refreshLiveData(selectedRace.id);
    }
  }, [selectedRace]);
  
  if (selectedRace) {
    const location = getLocationById(selectedRace.locationId);
    // Use live results if available, otherwise fallback to mock data
    const results = liveResults?.results || getRaceResults(selectedRace.id).sort((a, b) => a.position - b.position);
    
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => setSelectedRace(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Button>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  {disciplineNames[selectedRace.discipline]} - {location?.name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshLiveData(selectedRace.id)}
                  disabled={loadingLive || selectedRace.status !== 'completed'}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingLive ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedRace.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location?.country}
                </span>
                <Badge variant={selectedRace.status === 'completed' ? 'default' : 'outline'}>
                  {selectedRace.status.charAt(0).toUpperCase() + selectedRace.status.slice(1)}
                </Badge>
                {liveResults && (
                  <Badge variant="secondary">
                    Live Data: {new Date(liveResults.lastUpdated).toLocaleTimeString()}
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Pos.</TableHead>
                      <TableHead>Competitor</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result: any) => {
                      const competitor = getCompetitorById(result.competitorId);
                      return (
                        <TableRow key={result.id || `${result.position}-${result.competitorId}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
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
                          <TableCell>{competitor?.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{competitor?.country}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {result.time}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{result.points}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Results not available yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Weather and Course Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <WeatherWidget locationId={selectedRace.locationId} date={selectedRace.date} />
            <CourseDetails 
              locationId={selectedRace.locationId} 
              locationName={location?.name || 'Unknown'}
              discipline={selectedRace.discipline}
            />
          </div>
        </div>
      </div>
    );
  }

  const seasonRaces = getRacesBySeason(selectedSeason);
  
  return (
    <div>
      <h2 className="mb-4">Race Results - {selectedSeason}</h2>
      <div className="grid gap-4">
        {seasonRaces.map((race) => {
          const location = getLocationById(race.locationId);
          const results = getRaceResults(race.id);
          const winner = results.find(r => r.position === 1);
          const winnerCompetitor = winner ? getCompetitorById(winner.competitorId) : null;
          
          return (
            <Card key={race.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {disciplineNames[race.discipline]} - {location?.name}
                  </div>
                  <Badge variant={race.status === 'completed' ? 'default' : race.status === 'scheduled' ? 'outline' : 'destructive'}>
                    {race.status.charAt(0).toUpperCase() + race.status.slice(1)}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(race.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {location?.country}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    {race.status === 'completed' && winnerCompetitor ? (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>Winner: {winnerCompetitor.name}</span>
                        <Badge variant="outline">{winnerCompetitor.country}</Badge>
                        {winner && (
                          <span className="text-muted-foreground">({winner.time})</span>
                        )}
                      </div>
                    ) : race.status === 'scheduled' ? (
                      <p className="text-muted-foreground">Race scheduled</p>
                    ) : (
                      <p className="text-muted-foreground">Race cancelled</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRace(race)}
                    disabled={race.status !== 'completed'}
                  >
                    {race.status === 'completed' ? 'View Results' : 'Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {seasonRaces.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No races scheduled for the {selectedSeason} season.
        </p>
      )}
    </div>
  );
}