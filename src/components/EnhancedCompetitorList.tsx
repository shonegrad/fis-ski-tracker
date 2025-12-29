import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Trophy, User, Award, TrendingUp, BarChart3, Calendar, Target } from 'lucide-react';
import { fallbackDataService } from '../services/dataService';
import { AthleteImage } from './AthleteImage';

export interface Competitor {
  id: string;
  name: string;
  country: string;
  age: number;
  disciplines: string[];
  worldCupPoints: number;
  rank: number;
  image: string;
  worldCupWins?: number;
  totalPoints?: number;
}

const disciplineNames = {
  'DH': 'Downhill',
  'SG': 'Super Giant Slalom',
  'GS': 'Giant Slalom',
  'SL': 'Slalom'
};

// Helper function to get country code for flag
const getCountryCode = (country: string): string => {
  const countryMap: Record<string, string> = {
    'Switzerland': 'ch',
    'Norway': 'no',
    'France': 'fr',
    'Croatia': 'hr',
    'Austria': 'at',
    'Brazil': 'br',
    'Italy': 'it',
    'Germany': 'de',
    'USA': 'us'
  };
  return countryMap[country] || 'us';
};

interface EnhancedCompetitorListProps {
  selectedSeason: '2024/2025' | '2025/2026';
  selectedCompetitorId?: string | null;
  onBack?: () => void;
  onCompetitorSelect?: (competitorId: string) => void;
}

export function EnhancedCompetitorList({
  selectedSeason,
  selectedCompetitorId,
  onBack,
  onCompetitorSelect
}: EnhancedCompetitorListProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [competitorDetails, setCompetitorDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    loadCompetitors();
  }, [selectedSeason]);

  useEffect(() => {
    if (selectedCompetitorId) {
      const competitor = competitors.find(c => c.id === selectedCompetitorId);
      if (competitor) {
        setSelectedCompetitor(competitor);
        loadCompetitorDetails(selectedCompetitorId);
      }
    }
  }, [selectedCompetitorId, competitors]);

  const loadCompetitors = async () => {
    try {
      setLoading(true);
      const data = await fallbackDataService.getCompetitors(selectedSeason);
      setCompetitors(data);
    } catch (error) {
      console.error('Failed to load competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompetitorDetails = async (competitorId: string) => {
    try {
      setDetailsLoading(true);
      const data = await fallbackDataService.getCompetitorDetails(competitorId);
      setCompetitorDetails(data);
    } catch (error) {
      console.error('Failed to load competitor details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCompetitorSelect = (competitor: Competitor) => {
    setSelectedCompetitor(competitor);
    loadCompetitorDetails(competitor.id);
    onCompetitorSelect?.(competitor.id);
  };

  const handleBack = () => {
    setSelectedCompetitor(null);
    setCompetitorDetails(null);
    onBack?.();
  };

  if (selectedCompetitor && competitorDetails) {

    return (
      <div>
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Competitors
        </Button>

        <Card className="mb-6 overflow-hidden rounded-2xl bg-surface-container-low border-0">
          {/* Athlete Header with Photo and Country Flag Background */}
          <div className="relative h-32 overflow-hidden group">
            {/* Country Flag Background with Wave Animation */}
            <div
              className="absolute inset-0 opacity-70 transition-all duration-300 group-hover:animate-pulse"
              style={{
                backgroundImage: `url(https://flagcdn.com/w320/${getCountryCode(selectedCompetitor.country)}.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage: `url(https://flagcdn.com/w320/${getCountryCode(selectedCompetitor.country)}.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {/* Light Shadow for Text Readability */}
            <div className="absolute inset-0 bg-black/30" />

            <div className="flex items-center gap-4 mb-2 ml-4">
              <img
                src={selectedCompetitor.image}
                alt={selectedCompetitor.country}
                className="w-12 h-auto rounded-md shadow-sm"
              />
              <div className="text-white">
                <div className="bg-black/70 rounded-xl px-3 py-2 backdrop-blur-sm inline-block">
                  <h1 className="headline-large font-bold drop-shadow-sm">{selectedCompetitor.name}</h1>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {selectedCompetitor.country}
                  </Badge>
                  <span className="body-medium drop-shadow-sm">Age: {selectedCompetitor.age} • World Cup Competitor</span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{competitorDetails.worldCupWins}</div>
                <div className="text-sm text-muted-foreground">Career Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{competitorDetails.olympicMedals}</div>
                <div className="text-sm text-muted-foreground">Olympic Medals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{competitorDetails.worldChampionships}</div>
                <div className="text-sm text-muted-foreground">World Championships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{selectedCompetitor.age}</div>
                <div className="text-sm text-muted-foreground">Age</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{competitorDetails.height}</div>
                <div className="text-sm text-muted-foreground">Height</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{competitorDetails.weight}</div>
                <div className="text-sm text-muted-foreground">Weight</div>
              </div>
            </div>
          </CardContent>
        </Card >

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="disciplines">Disciplines</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Birth Date:</span>
                    <span>{new Date(competitorDetails.birthDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Birth Place:</span>
                    <span>{competitorDetails.birthPlace}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">World Cup Debut:</span>
                    <span>{competitorDetails.worldCupDebut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height:</span>
                    <span>{competitorDetails.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>{competitorDetails.weight}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Career Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">World Cup Wins</span>
                      </div>
                      <span className="font-semibold text-yellow-600">{competitorDetails.worldCupWins}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Olympic Medals</span>
                      </div>
                      <span className="font-semibold text-blue-600">{competitorDetails.olympicMedals}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm">World Championships</span>
                      </div>
                      <span className="font-semibold text-green-600">{competitorDetails.worldChampionships}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="disciplines" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Competing Disciplines</CardTitle>
                <CardDescription>Alpine skiing disciplines the athlete competes in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {competitorDetails.disciplines.map((discipline: string) => (
                    <Badge key={discipline} variant="secondary" className="text-sm">
                      {discipline}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div >
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const sortedCompetitors = competitors.sort((a, b) => a.rank - b.rank);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>World Cup Standings - {selectedSeason}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedCompetitors.map((competitor) => {
          return (
            <Card
              key={competitor.id}
              className="group cursor-pointer hover:elevation-3 transition-all duration-300 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl border-0 bg-card hover:scale-[1.02]"
              onClick={() => handleCompetitorSelect(competitor)}
            >
              {/* Athlete Photo Header with Country Flag Background */}
              <div className="relative h-32 overflow-hidden">
                {/* Country Flag Background with Wave Animation */}
                <div
                  className="absolute inset-0 opacity-60 transition-all duration-300 group-hover:animate-pulse"
                  style={{
                    backgroundImage: `url(https://flagcdn.com/w320/${getCountryCode(competitor.country)}.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'translateX(0)',
                    animation: 'none'
                  }}
                />
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage: `url(https://flagcdn.com/w320/${getCountryCode(competitor.country)}.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                {/* Light Shadow for Text Readability */}
                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/95 text-black border-0 rounded-xl shadow-sm text-lg font-bold px-3 py-1">
                    #{competitor.rank}
                  </Badge>
                  {competitor.worldCupPoints > 1000 && <Trophy className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="absolute bottom-3 left-3 flex items-end gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="bg-black/70 rounded-lg px-2 py-1 backdrop-blur-sm self-start">
                      <h3 className="body-large font-bold drop-shadow-sm text-white">{competitor.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src={competitor.image}
                        alt={competitor.country}
                        className="w-8 h-auto rounded shadow-sm"
                      />
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 body-small">
                        {competitor.country}
                      </Badge>
                      {competitor.age < 25 && <Badge variant="secondary" className="bg-yellow-500/80 text-white border-0 body-small">Rising Star</Badge>}
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="space-y-4">
                  {/* Age and World Cup Points */}
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{competitor.worldCupPoints}</div>
                      <div className="text-xs text-on-surface-variant uppercase tracking-wide">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-secondary">{competitor.age}</div>
                      <div className="text-xs text-on-surface-variant uppercase tracking-wide">Age</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-tertiary">{competitor.disciplines.length}</div>
                      <div className="text-xs text-on-surface-variant uppercase tracking-wide">Events</div>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="body-small text-on-surface-variant">Season Performance</span>
                      <span className="body-small font-medium text-on-surface">
                        {competitor.worldCupPoints > 1200 ? 'Excellent' : competitor.worldCupPoints > 800 ? 'Good' : 'Developing'}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((competitor.worldCupPoints / 1600) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Disciplines */}
                  <div>
                    <p className="body-small text-on-surface-variant mb-2">Competing in:</p>
                    <div className="flex flex-wrap gap-1">
                      {competitor.disciplines.slice(0, 2).map(discipline => (
                        <Badge key={discipline} variant="secondary" className="body-small px-2 py-1 rounded-lg">
                          {discipline}
                        </Badge>
                      ))}
                      {competitor.disciplines.length > 2 && (
                        <Badge variant="secondary" className="body-small px-2 py-1 rounded-lg">
                          +{competitor.disciplines.length - 2} more
                        </Badge>
                      )}
                    </div>
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