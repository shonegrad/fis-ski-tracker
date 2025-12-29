import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.supabase.co'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Ensure storage buckets exist
async function ensureBuckets() {
  const buckets = ['make-3fe23130-photos', 'make-3fe23130-videos'];
  
  for (const bucketName of buckets) {
    try {
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: false,
          allowedMimeTypes: bucketName.includes('photos') 
            ? ['image/jpeg', 'image/png', 'image/webp']
            : ['video/mp4', 'video/webm', 'video/quicktime']
        });
        
        if (error && error.message !== 'The resource already exists') {
          console.error(`Failed to create bucket ${bucketName}:`, error);
        } else if (!error) {
          console.log(`Created bucket: ${bucketName}`);
        }
      }
    } catch (error) {
      // Ignore "already exists" errors
      if (!error.message?.includes('already exists')) {
        console.error(`Error checking/creating bucket ${bucketName}:`, error);
      }
    }
  }
}

// Initialize buckets on startup (with error handling)
ensureBuckets().catch(error => {
  console.warn('Failed to initialize storage buckets:', error.message);
});

// Push notification subscription management
app.post('/make-server-3fe23130/notifications/subscribe', async (c) => {
  try {
    const subscription = await c.req.json();
    const subscriptionId = crypto.randomUUID();
    
    await kv.set(`notification_subscription:${subscriptionId}`, {
      ...subscription,
      id: subscriptionId,
      createdAt: new Date().toISOString(),
      active: true
    });

    return c.json({ success: true, subscriptionId });
  } catch (error) {
    console.error('Failed to save notification subscription:', error);
    return c.json({ error: 'Failed to save subscription' }, 500);
  }
});

app.post('/make-server-3fe23130/notifications/unsubscribe', async (c) => {
  try {
    // Get all subscriptions and mark them as inactive
    const subscriptions = await kv.getByPrefix('notification_subscription:');
    for (const sub of subscriptions) {
      if (sub.active) {
        await kv.set(`notification_subscription:${sub.id}`, {
          ...sub,
          active: false,
          unsubscribedAt: new Date().toISOString()
        });
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to unsubscribe from notifications:', error);
    return c.json({ error: 'Failed to unsubscribe' }, 500);
  }
});

app.post('/make-server-3fe23130/notifications/preferences', async (c) => {
  try {
    const preferences = await c.req.json();
    await kv.set('notification_preferences', {
      ...preferences,
      updatedAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to save notification preferences:', error);
    return c.json({ error: 'Failed to save preferences' }, 500);
  }
});

app.get('/make-server-3fe23130/notifications/preferences', async (c) => {
  try {
    const preferences = await kv.get('notification_preferences');
    return c.json(preferences || {
      raceStart: true,
      raceResults: true,
      weatherUpdates: false,
      courseUpdates: false
    });
  } catch (error) {
    console.error('Failed to get notification preferences:', error);
    return c.json({ error: 'Failed to get preferences' }, 500);
  }
});

// Send push notification
app.post('/make-server-3fe23130/notifications/send', async (c) => {
  try {
    const notification = await c.req.json();
    const subscriptions = await kv.getByPrefix('notification_subscription:');
    const activeSubscriptions = subscriptions.filter(sub => sub.active);

    // In a real implementation, you would use a service like Web Push Protocol
    // For demo purposes, we'll just log and store the notification
    console.log('Sending notification to', activeSubscriptions.length, 'subscribers:', notification);
    
    await kv.set(`notification_sent:${crypto.randomUUID()}`, {
      ...notification,
      sentAt: new Date().toISOString(),
      recipientCount: activeSubscriptions.length
    });

    return c.json({ 
      success: true, 
      sent: activeSubscriptions.length 
    });
  } catch (error) {
    console.error('Failed to send notifications:', error);
    return c.json({ error: 'Failed to send notifications' }, 500);
  }
});

// Media management endpoints
app.post('/make-server-3fe23130/media/photos/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string);

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileId = crypto.randomUUID();
    const fileName = `${fileId}.${file.name.split('.').pop()}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('make-3fe23130-photos')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Create signed URL
    const { data: signedUrl } = await supabase.storage
      .from('make-3fe23130-photos')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

    // Store photo metadata
    const photoData = {
      id: fileId,
      url: signedUrl?.signedUrl,
      thumbnail: signedUrl?.signedUrl, // In production, generate thumbnail
      fileName,
      ...metadata,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size,
      mimeType: file.type
    };

    await kv.set(`photo:${fileId}`, photoData);

    return c.json({ success: true, photo: photoData });
  } catch (error) {
    console.error('Failed to upload photo:', error);
    return c.json({ error: 'Failed to upload photo' }, 500);
  }
});

app.get('/make-server-3fe23130/media/photos/:raceId', async (c) => {
  try {
    const raceId = c.req.param('raceId');
    const photos = await kv.getByPrefix('photo:');
    const racePhotos = photos.filter(photo => photo.raceId === raceId);

    // Refresh signed URLs if needed
    for (const photo of racePhotos) {
      const { data: signedUrl } = await supabase.storage
        .from('make-3fe23130-photos')
        .createSignedUrl(photo.fileName, 60 * 60 * 24 * 7);
      
      if (signedUrl) {
        photo.url = signedUrl.signedUrl;
        photo.thumbnail = signedUrl.signedUrl;
      }
    }

    return c.json(racePhotos);
  } catch (error) {
    console.error('Failed to get photos:', error);
    return c.json({ error: 'Failed to get photos' }, 500);
  }
});

app.post('/make-server-3fe23130/media/videos/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string);

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileId = crypto.randomUUID();
    const fileName = `${fileId}.${file.name.split('.').pop()}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('make-3fe23130-videos')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Create signed URL
    const { data: signedUrl } = await supabase.storage
      .from('make-3fe23130-videos')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

    // Store video metadata
    const videoData = {
      id: fileId,
      url: signedUrl?.signedUrl,
      fileName,
      quality: [
        { label: 'Original', url: signedUrl?.signedUrl, resolution: 'original' }
      ],
      ...metadata,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size,
      mimeType: file.type,
      views: 0
    };

    await kv.set(`video:${fileId}`, videoData);

    return c.json({ success: true, video: videoData });
  } catch (error) {
    console.error('Failed to upload video:', error);
    return c.json({ error: 'Failed to upload video' }, 500);
  }
});

app.get('/make-server-3fe23130/media/videos/:raceId', async (c) => {
  try {
    const raceId = c.req.param('raceId');
    const videos = await kv.getByPrefix('video:');
    const raceVideos = videos.filter(video => video.raceId === raceId);

    // Refresh signed URLs if needed
    for (const video of raceVideos) {
      const { data: signedUrl } = await supabase.storage
        .from('make-3fe23130-videos')
        .createSignedUrl(video.fileName, 60 * 60 * 24 * 7);
      
      if (signedUrl) {
        video.url = signedUrl.signedUrl;
        video.quality = [
          { label: 'Original', url: signedUrl.signedUrl, resolution: 'original' }
        ];
      }
    }

    return c.json(raceVideos);
  } catch (error) {
    console.error('Failed to get videos:', error);
    return c.json({ error: 'Failed to get videos' }, 500);
  }
});

// Increment video views
app.post('/make-server-3fe23130/media/videos/:videoId/view', async (c) => {
  try {
    const videoId = c.req.param('videoId');
    const video = await kv.get(`video:${videoId}`);
    
    if (video) {
      video.views = (video.views || 0) + 1;
      await kv.set(`video:${videoId}`, video);
      return c.json({ success: true, views: video.views });
    } else {
      return c.json({ error: 'Video not found' }, 404);
    }
  } catch (error) {
    console.error('Failed to increment video views:', error);
    return c.json({ error: 'Failed to increment views' }, 500);
  }
});

// Existing race data endpoints...
app.get('/make-server-3fe23130/races/:season', async (c) => {
  const season = c.req.param('season');
  console.log(`Getting races for season: ${season}`);
  
  try {
    // Try to get from cache first
    const cachedRaces = await kv.get(`races:${season}`);
    if (cachedRaces) {
      console.log(`Returning cached races for season ${season}`);
      return c.json(cachedRaces);
    }

    // Simulate API call with mock data
    const mockRaces = generateMockRaces(season);
    
    // Cache the results
    await kv.set(`races:${season}`, mockRaces);
    
    console.log(`Generated and cached ${mockRaces.length} races for season ${season}`);
    return c.json(mockRaces);
  } catch (error) {
    console.error('Error in /races endpoint:', error);
    return c.json({ error: 'Failed to fetch races', details: error.message }, 500);
  }
});

app.get('/make-server-3fe23130/locations/:season', async (c) => {
  const season = c.req.param('season');
  console.log(`Getting locations for season: ${season}`);
  
  try {
    const cachedLocations = await kv.get(`locations:${season}`);
    if (cachedLocations) {
      return c.json(cachedLocations);
    }

    const mockLocations = generateMockLocations(season);
    await kv.set(`locations:${season}`, mockLocations);
    
    return c.json(mockLocations);
  } catch (error) {
    console.error('Error in /locations endpoint:', error);
    return c.json({ error: 'Failed to fetch locations', details: error.message }, 500);
  }
});

app.get('/make-server-3fe23130/competitors/:season', async (c) => {
  const season = c.req.param('season');
  console.log(`Getting competitors for season: ${season}`);
  
  try {
    const cachedCompetitors = await kv.get(`competitors:${season}`);
    if (cachedCompetitors) {
      return c.json(cachedCompetitors);
    }

    const mockCompetitors = generateMockCompetitors(season);
    await kv.set(`competitors:${season}`, mockCompetitors);
    
    return c.json(mockCompetitors);
  } catch (error) {
    console.error('Error in /competitors endpoint:', error);
    return c.json({ error: 'Failed to fetch competitors', details: error.message }, 500);
  }
});

app.get('/make-server-3fe23130/race/:raceId/results', async (c) => {
  const raceId = c.req.param('raceId');
  console.log(`Getting results for race: ${raceId}`);
  
  try {
    const cachedResults = await kv.get(`results:${raceId}`);
    if (cachedResults) {
      return c.json(cachedResults);
    }

    const mockResults = generateMockResults(raceId);
    await kv.set(`results:${raceId}`, mockResults);
    
    return c.json(mockResults);
  } catch (error) {
    console.error('Error in /race/results endpoint:', error);
    return c.json({ error: 'Failed to fetch race results', details: error.message }, 500);
  }
});

app.get('/make-server-3fe23130/competitor/:competitorId', async (c) => {
  const competitorId = c.req.param('competitorId');
  console.log(`Getting competitor details: ${competitorId}`);
  
  try {
    const cachedCompetitor = await kv.get(`competitor:${competitorId}`);
    if (cachedCompetitor) {
      return c.json(cachedCompetitor);
    }

    const mockCompetitor = generateMockCompetitorDetails(competitorId);
    await kv.set(`competitor:${competitorId}`, mockCompetitor);
    
    return c.json(mockCompetitor);
  } catch (error) {
    console.error('Error in /competitor endpoint:', error);
    return c.json({ error: 'Failed to fetch competitor details', details: error.message }, 500);
  }
});

app.get('/make-server-3fe23130/weather/:locationId', async (c) => {
  const locationId = c.req.param('locationId');
  console.log(`Getting weather for location: ${locationId}`);
  
  try {
    const mockWeather = generateMockWeather(locationId);
    return c.json(mockWeather);
  } catch (error) {
    console.error('Error in /weather endpoint:', error);
    return c.json({ error: 'Failed to fetch weather data', details: error.message }, 500);
  }
});

app.get('/make-server-3fe23130/course/:raceId', async (c) => {
  const raceId = c.req.param('raceId');
  console.log(`Getting course details for race: ${raceId}`);
  
  try {
    const mockCourse = generateMockCourseDetails(raceId);
    return c.json(mockCourse);
  } catch (error) {
    console.error('Error in /course endpoint:', error);
    return c.json({ error: 'Failed to fetch course details', details: error.message }, 500);
  }
});

// Mock data generation functions
function generateMockRaces(season: string) {
  const races = [
    {
      id: 'solden-2024-1',
      name: 'Giant Slalom',
      location: 'Sölden',
      country: 'Austria',
      date: season === '2024/2025' ? '2024-10-27' : '2025-10-26',
      status: season === '2024/2025' ? 'completed' : 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'solden'
    },
    {
      id: 'levi-2024-1',
      name: 'Slalom',
      location: 'Levi',
      country: 'Finland',
      date: season === '2024/2025' ? '2024-11-17' : '2025-11-16',
      status: season === '2024/2025' ? 'completed' : 'scheduled',
      discipline: 'Slalom',
      locationId: 'levi'
    },
    {
      id: 'gurgl-2024-1',
      name: 'Slalom',
      location: 'Gurgl',
      country: 'Austria',
      date: season === '2024/2025' ? '2024-11-24' : '2025-11-23',
      status: season === '2024/2025' ? 'completed' : 'scheduled',
      discipline: 'Slalom',
      locationId: 'gurgl'
    },
    {
      id: 'val-disere-2024-1',
      name: 'Giant Slalom',
      location: "Val d'Isère",
      country: 'France',
      date: season === '2024/2025' ? '2024-12-08' : '2025-12-07',
      status: season === '2024/2025' ? 'completed' : 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'val-disere'
    }
  ];
  
  return races;
}

function generateMockLocations(season: string) {
  return [
    {
      id: 'solden',
      name: 'Sölden',
      country: 'Austria',
      elevation: 3340,
      raceCount: 2,
      image: `https://images.unsplash.com/photo-1551516043-7b21bcd4ed00?w=400&h=250&fit=crop`,
      coordinates: { lat: 46.9692, lng: 11.0006 }
    },
    {
      id: 'levi',
      name: 'Levi',
      country: 'Finland',
      elevation: 531,
      raceCount: 2,
      image: `https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=250&fit=crop`,
      coordinates: { lat: 67.8034, lng: 24.1745 }
    },
    {
      id: 'gurgl',
      name: 'Gurgl',
      country: 'Austria',
      elevation: 3080,
      raceCount: 1,
      image: `https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400&h=250&fit=crop`,
      coordinates: { lat: 46.8696, lng: 11.0413 }
    },
    {
      id: 'val-disere',
      name: "Val d'Isère",
      country: 'France',
      elevation: 2822,
      raceCount: 2,
      image: `https://images.unsplash.com/photo-1578583089129-1a56a0b5c3dc?w=400&h=250&fit=crop`,
      coordinates: { lat: 45.4486, lng: 7.0059 }
    }
  ];
}

function generateMockCompetitors(season: string) {
  return [
    {
      id: 'odermatt-marco',
      name: 'Marco Odermatt',
      country: 'Switzerland',
      age: 27,
      disciplines: ['Giant Slalom', 'Super G', 'Downhill'],
      worldCupPoints: season === '2024/2025' ? 1542 : 0,
      rank: 1,
      image: `https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&h=150&fit=crop&face=center`
    },
    {
      id: 'kristoffersen-henrik',
      name: 'Henrik Kristoffersen',
      country: 'Norway',
      age: 30,
      disciplines: ['Slalom', 'Giant Slalom'],
      worldCupPoints: season === '2024/2025' ? 1234 : 0,
      rank: 2,
      image: `https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&face=center`
    }
  ];
}

function generateMockResults(raceId: string) {
  return [
    {
      rank: 1,
      competitorId: 'odermatt-marco',
      name: 'Marco Odermatt',
      country: 'Switzerland',
      time: '2:06.45',
      gap: '',
      points: 100,
      run1: '1:02.34',
      run2: '1:04.11'
    },
    {
      rank: 2,
      competitorId: 'kristoffersen-henrik',
      name: 'Henrik Kristoffersen',
      country: 'Norway',
      time: '2:06.78',
      gap: '+0.33',
      points: 80,
      run1: '1:02.45',
      run2: '1:04.33'
    }
  ];
}

function generateMockCompetitorDetails(competitorId: string) {
  return {
    id: competitorId,
    name: competitorId === 'odermatt-marco' ? 'Marco Odermatt' : 'Henrik Kristoffersen',
    country: competitorId === 'odermatt-marco' ? 'Switzerland' : 'Norway',
    age: competitorId === 'odermatt-marco' ? 27 : 30,
    height: competitorId === 'odermatt-marco' ? '1.86m' : '1.80m',
    weight: competitorId === 'odermatt-marco' ? '85kg' : '78kg',
    birthDate: competitorId === 'odermatt-marco' ? '1997-10-08' : '1994-07-02',
    birthPlace: competitorId === 'odermatt-marco' ? 'Buochs, Switzerland' : 'Ål, Norway',
    worldCupDebut: competitorId === 'odermatt-marco' ? '2018' : '2012',
    worldCupWins: competitorId === 'odermatt-marco' ? 37 : 23,
    olympicMedals: competitorId === 'odermatt-marco' ? 2 : 1,
    worldChampionships: competitorId === 'odermatt-marco' ? 3 : 2,
    disciplines: competitorId === 'odermatt-marco' ? ['Giant Slalom', 'Super G', 'Downhill'] : ['Slalom', 'Giant Slalom'],
    image: `https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&face=center`
  };
}

function generateMockWeather(locationId: string) {
  return {
    current: {
      temperature: -5,
      condition: 'Snow',
      windSpeed: 15,
      humidity: 85,
      visibility: 8,
      icon: 'snow'
    },
    forecast: [
      { day: 'Today', high: -2, low: -8, condition: 'Snow', icon: 'snow' },
      { day: 'Tomorrow', high: -1, low: -7, condition: 'Cloudy', icon: 'cloudy' },
      { day: 'Wed', high: 1, low: -5, condition: 'Sunny', icon: 'sunny' }
    ]
  };
}

function generateMockCourseDetails(raceId: string) {
  return {
    name: 'Rettenbach Glacier',
    length: 1350,
    verticalDrop: 350,
    gates: 65,
    surfaceCondition: 'Hard packed',
    temperature: -8,
    startTime: '10:00',
    weather: 'Sunny',
    difficulty: 'Expert'
  };
}

Deno.serve(app.fetch);