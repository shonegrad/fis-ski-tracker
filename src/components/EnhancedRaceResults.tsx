import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { 
  Trophy, 
  Clock, 
  MapPin, 
  Users, 
  AlertCircle,
  ArrowLeft,
  Bell,
  BellOff,
  Camera,
  Video,
  Share2
} from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { CourseDetails } from './CourseDetails';
import { HistoricalComparison } from './HistoricalComparison';
import { MediaGallery, Photo, VideoHighlight } from './MediaGallery';
import { NotificationSettings } from './NotificationSettings';
import { notificationService } from '../services/notificationService';
import { projectId, publicAnonKey, isConfigured } from '../utils/supabase/info';
import { fallbackDataService } from '../services/fallbackDataService';

interface RaceResult {
  rank: number;
  competitorId: string;
  name: string;
  country: string;
  time: string;
  gap: string;
  points: number;
  run1?: string;
  run2?: string;
}

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

interface EnhancedRaceResultsProps {
  race?: Race | null;
  onBack: () => void;
}

export function EnhancedRaceResults({ race, onBack }: EnhancedRaceResultsProps) {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<VideoHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('results');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  useEffect(() => {
    if (race?.id) {
      fetchRaceData();
      fetchMediaData();
      checkNotificationStatus();
    } else {
      setError('Race information not available');
      setLoading(false);
    }
  }, [race?.id]);

  const checkNotificationStatus = async () => {
    const status = await notificationService.getSubscriptionStatus();
    setIsNotificationEnabled(status);
  };

  const fetchRaceData = async () => {
    if (!race?.id) {
      setError('No race ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Always use fallback data for reliable operation
      // This prevents "Failed to fetch" errors from non-existent API endpoints
      const data = await fallbackDataService.getRaceResults(race.id);
      setResults(data);
    } catch (err) {
      console.error('Error fetching race results:', err);
      // Final fallback
      const data = await fallbackDataService.getRaceResults(race.id);
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaData = async () => {
    if (!race?.id) {
      return;
    }

    // Always use mock media data for demo purposes
    setPhotos([
      {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&h=200&fit=crop',
        title: 'Race Start',
        photographer: 'John Doe',
        timestamp: new Date().toISOString(),
        category: 'start',
        raceId: race.id,
        likes: 45,
        downloads: 12
      },
      {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1551516043-7b21bcd4ed00?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1551516043-7b21bcd4ed00?w=300&h=200&fit=crop',
        title: 'Action Shot',
        photographer: 'Jane Smith',
        timestamp: new Date().toISOString(),
        category: 'action',
        raceId: race.id,
        likes: 78,
        downloads: 23
      },
      {
        id: 'photo-3',
        url: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=300&h=200&fit=crop',
        title: 'Finish Line',
        photographer: 'Mike Johnson',
        timestamp: new Date().toISOString(),
        category: 'finish',
        raceId: race.id,
        likes: 92,
        downloads: 34
      }
    ]);

    setVideos([
      {
        id: 'video-1',
        title: 'Race Highlights',
        description: 'Best moments from the race',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=225&fit=crop',
        duration: 180,
        category: 'highlights',
        raceId: race.id,
        timestamp: new Date().toISOString(),
        views: 1234,
        quality: [
          { label: '720p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', resolution: '720p' },
          { label: '1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', resolution: '1080p' }
        ]
      },
      {
        id: 'video-2',
        title: 'Winner Interview',
        description: 'Post-race interview with the winner',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=225&fit=crop',
        duration: 120,
        category: 'interviews',
        raceId: race.id,
        timestamp: new Date().toISOString(),
        views: 856,
        quality: [
          { label: '720p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', resolution: '720p' }
        ]
      }
    ]);
  };

  const toggleNotifications = async () => {
    if (isNotificationEnabled) {
      const success = await notificationService.unsubscribeFromPushNotifications();
      if (success) {
        setIsNotificationEnabled(false);
        notificationService.showLocalNotification({
          id: 'unsubscribed',
          type: 'race_result',
          title: 'Notifications Disabled',
          message: 'You will no longer receive race updates',
          raceId: race?.id || '',
          locationId: race?.locationId || '',
          timestamp: new Date().toISOString()
        });
      }
    } else {
      const subscription = await notificationService.subscribeToPushNotifications();
      if (subscription) {
        setIsNotificationEnabled(true);
        notificationService.showLocalNotification({
          id: 'subscribed',
          type: 'race_result',
          title: 'Notifications Enabled',
          message: 'You will now receive live race updates',
          raceId: race?.id || '',
          locationId: race?.locationId || '',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const shareRace = async () => {
    if (!race) return;
    
    const shareData = {
      title: `${race.name} - ${race.location}`,
      text: `Check out the results from ${race.name} in ${race.location}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1: return 'default';
      case 2: return 'secondary';
      case 3: return 'outline';
      default: return 'outline';
    }
  };

  if (!race) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Race information not available</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{race?.name || 'Unknown Race'}</h1>
            <p className="text-muted-foreground">{race?.location || 'Unknown Location'}, {race?.country || 'Unknown Country'} • {race?.date ? new Date(race.date).toLocaleDateString() : 'Unknown Date'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleNotifications}>
            {isNotificationEnabled ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Disable Alerts
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Enable Alerts
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={shareRace}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Race Status */}
      <div className="flex items-center gap-4">
        <Badge variant={race?.status === 'completed' ? 'default' : race?.status === 'live' ? 'destructive' : 'secondary'}>
          {race?.status === 'completed' ? '✓ Completed' : race?.status === 'live' ? '🔴 Live' : '⏰ Scheduled'}
        </Badge>
        <Badge variant="outline">{race?.discipline || 'Unknown'}</Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{results.length}</p>
                <p className="text-sm text-muted-foreground">Finishers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{results[0]?.time || '--'}</p>
                <p className="text-sm text-muted-foreground">Winning Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{photos.length}</p>
                <p className="text-sm text-muted-foreground">Photos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{videos.length}</p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="course">Course</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Race Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.rank} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={getRankBadgeVariant(result.rank)}>
                        {result.rank}
                      </Badge>
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-muted-foreground">{result.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono">{result.time}</p>
                      {result.gap && <p className="text-sm text-muted-foreground">{result.gap}</p>}
                    </div>
                    <div className="text-right">
                      <p>{result.points} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <MediaGallery
            raceId={race?.id || 'unknown'}
            raceTitle={`${race?.name || 'Unknown Race'} - ${race?.location || 'Unknown Location'}`}
            photos={photos}
            videos={videos}
            onMediaSelect={(media, type) => {
              console.log('Selected media:', media, type);
              if (type === 'video') {
                // Simulate view count increment (no actual API call)
                console.log('Video view incremented for:', media.id);
              }
            }}
          />
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <WeatherWidget locationId={race?.locationId || 'unknown'} />
        </TabsContent>

        <TabsContent value="course" className="mt-6">
          <CourseDetails raceId={race?.id || 'unknown'} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {results.length > 0 && (
            <HistoricalComparison 
              competitorId={results[0]?.competitorId || 'odermatt-marco'} 
              competitorName={results[0]?.name || 'Marco Odermatt'}
            />
          )}
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}