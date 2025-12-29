import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { fallbackDataService, getCountryFlag } from '../services/dataService';
import { ArrowLeft, Calendar, MapPin, Trophy, Mountain, Wind, Clock, Timer } from 'lucide-react';

export default function RaceDetail() {
    const { raceId } = useParams();
    const navigate = useNavigate();
    const [race, setRace] = useState<any>(null);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!raceId) return;
            setLoading(true);
            try {
                const raceDetails = await fallbackDataService.getRaceDetails(raceId);
                if (raceDetails) {
                    setRace(raceDetails);
                    const raceResults = await fallbackDataService.getRaceResults(raceId);
                    setResults(raceResults);
                }
            } catch (error) {
                console.error('Failed to load race details:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [raceId]);

    if (loading) {
        return <div className="p-6">Loading race details...</div>;
    }

    if (!race) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold mb-4">Race not found</h2>
                <Button onClick={() => navigate('/races')}>Back to Calendar</Button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative rounded-3xl overflow-hidden bg-surface-container-low h-[300px] border-0 elevation-2">
                <img
                    src={race.image}
                    alt={race.location}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute top-6 left-6">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="backdrop-blur-md bg-black/30 hover:bg-black/50 text-white border-white/20"
                        onClick={() => navigate('/races')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Calendar
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary text-on-primary border-0">{race.discipline}</Badge>
                                <Badge variant={race.status === 'completed' ? 'secondary' : 'default'} className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border-0">
                                    {race.status.toUpperCase()}
                                </Badge>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                                {race.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/90">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span className="text-lg">{race.location}, {race.country}</span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span className="text-lg">{new Date(race.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block text-right text-white/80 max-w-md">
                            <p className="text-sm line-clamp-3 leading-relaxed">
                                {race.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="results" className="space-y-6">
                <TabsList className="bg-surface-container p-1 rounded-xl w-full md:w-auto overflow-x-auto justify-start">
                    <TabsTrigger value="results" className="rounded-lg px-6">Results</TabsTrigger>
                    <TabsTrigger value="course" className="rounded-lg px-6">Course Info</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg px-6">History</TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="space-y-6">
                    {race.status === 'scheduled' ? (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-medium mb-2">Race Scheduled</h3>
                                <p>Start list and live timing will appear here.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="overflow-hidden border-0 elevation-1 bg-surface-container-low">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/50 bg-surface-container/50">
                                            <th className="py-4 px-6 text-left font-medium text-muted-foreground w-16">Rank</th>
                                            <th className="py-4 px-6 text-left font-medium text-muted-foreground w-16">Bib</th>
                                            <th className="py-4 px-6 text-left font-medium text-muted-foreground">Athlete</th>
                                            <th className="py-4 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Run 1</th>
                                            <th className="py-4 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Run 2</th>
                                            <th className="py-4 px-6 text-right font-medium text-muted-foreground">Time</th>
                                            <th className="py-4 px-6 text-right font-medium text-muted-foreground">Gap</th>
                                            <th className="py-4 px-6 text-right font-medium text-muted-foreground">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((result) => (
                                            <tr key={result.rank} className="border-b border-border/50 hover:bg-surface-container/30 transition-colors">
                                                <td className="py-3 px-6 font-bold">
                                                    {result.rank === 1 ? <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500/20" /> : result.rank}
                                                </td>
                                                <td className="py-3 px-6 text-muted-foreground">{result.bib}</td>
                                                <td className="py-3 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getCountryFlag(result.country)}
                                                            alt={result.country}
                                                            className="w-5 h-3.5 object-cover rounded shadow-sm"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-foreground">{result.name}</div>
                                                            <div className="text-xs text-muted-foreground md:hidden">{result.country}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-muted-foreground text-sm font-mono hidden md:table-cell">{result.run1}</td>
                                                <td className="py-3 px-4 text-muted-foreground text-sm font-mono hidden md:table-cell">{result.run2}</td>
                                                <td className="py-3 px-6 text-right font-mono font-medium">{result.time}</td>
                                                <td className="py-3 px-6 text-right text-muted-foreground font-mono text-sm">{result.gap}</td>
                                                <td className="py-3 px-6 text-right font-bold text-primary">{result.points > 0 ? result.points : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="course" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mountain className="w-5 h-5 text-primary" />
                                    Course Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Name</span>
                                    <span className="font-medium">{race.course?.name || 'Standard Course'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Start Altitude</span>
                                    <span className="font-medium">{race.course?.altitude || 2000}m</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Finish Altitude</span>
                                    <span className="font-medium">{race.course?.finishAltitude || (race.course?.altitude - race.course?.verticalDrop) || 1500}m</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Vertical Drop</span>
                                    <span className="font-medium">{race.course?.verticalDrop}m</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Gates</span>
                                    <span className="font-medium">{race.course?.gates}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wind className="w-5 h-5 text-blue-400" />
                                    Conditions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-surface-container/50 rounded-xl">
                                    <div className="text-4xl font-bold">{race.weather?.current?.temperature}°C</div>
                                    <div className="text-muted-foreground">
                                        <div>{race.weather?.current?.condition}</div>
                                        <div>Wind: {race.weather?.current?.windSpeed} km/h</div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Forecast</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {race.weather?.forecast?.map((day: any, i: number) => (
                                            <div key={i} className="text-center p-3 bg-surface-container/30 rounded-lg">
                                                <div className="text-xs font-bold mb-1">{day.day}</div>
                                                <div className="text-lg font-medium">{day.high}°</div>
                                                <div className="text-xs text-muted-foreground">{day.condition}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Past Winners at {race.location}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {race.history?.map((entry: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-surface-container/30 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="text-xl font-bold text-muted-foreground w-12">{entry.year}</div>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getCountryFlag(entry.country)}
                                                    alt={entry.country}
                                                    className="w-6 h-4 object-cover rounded shadow-sm"
                                                />
                                                <span className="font-medium text-lg">{entry.winner}</span>
                                            </div>
                                        </div>
                                        <div className="font-mono text-primary font-medium">{entry.time}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
