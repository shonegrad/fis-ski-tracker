import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, Trophy, Medal, TrendingUp, Calendar, MapPin, Target, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { fallbackDataService } from '../services/fallbackDataService';
import { AthleteImage } from '../components/AthleteImage';

interface Athlete {
    id: string;
    name: string;
    country: string;
    age: number;
    disciplines: string[];
    worldCupPoints: number;
    rank: number;
    image: string;
}

interface RaceResult {
    raceId: string;
    raceName: string;
    location: string;
    date: string;
    discipline: string;
    rank: number;
    points: number;
    time?: string;
}

export default function AthleteDetail() {
    const { athleteId } = useParams<{ athleteId: string }>();
    const navigate = useNavigate();
    const { selectedSeason } = useAppContext();
    const [athlete, setAthlete] = useState<Athlete | null>(null);
    const [recentResults, setRecentResults] = useState<RaceResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAthleteData = async () => {
            setLoading(true);
            try {
                const competitors = await fallbackDataService.getCompetitors(selectedSeason);
                const found = competitors.find(c => c.id === athleteId);
                if (found) {
                    setAthlete(found);
                    // Generate mock recent results
                    const mockResults: RaceResult[] = [
                        { raceId: '1', raceName: 'Giant Slalom', location: 'Sölden', date: '2024-10-27', discipline: 'Giant Slalom', rank: 2, points: 80, time: '2:15.43' },
                        { raceId: '2', raceName: 'Slalom', location: 'Levi', date: '2024-11-17', discipline: 'Slalom', rank: 1, points: 100, time: '1:48.21' },
                        { raceId: '3', raceName: 'Giant Slalom', location: "Val d'Isère", date: '2024-12-08', discipline: 'Giant Slalom', rank: 3, points: 60, time: '2:18.67' },
                    ];
                    setRecentResults(mockResults);
                }
            } catch (error) {
                console.error('Error loading athlete:', error);
            }
            setLoading(false);
        };

        if (athleteId) {
            loadAthleteData();
        }
    }, [athleteId, selectedSeason]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="w-12 h-12 rounded-full border-4 border-muted animate-spin border-t-primary"></div>
            </div>
        );
    }

    if (!athlete) {
        return (
            <div className="p-6">
                <Button variant="ghost" onClick={() => navigate('/athletes')} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Athletes
                </Button>
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">Athlete not found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const flagEmoji = getCountryFlag(athlete.country);
    const podiums = recentResults.filter(r => r.rank <= 3).length;
    const wins = recentResults.filter(r => r.rank === 1).length;

    return (
        <div className="p-6 space-y-6">
            <Button variant="ghost" onClick={() => navigate('/athletes')} className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Athletes
            </Button>

            {/* Athlete Header */}
            <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6">
                    <div className="flex items-start gap-6">
                        <AthleteImage
                            athleteId={athlete.id}
                            athleteName={athlete.name}
                            size="lg"
                            className="ring-4 ring-background shadow-xl"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{athlete.name}</h1>
                                <span className="text-3xl">{flagEmoji}</span>
                            </div>
                            <p className="text-lg text-muted-foreground mb-4">{athlete.country} • {athlete.age} years old</p>
                            <div className="flex flex-wrap gap-2">
                                {athlete.disciplines.map((discipline) => (
                                    <Badge key={discipline} variant="secondary" className="text-sm">
                                        {discipline}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-primary">#{athlete.rank}</div>
                            <div className="text-sm text-muted-foreground">World Ranking</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-3 rounded-full bg-yellow-500/10">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{athlete.worldCupPoints}</div>
                            <div className="text-sm text-muted-foreground">World Cup Points</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Star className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{wins}</div>
                            <div className="text-sm text-muted-foreground">Race Wins</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-3 rounded-full bg-orange-500/10">
                            <Medal className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{podiums}</div>
                            <div className="text-sm text-muted-foreground">Podium Finishes</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-3 rounded-full bg-green-500/10">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{recentResults.length}</div>
                            <div className="text-sm text-muted-foreground">Races This Season</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Results */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Recent Results
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentResults.map((result) => (
                            <div
                                key={result.raceId}
                                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${result.rank === 1 ? 'bg-yellow-500/20 text-yellow-600' :
                                            result.rank === 2 ? 'bg-gray-300/30 text-gray-600' :
                                                result.rank === 3 ? 'bg-orange-500/20 text-orange-600' :
                                                    'bg-muted text-muted-foreground'
                                        }`}>
                                        {result.rank}
                                    </div>
                                    <div>
                                        <div className="font-medium">{result.raceName}</div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <MapPin className="w-3 h-3" />
                                            {result.location} • {new Date(result.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline">{result.discipline}</Badge>
                                    <div className="text-sm text-muted-foreground mt-1">+{result.points} pts</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Season Progress */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Season Progress
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Points Target (2000)</span>
                            <span className="text-sm text-muted-foreground">{Math.round((athlete.worldCupPoints / 2000) * 100)}%</span>
                        </div>
                        <Progress value={(athlete.worldCupPoints / 2000) * 100} className="h-2" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Races Completed</span>
                            <span className="text-sm text-muted-foreground">{recentResults.length}/30</span>
                        </div>
                        <Progress value={(recentResults.length / 30) * 100} className="h-2" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function getCountryFlag(country: string): string {
    const flags: Record<string, string> = {
        'Switzerland': '🇨🇭',
        'Austria': '🇦🇹',
        'Norway': '🇳🇴',
        'France': '🇫🇷',
        'Italy': '🇮🇹',
        'Germany': '🇩🇪',
        'USA': '🇺🇸',
        'Sweden': '🇸🇪',
        'Slovenia': '🇸🇮',
        'Croatia': '🇭🇷',
        'Canada': '🇨🇦',
        'Brazil': '🇧🇷',
    };
    return flags[country] || '🏳️';
}
