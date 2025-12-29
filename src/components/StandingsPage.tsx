import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Target,
  Mountain,
  Zap,
  BarChart3,
  Users,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { fallbackDataService, getCountryCode } from '../services/dataService';

interface Competitor {
  id: string;
  name: string;
  country: string;
  age: number;
  disciplines: string[];
  worldCupPoints: number;
  rank: number;
  image: string;
  previousRank?: number;
  disciplineRanks?: Record<string, { rank: number; points: number } | null>;
}

interface StandingsPageProps {
  selectedSeason: '2024/2025' | '2025/2026';
  onAthleteSelect?: (athleteId: string) => void;
}

const disciplineColors: Record<string, string> = {
  'slalom': 'bg-secondary-container text-on-secondary-container',
  'giant slalom': 'bg-primary-container text-on-primary-container',
  'super g': 'bg-warning-container text-on-warning-container',
  'downhill': 'bg-error-container text-on-error-container'
};



export function StandingsPage({ selectedSeason, onAthleteSelect }: StandingsPageProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState('overall');

  useEffect(() => {
    loadStandings();
  }, [selectedSeason]);

  const loadStandings = async () => {
    try {
      setLoading(true);
      const data = await fallbackDataService.getCompetitors(selectedSeason);
      // Add mock previous rankings for trend indicators
      const competitorsWithTrends = data.map((competitor, index) => ({
        ...competitor,
        previousRank: competitor.rank + Math.floor(Math.random() * 6) - 3 // Random previous rank for demo
      }));
      setCompetitors(competitorsWithTrends);
    } catch (error) {
      console.error('Failed to load standings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankTrend = (currentRank: number, previousRank?: number) => {
    if (!previousRank) return 'same';
    if (currentRank < previousRank) return 'up';
    if (currentRank > previousRank) return 'down';
    return 'same';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline.toLowerCase()) {
      case 'slalom': return Target;
      case 'giant slalom': return Mountain;
      case 'super g': return Zap;
      case 'downhill': return BarChart3;
      default: return Trophy;
    }
  };

  const getDisciplineStats = (competitor: Competitor, discipline: string) => {
    if (discipline === 'overall') {
      return { rank: competitor.rank, points: competitor.worldCupPoints };
    }
    const keyMap: Record<string, string> = {
      'slalom': 'slalom',
      'giant-slalom': 'giantSlalom',
      'super-g': 'superG',
      'downhill': 'downhill'
    };
    const key = keyMap[discipline];
    const stats = competitor.disciplineRanks?.[key];
    return stats ? { rank: stats.rank, points: stats.points } : null;
  };

  // Filter competitors by discipline
  const filteredCompetitors = competitors
    .filter(c => getDisciplineStats(c, selectedDiscipline) !== null)
    .sort((a, b) => {
      const statsA = getDisciplineStats(a, selectedDiscipline);
      const statsB = getDisciplineStats(b, selectedDiscipline);
      return (statsB?.points || 0) - (statsA?.points || 0);
    });

  // Top performers for charts
  const topPerformers = filteredCompetitors.slice(0, 10).map(c => ({
    name: c.name.split(' ').pop() || c.name,
    points: c.worldCupPoints,
    country: c.country
  }));

  // Discipline distribution for top 3
  const disciplineStats = competitors.slice(0, 3).map(competitor => {
    const disciplines = competitor.disciplines.reduce((acc: Record<string, number>, discipline) => {
      const key = discipline.toLowerCase();
      acc[key] = (acc[key] || 0) + Math.floor(competitor.worldCupPoints * Math.random() * 0.3);
      return acc;
    }, {});

    return {
      name: competitor.name.split(' ').pop() || competitor.name,
      slalom: disciplines.slalom || 0,
      'giant slalom': disciplines['giant slalom'] || 0,
      'super g': disciplines['super g'] || 0,
      downhill: disciplines.downhill || 0
    };
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topThree = filteredCompetitors.slice(0, 3);
  const leader = topThree[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            World Cup Standings
          </h1>
          <p className="text-muted-foreground mt-1">{selectedSeason} FIS Alpine World Cup Rankings</p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {filteredCompetitors.length} Athletes
          </Badge>
        </div>
      </div>

      {/* Leader Highlight */}
      {leader && (
        <Card className="rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={`https://flagcdn.com/w160/${getCountryCode(leader.country)}.png`}
                  alt={leader.country}
                  className="w-24 h-24 rounded-2xl border-4 border-yellow-300 shadow-lg object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-yellow-800" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold text-foreground">{leader.name}</h2>
                  <img
                    src={`https://flagcdn.com/24x18/${getCountryCode(leader.country)}.png`}
                    alt={leader.country}
                    className="rounded shadow-sm"
                  />
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Current World Cup Leader • {leader.country}
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{getDisciplineStats(leader, selectedDiscipline)?.points}</div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{leader.age}</div>
                    <div className="text-sm text-muted-foreground">Years Old</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{leader.disciplines.length}</div>
                    <div className="text-sm text-muted-foreground">Disciplines</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-2xl flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">Rank #{getDisciplineStats(leader, selectedDiscipline)?.rank}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
      }

      {/* Discipline Filter & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Filter by Discipline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={selectedDiscipline === 'overall' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedDiscipline('overall')}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Overall
              </Button>
              {['slalom', 'giant-slalom', 'super-g', 'downhill'].map(discipline => {
                const Icon = getDisciplineIcon(discipline.replace('-', ' '));
                const disciplineName = discipline.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

                return (
                  <Button
                    key={discipline}
                    variant={selectedDiscipline === discipline ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedDiscipline(discipline)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {disciplineName}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {/* Top 10 Chart */}
          <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Top 10 Point Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topPerformers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-elevation-2)'
                    }}
                  />
                  <Bar dataKey="points" fill="#1565C0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Discipline Breakdown - Top 3</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={disciplineStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="slalom" stackId="1" stroke="#37474F" fill="#37474F" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="giant slalom" stackId="1" stroke="#1565C0" fill="#1565C0" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="super g" stackId="1" stroke="#F57C00" fill="#F57C00" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="downhill" stackId="1" stroke="#C62828" fill="#C62828" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Podium */}
      <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Current Podium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topThree.map((athlete, index) => {
              const stats = getDisciplineStats(athlete, selectedDiscipline);
              const trend = getRankTrend(stats?.rank || 999, athlete.previousRank);
              const positions = ['🥇 1st', '🥈 2nd', '🥉 3rd'];
              const bgColors = [
                'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20',
                'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20',
                'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20'
              ];

              return (
                <div
                  key={athlete.id}
                  className={`${bgColors[index]} p-6 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
                  onClick={() => onAthleteSelect?.(athlete.id)}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{positions[index]}</div>
                    <div className="relative inline-block mb-4">
                      <img
                        src={`https://flagcdn.com/w160/${getCountryCode(athlete.country)}.png`}
                        alt={athlete.country}
                        className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg mx-auto object-cover"
                        style={{ aspectRatio: '4/3' }}
                      />
                      <div className="absolute -top-2 -right-2">
                        {getTrendIcon(trend)}
                      </div>
                    </div>

                    <div className="bg-black/70 rounded-xl px-3 py-2 backdrop-blur-sm inline-block mb-2">
                      <h3 className="font-bold text-white">{athlete.name}</h3>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-3">
                      <img
                        src={`https://flagcdn.com/20x15/${getCountryCode(athlete.country)}.png`}
                        alt={athlete.country}
                        className="rounded shadow-sm"
                      />
                      <span className="text-sm text-muted-foreground">{athlete.country}</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="text-xl font-bold text-primary">{stats?.points}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>
                      <div className="flex justify-center gap-1 flex-wrap">
                        {athlete.disciplines.slice(0, 2).map(discipline => (
                          <Badge
                            key={discipline}
                            variant="secondary"
                            className="text-xs px-2 py-1"
                          >
                            {discipline.slice(0, 3)}
                          </Badge>
                        ))}
                        {athlete.disciplines.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            +{athlete.disciplines.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Full Rankings Table */}
      <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">
            {selectedDiscipline === 'overall' ? 'Overall' : selectedDiscipline.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCompetitors.map((athlete, index) => {
              const stats = getDisciplineStats(athlete, selectedDiscipline);
              const trend = getRankTrend(stats?.rank || 999, athlete.previousRank);
              const isTopThree = index < 3;

              return (
                <div
                  key={athlete.id}
                  className={`
                    p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01]
                    ${isTopThree ? 'bg-primary/5 border-primary/20' : 'bg-surface-container border-border'}
                  `}
                  onClick={() => onAthleteSelect?.(athlete.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center gap-2 w-16">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm
                        ${isTopThree ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                      `}>
                        #{stats?.rank}
                      </div>
                      {getTrendIcon(trend)}
                    </div>

                    {/* Athlete Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={`https://flagcdn.com/w80/${getCountryCode(athlete.country)}.png`}
                        alt={athlete.country}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm"
                        style={{ aspectRatio: '4/3' }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="bg-black/70 rounded-lg px-2 py-1 backdrop-blur-sm inline-block mb-1">
                          <h3 className="font-medium text-white truncate">{athlete.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://flagcdn.com/16x12/${getCountryCode(athlete.country)}.png`}
                            alt={athlete.country}
                            className="rounded shadow-sm"
                          />
                          <span className="text-sm text-muted-foreground">{athlete.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{stats?.points}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-bold">{athlete.age}</div>
                        <div className="text-xs text-muted-foreground">Age</div>
                      </div>

                      <div className="hidden md:flex gap-1">
                        {athlete.disciplines.slice(0, 3).map(discipline => (
                          <Badge
                            key={discipline}
                            variant="outline"
                            className="text-xs px-2 py-1"
                          >
                            {discipline.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Points Progress */}
                    <div className="w-24 hidden lg:block">
                      <div className="text-xs text-muted-foreground mb-1">Season Progress</div>
                      <Progress
                        value={(athlete.worldCupPoints / (filteredCompetitors[0]?.worldCupPoints || 1)) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div >
  );
}