import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { LocationList } from './LocationList';
import { EnhancedRaceResults } from './EnhancedRaceResults';
import { EnhancedCompetitorList } from './EnhancedCompetitorList';

import {
  Trophy,
  MapPin,
  Users,
  Calendar,
  AlertCircle,
  Bell,
  BellOff,
  Camera,
  Video,
  TrendingUp,
  Mountain,
  Zap,
  Target,
  Clock,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { projectId, publicAnonKey, isConfigured } from '../utils/supabase/info';
import { fallbackDataService, getCountryCode } from '../services/dataService';

interface Race {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  status: 'scheduled' | 'live' | 'completed';
  discipline: string;
  locationId: string;
}

interface Location {
  id: string;
  name: string;
  country: string;
  elevation: number;
  raceCount: number;
  image: string;
  coordinates: { lat: number; lng: number };
}

interface Competitor {
  id: string;
  name: string;
  country: string;
  age: number;
  disciplines: string[];
  worldCupPoints: number;
  rank: number;
  image: string;
}

interface DashboardProps {
  selectedSeason: '2024/2025' | '2025/2026';
  onViewChange?: (view: string) => void;
}

export function Dashboard({ selectedSeason, onViewChange }: DashboardProps) {
  const [races, setRaces] = useState<Race[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [liveRaces, setLiveRaces] = useState<Race[]>([]);

  useEffect(() => {
    fetchDashboardData();
    checkNotificationStatus();

    // Set up periodic updates for live races
    const interval = setInterval(checkForLiveRaces, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [selectedSeason]);

  const checkNotificationStatus = async () => {
    const status = await notificationService.getSubscriptionStatus();
    setNotificationEnabled(status);
  };

  const checkForLiveRaces = async () => {
    // Skip live race checking when using fallback data to avoid errors
    // Currently using fallback data exclusively, so no live races to check
    return;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always use fallback data for reliable operation
      // This prevents "Failed to fetch" errors from non-existent API endpoints
      await loadFallbackData();

    } catch (err) {
      console.error('Dashboard data error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = async () => {
    const [racesData, locationsData, competitorsData] = await Promise.all([
      fallbackDataService.getRaces(selectedSeason),
      fallbackDataService.getLocations(selectedSeason),
      fallbackDataService.getCompetitors(selectedSeason)
    ]);

    setRaces(racesData);
    setLocations(locationsData);
    setCompetitors(competitorsData);

    // Update live races (none in fallback data)
    const live = racesData.filter((race: Race) => race.status === 'live');
    setLiveRaces(live);
  };

  const enableNotifications = async () => {
    setNotificationError(null);

    const result = await notificationService.subscribeToPushNotifications();

    if (result.subscription) {
      setNotificationEnabled(true);
      notificationService.showLocalNotification({
        id: 'welcome',
        type: 'race_result',
        title: 'Notifications Enabled',
        message: 'You will now receive live race updates and results',
        raceId: '',
        locationId: '',
        timestamp: new Date().toISOString()
      });
    } else if (result.error) {
      setNotificationError(result.error.message);
    }
  };

  const dismissNotificationError = () => {
    setNotificationError(null);
  };

  if (selectedRace) {
    return (
      <EnhancedRaceResults
        race={selectedRace}
        onBack={() => setSelectedRace(null)}
      />
    );
  }

  if (selectedCompetitor) {
    return (
      <EnhancedCompetitorList
        selectedSeason={selectedSeason}
        selectedCompetitorId={selectedCompetitor}
        onBack={() => setSelectedCompetitor(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const completedRaces = races.filter(race => race.status === 'completed');
  const upcomingRaces = races.filter(race => race.status === 'scheduled');
  const totalPhotos = races.length * 15; // Mock calculation
  const totalVideos = races.length * 3; // Mock calculation

  return (
    <div className="space-y-6">
      {/* Live Race Alert */}
      {liveRaces.length > 0 && (
        <Alert className="rounded-2xl border-error-container/50 bg-error-container/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
            <AlertCircle className="h-4 w-4 text-error" />
          </div>
          <AlertDescription className="text-on-error-container">
            <strong>Live Now:</strong> {liveRaces.map(race => `${race.name} in ${race.location}`).join(', ')}
            <Button
              variant="link"
              className="ml-2 p-0 h-auto text-error underline hover:text-error/80"
              onClick={() => setSelectedRace(liveRaces[0])}
            >
              Watch Live
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Notification Error */}
      {notificationError && (
        <Alert className="rounded-2xl border-error-container/50 bg-error-container/10">
          <AlertCircle className="h-4 w-4 text-error" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-on-error-container">{notificationError}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={dismissNotificationError}
              className="border-error text-error hover:bg-error/10"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Notification Banner */}
      {!notificationEnabled && !notificationError && (
        <Alert className="rounded-2xl border-primary-container/50 bg-primary-container/10">
          <Bell className="h-4 w-4 text-primary" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-on-primary-container">Enable notifications to get live race updates and results</span>
            <Button
              variant="outline"
              size="sm"
              onClick={enableNotifications}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Notification Enabled */}
      {notificationEnabled && (
        <Alert className="rounded-2xl border-success-container/50 bg-success-container/10">
          <Bell className="h-4 w-4 text-success" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-on-success-container">Notifications are enabled - you'll receive live race updates</span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const result = await notificationService.unsubscribeFromPushNotifications();
                if (result.success) {
                  setNotificationEnabled(false);
                }
              }}
              className="border-success text-success hover:bg-success/10"
            >
              <BellOff className="h-4 w-4 mr-2" />
              Disable
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="rounded-2xl border-error-container/50 bg-error-container/10">
          <AlertCircle className="h-4 w-4 text-error" />
          <AlertDescription className="text-on-error-container">{error}</AlertDescription>
        </Alert>
      )}

      {/* Interactive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card
          className="rounded-2xl bg-surface-container-low elevation-1 border-0 hover:elevation-2 transition-all duration-200 cursor-pointer group"
          onClick={() => setActiveTab('races')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Trophy className="h-5 w-5 text-on-primary-container transition-transform duration-200 group-hover:rotate-12" />
              </div>
              <div>
                <p className="headline-small text-on-surface">{completedRaces.length}</p>
                <p className="body-small text-on-surface-variant">Completed</p>
              </div>
              <ChevronRight className="h-4 w-4 text-on-surface-variant ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="rounded-2xl bg-surface-container-low elevation-1 border-0 hover:elevation-2 transition-all duration-200 cursor-pointer group"
          onClick={() => setActiveTab('races')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-on-secondary-container transition-transform duration-200 group-hover:rotate-12" />
              </div>
              <div>
                <p className="headline-small text-on-surface">{upcomingRaces.length}</p>
                <p className="body-small text-on-surface-variant">Upcoming</p>
              </div>
              <ChevronRight className="h-4 w-4 text-on-surface-variant ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="rounded-2xl bg-surface-container-low elevation-1 border-0 hover:elevation-2 transition-all duration-200 cursor-pointer group"
          onClick={() => onViewChange?.('locations')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MapPin className="h-5 w-5 text-on-tertiary-container transition-transform duration-200 group-hover:rotate-12" />
              </div>
              <div>
                <p className="headline-small text-on-surface">{locations.length}</p>
                <p className="body-small text-on-surface-variant">Locations</p>
              </div>
              <ChevronRight className="h-4 w-4 text-on-surface-variant ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="rounded-2xl bg-surface-container-low elevation-1 border-0 hover:elevation-2 transition-all duration-200 cursor-pointer group"
          onClick={() => onViewChange?.('athletes')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-container flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Users className="h-5 w-5 text-on-success-container transition-transform duration-200 group-hover:rotate-12" />
              </div>
              <div>
                <p className="headline-small text-on-surface">{competitors.length}</p>
                <p className="body-small text-on-surface-variant">Athletes</p>
              </div>
              <ChevronRight className="h-4 w-4 text-on-surface-variant ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0 hover:elevation-2 transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-container flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Camera className="h-5 w-5 text-on-warning-container transition-transform duration-200 group-hover:rotate-12" />
              </div>
              <div>
                <p className="headline-small text-on-surface">{totalPhotos}</p>
                <p className="body-small text-on-surface-variant">Media</p>
              </div>
              <ChevronRight className="h-4 w-4 text-on-surface-variant ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="races">Races</TabsTrigger>
          <TabsTrigger value="competitors">Athletes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Season Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Race Distribution Chart */}
            <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 headline-small text-on-surface">
                  <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-on-primary-container" />
                  </div>
                  Races by Discipline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { discipline: 'Slalom', races: races.filter(r => r.discipline.toLowerCase().includes('slalom') && !r.discipline.toLowerCase().includes('giant')).length, color: '#1565C0' },
                    { discipline: 'Giant Slalom', races: races.filter(r => r.discipline.toLowerCase().includes('giant slalom')).length, color: '#37474F' },
                    { discipline: 'Super G', races: races.filter(r => r.discipline.toLowerCase().includes('super g')).length, color: '#455A64' },
                    { discipline: 'Downhill', races: races.filter(r => r.discipline.toLowerCase().includes('downhill')).length, color: '#546E7A' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E3E7" />
                    <XAxis dataKey="discipline" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-elevation-2)'
                      }}
                    />
                    <Bar dataKey="races" fill="#1565C0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Season Progress */}
            <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 headline-small text-on-surface">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-on-secondary-container" />
                  </div>
                  Season Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="body-medium text-on-surface">Completed Races</span>
                      <span className="body-medium font-medium text-on-surface">{completedRaces.length}/{races.length}</span>
                    </div>
                    <Progress value={(completedRaces.length / races.length) * 100} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="body-medium text-on-surface">Active Locations</span>
                      <span className="body-medium font-medium text-on-surface">{locations.length}/15</span>
                    </div>
                    <Progress value={(locations.length / 15) * 100} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="body-medium text-on-surface">Registered Athletes</span>
                      <span className="body-medium font-medium text-on-surface">{competitors.length}/120</span>
                    </div>
                    <Progress value={(competitors.length / 120) * 100} className="h-3" />
                  </div>
                </div>

                {/* Season Timeline */}
                <div className="mt-6">
                  <h4 className="body-medium font-medium text-on-surface mb-3">Season Timeline</h4>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={[
                      { month: 'Oct', races: 2 },
                      { month: 'Nov', races: 4 },
                      { month: 'Dec', races: 8 },
                      { month: 'Jan', races: 12 },
                      { month: 'Feb', races: 10 },
                      { month: 'Mar', races: 6 }
                    ]}>
                      <defs>
                        <linearGradient id="colorRaces" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1565C0" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1565C0" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Area type="monotone" dataKey="races" stroke="#1565C0" fillOpacity={1} fill="url(#colorRaces)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Races - Only show for completed season */}
            {selectedSeason === '2024/2025' && (
              <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 headline-small text-on-surface">
                    <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-on-primary-container" />
                    </div>
                    Recent Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedRaces.slice(0, 5).map((race) => (
                      <div
                        key={race.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container cursor-pointer transition-all duration-200 hover:elevation-1"
                        onClick={() => setSelectedRace(race)}
                      >
                        <div>
                          <p className="body-large text-on-surface font-medium">{race.name}</p>
                          <p className="body-small text-on-surface-variant">{race.location}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-success-container text-on-success-container border-0 rounded-lg">Completed</Badge>
                          <p className="body-small text-on-surface-variant mt-1">
                            {new Date(race.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* World Cup Standings */}
            <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 headline-small text-on-surface">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-on-secondary-container" />
                  </div>
                  World Cup Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {competitors.slice(0, 5).map((competitor) => (
                    <div
                      key={competitor.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container cursor-pointer transition-all duration-200 hover:elevation-1"
                      onClick={() => setSelectedCompetitor(competitor.id)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                        <span className="label-medium text-on-primary-container font-bold">#{competitor.rank}</span>
                      </div>
                      <img
                        src={`https://flagcdn.com/w80/${getCountryCode(competitor.country)}.png`}
                        alt={competitor.country}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm"
                        style={{ aspectRatio: '4/3' }}
                      />
                      <div className="flex-1">
                        <p className="body-large text-on-surface font-medium">{competitor.name}</p>
                        <p className="body-small text-on-surface-variant">{competitor.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="body-large text-on-surface font-medium">{competitor.worldCupPoints}</p>
                        <p className="body-small text-on-surface-variant">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Races */}
            <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 headline-small text-on-surface">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-on-tertiary-container" />
                  </div>
                  Upcoming Races
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingRaces.slice(0, 5).map((race) => {
                    // Helper function to get discipline icon and color
                    const getDisciplineInfo = (discipline: string) => {
                      switch (discipline.toLowerCase()) {
                        case 'downhill':
                          return { icon: Mountain, color: 'bg-error-container text-on-error-container' };
                        case 'super g':
                          return { icon: Zap, color: 'bg-warning-container text-on-warning-container' };
                        case 'giant slalom':
                          return { icon: Target, color: 'bg-primary-container text-on-primary-container' };
                        case 'slalom':
                          return { icon: Target, color: 'bg-secondary-container text-on-secondary-container' };
                        case 'parallel giant slalom':
                          return { icon: Target, color: 'bg-tertiary-container text-on-tertiary-container' };
                        default:
                          return { icon: Trophy, color: 'bg-surface-container text-on-surface' };
                      }
                    };

                    const { icon: DisciplineIcon, color: disciplineColor } = getDisciplineInfo(race.discipline);
                    const raceDate = new Date(race.date);
                    const isUpcoming = raceDate > new Date();
                    const daysUntil = Math.ceil((raceDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <div
                        key={race.id}
                        className="group relative overflow-hidden rounded-xl bg-surface-container-lowest hover:bg-surface-container cursor-pointer transition-all duration-300 hover:elevation-2 border border-outline-variant/20 hover:border-primary/30"
                        onClick={() => setSelectedRace(race)}
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative p-4 flex items-center gap-4">
                          {/* Discipline Icon */}
                          <div className={`w-12 h-12 rounded-xl ${disciplineColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                            <DisciplineIcon className="w-5 h-5" />
                          </div>

                          {/* Race Information */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="body-large text-on-surface font-medium truncate group-hover:text-primary transition-colors">
                                  {race.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="w-3 h-3 text-on-surface-variant flex-shrink-0" />
                                  <p className="body-small text-on-surface-variant truncate">
                                    {race.location}, {race.country}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="w-3 h-3 text-on-surface-variant flex-shrink-0" />
                                  <p className="body-small text-on-surface-variant">
                                    {race.discipline}
                                  </p>
                                </div>
                              </div>

                              {/* Date and Status */}
                              <div className="text-right flex-shrink-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={`${isUpcoming
                                      ? 'bg-success-container text-on-success-container'
                                      : 'bg-warning-container text-on-warning-container'
                                    } border-0 rounded-lg label-small px-2 py-1`}>
                                    {isUpcoming ? 'Scheduled' : 'Past'}
                                  </Badge>
                                </div>
                                <p className="body-small text-on-surface font-medium">
                                  {raceDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                {isUpcoming && daysUntil <= 30 && (
                                  <p className="body-small text-primary font-medium">
                                    {daysUntil === 0 ? 'Today' :
                                      daysUntil === 1 ? 'Tomorrow' :
                                        `${daysUntil} days`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </div>
                    );
                  })}
                </div>

                {/* Show more races indicator */}
                {upcomingRaces.length > 5 && (
                  <div className="mt-4 pt-3 border-t border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <p className="body-small text-on-surface-variant">
                        Showing 5 of {upcomingRaces.length} upcoming races
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('races')}
                        className="text-primary hover:text-primary hover:bg-primary/10 body-small"
                      >
                        View All Races
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="headline-small text-on-surface">Season Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-lowest">
                    <span className="body-medium text-on-surface-variant">Total Races</span>
                    <span className="body-large text-on-surface font-medium">{races.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-lowest">
                    <span className="body-medium text-on-surface-variant">Active Locations</span>
                    <span className="body-large text-on-surface font-medium">{locations.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-lowest">
                    <span className="body-medium text-on-surface-variant">Registered Athletes</span>
                    <span className="body-large text-on-surface font-medium">{competitors.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-lowest">
                    <span className="body-medium text-on-surface-variant">Photos Available</span>
                    <span className="body-large text-on-surface font-medium">{totalPhotos}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-lowest">
                    <span className="body-medium text-on-surface-variant">Video Highlights</span>
                    <span className="body-large text-on-surface font-medium">{totalVideos}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>



        <TabsContent value="races" className="mt-6">
          <div className="space-y-4">
            {races.map((race) => (
              <Card
                key={race.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedRace(race)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{race.name}</h3>
                      <p className="text-muted-foreground">{race.location}, {race.country}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(race.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        race.status === 'completed' ? 'default' :
                          race.status === 'live' ? 'destructive' : 'secondary'
                      }>
                        {race.status}
                      </Badge>
                      <Badge variant="outline">{race.discipline}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <EnhancedCompetitorList
            selectedSeason={selectedSeason}
            onCompetitorSelect={setSelectedCompetitor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}