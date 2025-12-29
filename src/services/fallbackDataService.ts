import { athletePhotoService } from './athletePhotoService';

interface FallbackRace {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  status: 'scheduled' | 'live' | 'completed';
  discipline: string;
  locationId: string;
}

interface FallbackLocation {
  id: string;
  name: string;
  country: string;
  elevation: number;
  raceCount: number;
  image: string;
  coordinates: { lat: number; lng: number };
  description?: string;
  seasonHistory?: string;
  famousSlopes?: string[];
}

interface FallbackCompetitor {
  id: string;
  name: string;
  country: string;
  age: number;
  disciplines: string[];
  worldCupPoints: number;
  rank: number;
  image: string;
}

interface FallbackRaceResult {
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

class FallbackDataService {
  private readonly races24_25: FallbackRace[] = [
    {
      id: 'solden-2024-1',
      name: 'Giant Slalom',
      location: 'Sölden',
      country: 'Austria',
      date: '2024-10-27',
      status: 'completed',
      discipline: 'Giant Slalom',
      locationId: 'solden'
    },
    {
      id: 'levi-2024-1',
      name: 'Slalom',
      location: 'Levi',
      country: 'Finland',
      date: '2024-11-17',
      status: 'completed',
      discipline: 'Slalom',
      locationId: 'levi'
    },
    {
      id: 'gurgl-2024-1',
      name: 'Slalom',
      location: 'Gurgl',
      country: 'Austria',
      date: '2024-11-24',
      status: 'completed',
      discipline: 'Slalom',
      locationId: 'gurgl'
    },
    {
      id: 'val-disere-2024-1',
      name: 'Giant Slalom',
      location: "Val d'Isère",
      country: 'France',
      date: '2024-12-08',
      status: 'completed',
      discipline: 'Giant Slalom',
      locationId: 'val-disere'
    },
    {
      id: 'alta-badia-2024-1',
      name: 'Giant Slalom',
      location: 'Alta Badia',
      country: 'Italy',
      date: '2024-12-22',
      status: 'completed',
      discipline: 'Giant Slalom',
      locationId: 'alta-badia'
    },
    {
      id: 'wengen-2025-1',
      name: 'Downhill',
      location: 'Wengen',
      country: 'Switzerland',
      date: '2025-01-18',
      status: 'completed',
      discipline: 'Downhill',
      locationId: 'wengen'
    },
    {
      id: 'kitzbuehel-2025-1',
      name: 'Downhill',
      location: 'Kitzbühel',
      country: 'Austria',
      date: '2025-01-25',
      status: 'completed',
      discipline: 'Downhill',
      locationId: 'kitzbuehel'
    },
    {
      id: 'garmisch-2025-1',
      name: 'Giant Slalom',
      location: 'Garmisch-Partenkirchen',
      country: 'Germany',
      date: '2025-02-01',
      status: 'completed',
      discipline: 'Giant Slalom',
      locationId: 'garmisch'
    }
  ];

  private readonly races25_26: FallbackRace[] = [
    // Season Opening - October 2025
    {
      id: 'solden-2025-1',
      name: 'Rettenbach Glacier Giant Slalom',
      location: 'Sölden',
      country: 'Austria',
      date: '2025-10-26',
      status: 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'solden'
    },
    {
      id: 'solden-2025-2',
      name: 'Rettenbach Glacier Giant Slalom Race 2',
      location: 'Sölden',
      country: 'Austria',
      date: '2025-10-27',
      status: 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'solden'
    },

    // November 2025
    {
      id: 'levi-2025-1',
      name: 'Levi Black Slalom',
      location: 'Levi',
      country: 'Finland',
      date: '2025-11-16',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'levi'
    },
    {
      id: 'levi-2025-2',
      name: 'Levi Black Slalom Race 2',
      location: 'Levi',
      country: 'Finland',
      date: '2025-11-17',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'levi'
    },
    {
      id: 'gurgl-2025-1',
      name: 'Gurgl Slalom',
      location: 'Gurgl',
      country: 'Austria',
      date: '2025-11-23',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'gurgl'
    },
    {
      id: 'beaver-creek-2025-1',
      name: 'Birds of Prey Downhill',
      location: 'Beaver Creek',
      country: 'USA',
      date: '2025-11-29',
      status: 'scheduled',
      discipline: 'Downhill',
      locationId: 'beaver-creek'
    },
    {
      id: 'beaver-creek-2025-2',
      name: 'Birds of Prey Super G',
      location: 'Beaver Creek',
      country: 'USA',
      date: '2025-11-30',
      status: 'scheduled',
      discipline: 'Super G',
      locationId: 'beaver-creek'
    },

    // December 2025
    {
      id: 'val-disere-2025-1',
      name: "Val d'Isère Giant Slalom",
      location: "Val d'Isère",
      country: 'France',
      date: '2025-12-07',
      status: 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'val-disere'
    },
    {
      id: 'val-disere-2025-2',
      name: "Val d'Isère Slalom",
      location: "Val d'Isère",
      country: 'France',
      date: '2025-12-08',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'val-disere'
    },
    {
      id: 'val-gardena-2025-1',
      name: 'Saslong Super G',
      location: 'Val Gardena',
      country: 'Italy',
      date: '2025-12-19',
      status: 'scheduled',
      discipline: 'Super G',
      locationId: 'val-gardena'
    },
    {
      id: 'val-gardena-2025-2',
      name: 'Saslong Downhill',
      location: 'Val Gardena',
      country: 'Italy',
      date: '2025-12-20',
      status: 'scheduled',
      discipline: 'Downhill',
      locationId: 'val-gardena'
    },
    {
      id: 'alta-badia-2025-1',
      name: 'Gran Risa Giant Slalom',
      location: 'Alta Badia',
      country: 'Italy',
      date: '2025-12-21',
      status: 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'alta-badia'
    },
    {
      id: 'alta-badia-2025-2',
      name: 'Gran Risa Parallel Giant Slalom',
      location: 'Alta Badia',
      country: 'Italy',
      date: '2025-12-22',
      status: 'scheduled',
      discipline: 'Parallel Giant Slalom',
      locationId: 'alta-badia'
    },

    // January 2026
    {
      id: 'adelboden-2026-1',
      name: 'Chuenisbärgli Giant Slalom',
      location: 'Adelboden',
      country: 'Switzerland',
      date: '2026-01-11',
      status: 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'adelboden'
    },
    {
      id: 'adelboden-2026-2',
      name: 'Chuenisbärgli Slalom',
      location: 'Adelboden',
      country: 'Switzerland',
      date: '2026-01-12',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'adelboden'
    },
    {
      id: 'wengen-2026-1',
      name: 'Lauberhorn Downhill',
      location: 'Wengen',
      country: 'Switzerland',
      date: '2026-01-17',
      status: 'scheduled',
      discipline: 'Downhill',
      locationId: 'wengen'
    },
    {
      id: 'wengen-2026-2',
      name: 'Lauberhorn Slalom',
      location: 'Wengen',
      country: 'Switzerland',
      date: '2026-01-19',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'wengen'
    },
    {
      id: 'kitzbuehel-2026-1',
      name: 'Hahnenkamm Super G',
      location: 'Kitzbühel',
      country: 'Austria',
      date: '2026-01-24',
      status: 'scheduled',
      discipline: 'Super G',
      locationId: 'kitzbuehel'
    },
    {
      id: 'kitzbuehel-2026-2',
      name: 'Hahnenkamm Downhill',
      location: 'Kitzbühel',
      country: 'Austria',
      date: '2026-01-25',
      status: 'scheduled',
      discipline: 'Downhill',
      locationId: 'kitzbuehel'
    },
    {
      id: 'kitzbuehel-2026-3',
      name: 'Hahnenkamm Slalom',
      location: 'Kitzbühel',
      country: 'Austria',
      date: '2026-01-26',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'kitzbuehel'
    },

    // February 2026
    {
      id: 'garmisch-2026-1',
      name: 'Kandahar Downhill',
      location: 'Garmisch-Partenkirchen',
      country: 'Germany',
      date: '2026-02-01',
      status: 'scheduled',
      discipline: 'Downhill',
      locationId: 'garmisch'
    },
    {
      id: 'garmisch-2026-2',
      name: 'Kandahar Super G',
      location: 'Garmisch-Partenkirchen',
      country: 'Germany',
      date: '2026-02-02',
      status: 'scheduled',
      discipline: 'Super G',
      locationId: 'garmisch'
    },
    {
      id: 'chamonix-2026-1',
      name: 'Chamonix Downhill',
      location: 'Chamonix',
      country: 'France',
      date: '2026-02-08',
      status: 'scheduled',
      discipline: 'Downhill',
      locationId: 'chamonix'
    },
    {
      id: 'chamonix-2026-2',
      name: 'Chamonix Super G',
      location: 'Chamonix',
      country: 'France',
      date: '2026-02-09',
      status: 'scheduled',
      discipline: 'Super G',
      locationId: 'chamonix'
    },

    // March 2026 - Season Finals
    {
      id: 'kvitfjell-2026-1',
      name: 'Kvitfjell Downhill',
      location: 'Kvitfjell',
      country: 'Norway',
      date: '2026-03-07',
      status: 'scheduled',
      discipline: 'Downhill',
      locationId: 'kvitfjell'
    },
    {
      id: 'kvitfjell-2026-2',
      name: 'Kvitfjell Super G',
      location: 'Kvitfjell',
      country: 'Norway',
      date: '2026-03-08',
      status: 'scheduled',
      discipline: 'Super G',
      locationId: 'kvitfjell'
    },
    {
      id: 'la-thuile-2026-1',
      name: 'La Thuile Giant Slalom',
      location: 'La Thuile',
      country: 'Italy',
      date: '2026-03-14',
      status: 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'la-thuile'
    },
    {
      id: 'la-thuile-2026-2',
      name: 'La Thuile Slalom',
      location: 'La Thuile',
      country: 'Italy',
      date: '2026-03-15',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'la-thuile'
    },
    {
      id: 'soldeu-2026-1',
      name: 'World Cup Finals Giant Slalom',
      location: 'Soldeu',
      country: 'Andorra',
      date: '2026-03-21',
      status: 'scheduled',
      discipline: 'Giant Slalom',
      locationId: 'soldeu'
    },
    {
      id: 'soldeu-2026-2',
      name: 'World Cup Finals Slalom',
      location: 'Soldeu',
      country: 'Andorra',
      date: '2026-03-22',
      status: 'scheduled',
      discipline: 'Slalom',
      locationId: 'soldeu'
    }
  ];

  // Consistent mountain skiing venue photos
  private readonly skiingVenueImages = [
    'https://images.unsplash.com/photo-1551524164-6cf2ac4ac7ad?w=800&h=500&fit=crop&crop=center&q=85', // Snowy alpine slopes
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop&crop=center&q=85', // Ski resort mountains
    'https://images.unsplash.com/photo-1609052722712-5b17b8d4dce8?w=800&h=500&fit=crop&crop=center&q=85', // Alpine skiing venue
    'https://images.unsplash.com/photo-1578583089129-1a56a0b5c3dc?w=800&h=500&fit=crop&crop=center&q=85', // Mountain ski slopes
    'https://images.unsplash.com/photo-1578662997616-0ceaaebe8b5c?w=800&h=500&fit=crop&crop=center&q=85', // Alpine racing venue
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=500&fit=crop&crop=center&q=85', // Mountain ski resort
    'https://images.unsplash.com/photo-1578663271737-c42f22e60a7d?w=800&h=500&fit=crop&crop=center&q=85', // Snowy mountain peaks
    'https://images.unsplash.com/photo-1576690495809-4ad6d47c6b92?w=800&h=500&fit=crop&crop=center&q=85', // Alpine venue
    'https://images.unsplash.com/photo-1551524164-88f8c1d80c70?w=800&h=500&fit=crop&crop=center&q=85', // Ski racing slope
    'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=500&fit=crop&crop=center&q=85', // Mountain skiing
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=500&fit=crop&crop=center&q=85', // Alpine resort
    'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&h=500&fit=crop&crop=center&q=85', // Skiing mountains
    'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=500&fit=crop&crop=center&q=85', // Mountain venue
    'https://images.unsplash.com/photo-1551516043-7b21bcd4ed00?w=800&h=500&fit=crop&crop=center&q=85', // Alpine skiing
    'https://images.unsplash.com/photo-1551524164-6e79c4a9b4e4?w=800&h=500&fit=crop&crop=center&q=85' // Winter sports venue
  ];

  private readonly locations: FallbackLocation[] = [
    {
      id: 'solden',
      name: 'Sölden',
      country: 'Austria',
      elevation: 3340,
      raceCount: 2,
      image: this.skiingVenueImages[0],
      coordinates: { lat: 46.9692, lng: 11.0006 },
      description: 'Home to the traditional season opener on the Rettenbach Glacier, Sölden offers world-class racing on pristine glacier snow at over 3,000 meters elevation.',
      seasonHistory: 'Has hosted the FIS Alpine Ski World Cup season opener since 1993, becoming synonymous with the start of the World Cup circuit.',
      famousSlopes: ['Rettenbach Glacier', 'Tiefenbach Glacier', 'Schwarze Schneide']
    },
    {
      id: 'levi',
      name: 'Levi',
      country: 'Finland',
      elevation: 531,
      raceCount: 2,
      image: this.skiingVenueImages[1],
      coordinates: { lat: 67.8034, lng: 24.1745 },
      description: 'The northernmost World Cup venue, featuring challenging slalom racing under the magical Northern Lights and midnight sun conditions.',
      seasonHistory: 'Joined the World Cup circuit in 2004 and has become famous for its unique atmosphere and challenging "Levi Black" slalom course.',
      famousSlopes: ['Levi Black', 'Levi Front', 'Levi Back']
    },
    {
      id: 'gurgl',
      name: 'Gurgl',
      country: 'Austria',
      elevation: 3080,
      raceCount: 1,
      image: this.skiingVenueImages[2],
      coordinates: { lat: 46.8696, lng: 11.0413 },
      description: 'A high-altitude venue in the Ötztal Alps, known for reliable snow conditions and technical slalom courses that challenge the world\'s best.',
      seasonHistory: 'Regularly hosts World Cup races as an alternative venue, particularly when weather conditions affect other locations.',
      famousSlopes: ['Kirchenkar', 'Festkogl', 'Hohe Mut']
    },
    {
      id: 'val-disere',
      name: "Val d'Isère",
      country: 'France',
      elevation: 2822,
      raceCount: 2,
      image: this.skiingVenueImages[3],
      coordinates: { lat: 45.4486, lng: 7.0059 },
      description: 'A prestigious French resort in the heart of the Tarentaise Valley, offering challenging technical races with stunning Alpine scenery.',
      seasonHistory: 'First hosted World Cup races in 1967 and has been a regular fixture, known for producing exciting slalom and giant slalom competitions.',
      famousSlopes: ['Face de Bellevarde', 'Piste Oreiller-Killy', 'La Solaise']
    },
    {
      id: 'alta-badia',
      name: 'Alta Badia',
      country: 'Italy',
      elevation: 2550,
      raceCount: 2,
      image: this.skiingVenueImages[4],
      coordinates: { lat: 46.5669, lng: 11.8943 },
      description: 'Located in the heart of the Dolomites, Alta Badia hosts the spectacular Gran Risa giant slalom, one of the most challenging courses on the circuit.',
      seasonHistory: 'The Gran Risa course has been part of the World Cup since 1985, famous for its steep terrain and the traditional pre-Christmas racing atmosphere.',
      famousSlopes: ['Gran Risa', 'Pralongià', 'Vallon']
    },
    {
      id: 'wengen',
      name: 'Wengen',
      country: 'Switzerland',
      elevation: 2500,
      raceCount: 2,
      image: this.skiingVenueImages[5],
      coordinates: { lat: 46.6088, lng: 7.9219 },
      description: 'Home to the legendary Lauberhorn downhill, the longest and one of the most challenging downhill races on the World Cup calendar.',
      seasonHistory: 'The Lauberhorn has been part of the World Cup since 1967 and is famous for its 4.48km length, making it the longest downhill on the circuit.',
      famousSlopes: ['Lauberhorn', 'Männlichen', 'Kleine Scheidegg']
    },
    {
      id: 'kitzbuehel',
      name: 'Kitzbühel',
      country: 'Austria',
      elevation: 1665,
      raceCount: 3,
      image: 'https://images.unsplash.com/photo-1551524164-6e79c4a9b4e4?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 47.4466, lng: 12.3933 },
      description: 'The most iconic venue in alpine skiing, home to the legendary Hahnenkamm downhill - the most feared and respected race on the circuit.',
      seasonHistory: 'The Hahnenkamm has been held since 1931 and joined the World Cup in 1967. It\'s considered the ultimate test of downhill skiing with its notorious Mausefalle jump.',
      famousSlopes: ['Hahnenkamm', 'Streif', 'Ganslern']
    },
    {
      id: 'garmisch',
      name: 'Garmisch-Partenkirchen',
      country: 'Germany',
      elevation: 1780,
      raceCount: 2,
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 47.4921, lng: 11.0953 },
      description: 'Host of the classic Kandahar races, this Bavarian resort combines Olympic tradition with challenging technical courses beneath the Zugspitze.',
      seasonHistory: 'First hosted international ski races in 1936 Olympics and has been a World Cup venue since 1979, famous for the demanding Kandahar downhill.',
      famousSlopes: ['Kandahar', 'Kreuzeck', 'Hausberg']
    },
    {
      id: 'beaver-creek',
      name: 'Beaver Creek',
      country: 'USA',
      elevation: 3488,
      raceCount: 2,
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 39.6042, lng: -106.5165 },
      description: 'America\'s premier alpine racing venue, featuring the Birds of Prey downhill course known for its high-speed sections and technical challenges.',
      seasonHistory: 'Joined the World Cup circuit in 1987 and has hosted multiple World Championships, known for consistent snow conditions and world-class facilities.',
      famousSlopes: ['Birds of Prey', 'Golden Eagle', 'Peregrine']
    },
    {
      id: 'val-gardena',
      name: 'Val Gardena',
      country: 'Italy',
      elevation: 2518,
      raceCount: 2,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 46.5569, lng: 11.6778 },
      description: 'Set in the stunning Dolomites, Val Gardena hosts the spectacular Saslong downhill and Super G, known for dramatic mountain backdrops.',
      seasonHistory: 'The Saslong course has been part of the World Cup since 1969, famous for its demanding terrain and passionate Italian crowds.',
      famousSlopes: ['Saslong', 'Seceda', 'Dantercëpies']
    },
    {
      id: 'adelboden',
      name: 'Adelboden',
      country: 'Switzerland',
      elevation: 2320,
      raceCount: 2,
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 46.4964, lng: 7.5631 },
      description: 'A traditional Swiss resort hosting the famous Chuenisbärgli giant slalom, known for its steep, challenging terrain and enthusiastic crowds.',
      seasonHistory: 'Has been part of the World Cup since 1967, famous for the demanding Chuenisbärgli slope that tests the technical skills of giant slalom specialists.',
      famousSlopes: ['Chuenisbärgli', 'Sillerenbühl', 'Hahnenmoos']
    },
    {
      id: 'chamonix',
      name: 'Chamonix',
      country: 'France',
      elevation: 2738,
      raceCount: 2,
      image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 45.9237, lng: 6.8694 },
      description: 'The birthplace of extreme skiing, Chamonix offers some of the most challenging off-piste terrain and hosts exciting speed events beneath Mont Blanc.',
      seasonHistory: 'Site of the first Winter Olympics in 1924, Chamonix occasionally hosts World Cup races when its challenging conditions allow.',
      famousSlopes: ['Vallée Blanche', 'Grands Montets', 'Brévent']
    },
    {
      id: 'kvitfjell',
      name: 'Kvitfjell',
      country: 'Norway',
      elevation: 1030,
      raceCount: 2,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 61.4333, lng: 10.1333 },
      description: 'A Norwegian speed venue known for its Olympic downhill course and reliable snow conditions, often hosting season-ending races.',
      seasonHistory: 'Built for the 1994 Olympics, Kvitfjell has become a regular World Cup venue known for its technically demanding downhill and Super G courses.',
      famousSlopes: ['Olympic Downhill', 'Olympiabakken', 'Hafjell']
    },
    {
      id: 'la-thuile',
      name: 'La Thuile',
      country: 'Italy',
      elevation: 2641,
      raceCount: 2,
      image: 'https://images.unsplash.com/photo-1551516043-7b21bcd4ed00?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 45.7089, lng: 6.9547 },
      description: 'A charming Italian resort near the French border, offering challenging technical courses with spectacular views of the Mont Blanc massif.',
      seasonHistory: 'Regularly hosts World Cup races as an alternative venue, known for its intimate atmosphere and challenging course conditions.',
      famousSlopes: ['Les Suches', 'Chaz Dura', 'Belvedere']
    },
    {
      id: 'soldeu',
      name: 'Soldeu',
      country: 'Andorra',
      elevation: 2580,
      raceCount: 2,
      image: 'https://images.unsplash.com/photo-1551524164-88f8c1d80c70?w=800&h=500&fit=crop&crop=center&q=85',
      coordinates: { lat: 42.5764, lng: 1.6650 },
      description: 'A picturesque Pyrenean venue that hosts the World Cup Finals, providing a dramatic conclusion to the season with challenging technical courses.',
      seasonHistory: 'Became the traditional home of the World Cup Finals, offering exciting season-ending races in a unique mountain setting.',
      famousSlopes: ['Avet', 'Espiolets', 'Gall de Bosc']
    }
  ];

  // Enhanced competitor data with consistent male athlete photos
  private readonly competitors24_25: FallbackCompetitor[] = [
    {
      id: 'odermatt-marco',
      name: 'Marco Odermatt',
      country: 'Switzerland',
      age: 27,
      disciplines: ['Giant Slalom', 'Super G', 'Downhill'],
      worldCupPoints: 1542,
      rank: 1,
      image: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'kristoffersen-henrik',
      name: 'Henrik Kristoffersen',
      country: 'Norway',
      age: 30,
      disciplines: ['Slalom', 'Giant Slalom'],
      worldCupPoints: 1234,
      rank: 2,
      image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'pinturault-alexis',
      name: 'Alexis Pinturault',
      country: 'France',
      age: 33,
      disciplines: ['Giant Slalom', 'Slalom', 'Super G'],
      worldCupPoints: 1156,
      rank: 3,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'zubcic-filip',
      name: 'Filip Zubčić',
      country: 'Croatia',
      age: 31,
      disciplines: ['Giant Slalom', 'Slalom'],
      worldCupPoints: 890,
      rank: 4,
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'mayer-matthias',
      name: 'Matthias Mayer',
      country: 'Austria',
      age: 34,
      disciplines: ['Downhill', 'Super G'],
      worldCupPoints: 745,
      rank: 5,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'noel-clement',
      name: 'Clément Noël',
      country: 'France',
      age: 27,
      disciplines: ['Slalom'],
      worldCupPoints: 723,
      rank: 6,
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'schwarz-marco',
      name: 'Marco Schwarz',
      country: 'Austria',
      age: 29,
      disciplines: ['Slalom', 'Giant Slalom'],
      worldCupPoints: 678,
      rank: 7,
      image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'haugan-timon',
      name: 'Timon Haugan',
      country: 'Norway',
      age: 27,
      disciplines: ['Giant Slalom'],
      worldCupPoints: 645,
      rank: 8,
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'meillard-loic',
      name: 'Loïc Meillard',
      country: 'Switzerland',
      age: 28,
      disciplines: ['Giant Slalom', 'Slalom'],
      worldCupPoints: 612,
      rank: 9,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'braathen-lucas',
      name: 'Lucas Braathen',
      country: 'Brazil',
      age: 24,
      disciplines: ['Giant Slalom', 'Slalom'],
      worldCupPoints: 589,
      rank: 10,
      image: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'faivre-mathieu',
      name: 'Mathieu Faivre',
      country: 'France',
      age: 32,
      disciplines: ['Giant Slalom'],
      worldCupPoints: 567,
      rank: 11,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'cochran-dupraz-sam',
      name: 'Sam Cochran-Dupraz',
      country: 'France',
      age: 25,
      disciplines: ['Giant Slalom', 'Slalom'],
      worldCupPoints: 534,
      rank: 12,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'caviezel-gino',
      name: 'Gino Caviezel',
      country: 'Switzerland',
      age: 32,
      disciplines: ['Downhill', 'Super G'],
      worldCupPoints: 512,
      rank: 13,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'vinatzer-alex',
      name: 'Alex Vinatzer',
      country: 'Italy',
      age: 26,
      disciplines: ['Slalom'],
      worldCupPoints: 489,
      rank: 14,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'strasser-linus',
      name: 'Linus Straßer',
      country: 'Germany',
      age: 32,
      disciplines: ['Slalom'],
      worldCupPoints: 467,
      rank: 15,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face&q=85'
    }
  ];

  private readonly competitors25_26: FallbackCompetitor[] = [
    {
      id: 'odermatt-marco',
      name: 'Marco Odermatt',
      country: 'Switzerland',
      age: 28,
      disciplines: ['Giant Slalom', 'Super G', 'Downhill'],
      worldCupPoints: 0,
      rank: 1,
      image: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'kristoffersen-henrik',
      name: 'Henrik Kristoffersen',
      country: 'Norway',
      age: 31,
      disciplines: ['Slalom', 'Giant Slalom'],
      worldCupPoints: 0,
      rank: 2,
      image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'pinturault-alexis',
      name: 'Alexis Pinturault',
      country: 'France',
      age: 34,
      disciplines: ['Giant Slalom', 'Slalom', 'Super G'],
      worldCupPoints: 0,
      rank: 3,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'zubcic-filip',
      name: 'Filip Zubčić',
      country: 'Croatia',
      age: 32,
      disciplines: ['Giant Slalom', 'Slalom'],
      worldCupPoints: 0,
      rank: 4,
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'mayer-matthias',
      name: 'Matthias Mayer',
      country: 'Austria',
      age: 35,
      disciplines: ['Downhill', 'Super G'],
      worldCupPoints: 0,
      rank: 5,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'noel-clement',
      name: 'Clément Noël',
      country: 'France',
      age: 28,
      disciplines: ['Slalom'],
      worldCupPoints: 0,
      rank: 6,
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'schwarz-marco',
      name: 'Marco Schwarz',
      country: 'Austria',
      age: 30,
      disciplines: ['Slalom', 'Giant Slalom'],
      worldCupPoints: 0,
      rank: 7,
      image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'haugan-timon',
      name: 'Timon Haugan',
      country: 'Norway',
      age: 28,
      disciplines: ['Giant Slalom'],
      worldCupPoints: 0,
      rank: 8,
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'meillard-loic',
      name: 'Loïc Meillard',
      country: 'Switzerland',
      age: 29,
      disciplines: ['Giant Slalom', 'Slalom'],
      worldCupPoints: 0,
      rank: 9,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'braathen-lucas',
      name: 'Lucas Braathen',
      country: 'Brazil',
      age: 25,
      disciplines: ['Giant Slalom', 'Slalom'],
      worldCupPoints: 0,
      rank: 10,
      image: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'faivre-mathieu',
      name: 'Mathieu Faivre',
      country: 'France',
      age: 33,
      disciplines: ['Giant Slalom'],
      worldCupPoints: 0,
      rank: 11,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'cochran-dupraz-sam',
      name: 'Sam Cochran-Dupraz',
      country: 'France',
      age: 26,
      disciplines: ['Giant Slalom', 'Slalom'],
      worldCupPoints: 0,
      rank: 12,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'caviezel-gino',
      name: 'Gino Caviezel',
      country: 'Switzerland',
      age: 33,
      disciplines: ['Downhill', 'Super G'],
      worldCupPoints: 0,
      rank: 13,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'vinatzer-alex',
      name: 'Alex Vinatzer',
      country: 'Italy',
      age: 27,
      disciplines: ['Slalom'],
      worldCupPoints: 0,
      rank: 14,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face&q=85'
    },
    {
      id: 'strasser-linus',
      name: 'Linus Straßer',
      country: 'Germany',
      age: 33,
      disciplines: ['Slalom'],
      worldCupPoints: 0,
      rank: 15,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face&q=85'
    }
  ];

  private readonly mockResults: Record<string, FallbackRaceResult[]> = {
    'solden-2024-1': [
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
      },
      {
        rank: 3,
        competitorId: 'pinturault-alexis',
        name: 'Alexis Pinturault',
        country: 'France',
        time: '2:07.12',
        gap: '+0.67',
        points: 60,
        run1: '1:02.89',
        run2: '1:04.23'
      },
      {
        rank: 4,
        competitorId: 'zubcic-filip',
        name: 'Filip Zubčić',
        country: 'Croatia',
        time: '2:07.45',
        gap: '+1.00',
        points: 50,
        run1: '1:03.12',
        run2: '1:04.33'
      },
      {
        rank: 5,
        competitorId: 'meillard-loic',
        name: 'Loïc Meillard',
        country: 'Switzerland',
        time: '2:07.89',
        gap: '+1.44',
        points: 45,
        run1: '1:03.45',
        run2: '1:04.44'
      }
    ],
    'levi-2024-1': [
      {
        rank: 1,
        competitorId: 'kristoffersen-henrik',
        name: 'Henrik Kristoffersen',
        country: 'Norway',
        time: '1:42.23',
        gap: '',
        points: 100,
        run1: '50.12',
        run2: '52.11'
      },
      {
        rank: 2,
        competitorId: 'noel-clement',
        name: 'Clément Noël',
        country: 'France',
        time: '1:42.67',
        gap: '+0.44',
        points: 80,
        run1: '50.45',
        run2: '52.22'
      },
      {
        rank: 3,
        competitorId: 'schwarz-marco',
        name: 'Marco Schwarz',
        country: 'Austria',
        time: '1:43.12',
        gap: '+0.89',
        points: 60,
        run1: '50.78',
        run2: '52.34'
      }
    ]
  };

  // Enhanced course details with more realistic data
  private readonly courseDetails: Record<string, any> = {
    'solden-2024-1': {
      name: 'Rettenbach Glacier',
      length: 1350,
      verticalDrop: 350,
      gates: 65,
      surfaceCondition: 'Hard packed snow',
      temperature: -8,
      startTime: '10:00',
      weather: 'Partly cloudy',
      difficulty: 'Expert',
      startElevation: 3340,
      finishElevation: 2990,
      averageGradient: 25.9,
      maxGradient: 38,
      courseSetter: 'Helmut Krug (AUT)',
      forerunners: ['Romed Baumann (AUT)', 'Matthias Mayer (AUT)']
    },
    'levi-2024-1': {
      name: 'Levi Black',
      length: 950,
      verticalDrop: 190,
      gates: 55,
      surfaceCondition: 'Artificial snow, firm',
      temperature: -12,
      startTime: '10:15',
      weather: 'Clear',
      difficulty: 'Expert',
      startElevation: 531,
      finishElevation: 341,
      averageGradient: 20.0,
      maxGradient: 32,
      courseSetter: 'Matteo Joris (ITA)',
      forerunners: ['Sebastian Foss-Solevåg (NOR)', 'Dave Ryding (GBR)']
    },
    'kitzbuehel-2025-1': {
      name: 'Hahnenkamm Downhill',
      length: 3312,
      verticalDrop: 860,
      gates: 42,
      surfaceCondition: 'Ice and hard pack',
      temperature: -5,
      startTime: '11:30',
      weather: 'Overcast',
      difficulty: 'Extreme',
      startElevation: 1665,
      finishElevation: 805,
      averageGradient: 26.0,
      maxGradient: 85,
      courseSetter: 'Hannes Trinkl (AUT)',
      forerunners: ['Klaus Kröll (AUT)', 'Otmar Striedinger (AUT)']
    }
  };

  getRaces(season: '2024/2025' | '2025/2026'): Promise<FallbackRace[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(season === '2024/2025' ? this.races24_25 : this.races25_26);
      }, 100);
    });
  }

  getLocations(season: '2024/2025' | '2025/2026'): Promise<FallbackLocation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.locations);
      }, 100);
    });
  }

  getCompetitors(season: '2024/2025' | '2025/2026'): Promise<FallbackCompetitor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const competitors = season === '2024/2025' ? this.competitors24_25 : this.competitors25_26;
        // Ensure all competitors use consistent photos from the photo service
        const competitorsWithPhotos = competitors.map(competitor => ({
          ...competitor,
          image: athletePhotoService.getAthletePhoto(competitor.id)
        }));
        resolve(competitorsWithPhotos);
      }, 100);
    });
  }

  getRaceResults(raceId: string): Promise<FallbackRaceResult[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockResults[raceId] || [
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
          }
        ]);
      }, 100);
    });
  }

  getCompetitorDetails(competitorId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const competitor = this.competitors24_25.find(c => c.id === competitorId) || this.competitors24_25[0];
        
        const enhancedDetails = {
          id: competitor.id,
          name: competitor.name,
          country: competitor.country,
          age: competitor.age,
          height: competitor.id === 'odermatt-marco' ? '1.86m' : competitor.id === 'kristoffersen-henrik' ? '1.80m' : '1.82m',
          weight: competitor.id === 'odermatt-marco' ? '85kg' : competitor.id === 'kristoffersen-henrik' ? '78kg' : '80kg',
          birthDate: competitor.id === 'odermatt-marco' ? '1997-10-08' : competitor.id === 'kristoffersen-henrik' ? '1994-07-02' : '1995-05-15',
          birthPlace: competitor.id === 'odermatt-marco' ? 'Buochs, Switzerland' : competitor.id === 'kristoffersen-henrik' ? 'Ål, Norway' : 'Chamonix, France',
          worldCupDebut: competitor.id === 'odermatt-marco' ? '2018' : competitor.id === 'kristoffersen-henrik' ? '2012' : '2016',
          worldCupWins: competitor.id === 'odermatt-marco' ? 37 : competitor.id === 'kristoffersen-henrik' ? 23 : 15,
          olympicMedals: competitor.id === 'odermatt-marco' ? 2 : competitor.id === 'kristoffersen-henrik' ? 1 : 1,
          worldChampionships: competitor.id === 'odermatt-marco' ? 3 : competitor.id === 'kristoffersen-henrik' ? 2 : 1,
          disciplines: competitor.disciplines,
          image: athletePhotoService.getAthletePhoto(competitor.id), // Use centralized photo service
          currentSeasonStats: {
            races: 15,
            wins: competitor.id === 'odermatt-marco' ? 8 : competitor.id === 'kristoffersen-henrik' ? 4 : 2,
            podiums: competitor.id === 'odermatt-marco' ? 12 : competitor.id === 'kristoffersen-henrik' ? 9 : 6,
            points: competitor.worldCupPoints
          }
        };
        resolve(enhancedDetails);
      }, 100);
    });
  }

  getWeatherData(locationId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const weatherConditions = {
          solden: {
            current: { temperature: -8, condition: 'Partly Cloudy', windSpeed: 15, visibility: 'Good' },
            forecast: [
              { day: 'Today', high: -5, low: -12, condition: 'Partly Cloudy', windSpeed: 15 },
              { day: 'Tomorrow', high: -3, low: -10, condition: 'Sunny', windSpeed: 10 },
              { day: 'Day 3', high: -6, low: -14, condition: 'Snow', windSpeed: 20 }
            ]
          },
          levi: {
            current: { temperature: -15, condition: 'Clear', windSpeed: 8, visibility: 'Excellent' },
            forecast: [
              { day: 'Today', high: -12, low: -18, condition: 'Clear', windSpeed: 8 },
              { day: 'Tomorrow', high: -10, low: -16, condition: 'Partly Cloudy', windSpeed: 12 },
              { day: 'Day 3', high: -14, low: -20, condition: 'Light Snow', windSpeed: 15 }
            ]
          },
          kitzbuehel: {
            current: { temperature: -3, condition: 'Overcast', windSpeed: 25, visibility: 'Fair' },
            forecast: [
              { day: 'Today', high: -1, low: -6, condition: 'Overcast', windSpeed: 25 },
              { day: 'Tomorrow', high: 2, low: -4, condition: 'Light Snow', windSpeed: 20 },
              { day: 'Day 3', high: -2, low: -8, condition: 'Partly Cloudy', windSpeed: 15 }
            ]
          }
        };
        resolve(weatherConditions[locationId as keyof typeof weatherConditions] || weatherConditions.solden);
      }, 100);
    });
  }

  getCourseDetails(raceId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.courseDetails[raceId] || {
          name: 'Standard Course',
          length: 1200,
          verticalDrop: 300,
          gates: 60,
          surfaceCondition: 'Hard packed snow',
          temperature: -5,
          startTime: '10:30',
          weather: 'Clear',
          difficulty: 'Expert'
        });
      }, 100);
    });
  }

  getPhotos(raceId?: string, competitorId?: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const photos = [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop&crop=center&q=85',
            caption: 'Start gate preparation',
            category: 'race',
            photographer: 'FIS Media'
          },
          {
            id: '2',
            url: 'https://images.unsplash.com/photo-1578583089129-1a56a0b5c3dc?w=800&h=600&fit=crop&crop=center&q=85',
            caption: 'Downhill action shot',
            category: 'action',
            photographer: 'Alpine Photography'
          },
          {
            id: '3',
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center&q=85',
            caption: 'Podium ceremony',
            category: 'ceremony',
            photographer: 'World Cup Media'
          }
        ];
        resolve(photos);
      }, 100);
    });
  }

  getVideos(raceId?: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const videos = [
          {
            id: '1',
            title: 'Race Highlights',
            thumbnail: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400&h=300&fit=crop&crop=center&q=85',
            duration: '3:45',
            category: 'highlights'
          },
          {
            id: '2',
            title: 'Winning Run',
            thumbnail: 'https://images.unsplash.com/photo-1578583089129-1a56a0b5c3dc?w=400&h=300&fit=crop&crop=center&q=85',
            duration: '2:15',
            category: 'analysis'
          }
        ];
        resolve(videos);
      }, 100);
    });
  }
}

export const fallbackDataService = new FallbackDataService();