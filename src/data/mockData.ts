export interface Competitor {
  id: string;
  name: string;
  country: string;
  age: number;
  worldCupWins: number;
  totalPoints: number;
  avatar?: string;
}

export interface Race {
  id: string;
  locationId: string;
  discipline: 'DH' | 'SG' | 'GS' | 'SL';
  date: string;
  season: '2024/2025' | '2025/2026';
  status: 'completed' | 'scheduled' | 'cancelled';
}

export interface Location {
  id: string;
  name: string;
  country: string;
  elevation: number;
  description: string;
  image?: string;
}

export interface RaceResult {
  id: string;
  raceId: string;
  competitorId: string;
  position: number;
  time: string;
  points: number;
  dnf?: boolean;
}

export const competitors: Competitor[] = [
  {
    id: '1',
    name: 'Marco Odermatt',
    country: 'Switzerland',
    age: 27,
    worldCupWins: 37,
    totalPoints: 2042,
  },
  {
    id: '2',
    name: 'Aleksander Aamodt Kilde',
    country: 'Norway',
    age: 32,
    worldCupWins: 21,
    totalPoints: 1685,
  },
  {
    id: '3',
    name: 'Vincent Kriechmayr',
    country: 'Austria',
    age: 33,
    worldCupWins: 12,
    totalPoints: 1456,
  },
  {
    id: '4',
    name: 'Henrik Kristoffersen',
    country: 'Norway',
    age: 30,
    worldCupWins: 30,
    totalPoints: 1789,
  },
  {
    id: '5',
    name: 'Luca Aerni',
    country: 'Switzerland',
    age: 30,
    worldCupWins: 2,
    totalPoints: 867,
  },
  {
    id: '6',
    name: 'Manuel Feller',
    country: 'Austria',
    age: 32,
    worldCupWins: 7,
    totalPoints: 1234,
  }
];

export const locations: Location[] = [
  {
    id: '1',
    name: 'St. Moritz',
    country: 'Switzerland',
    elevation: 1856,
    description: 'One of the most prestigious venues in alpine skiing, known for its challenging Corviglia slope and glamorous atmosphere.',
  },
  {
    id: '2',
    name: 'Val d\'Isère',
    country: 'France',
    elevation: 1850,
    description: 'Famous for the Face de Bellevarde downhill, one of the most technically demanding courses on the World Cup circuit.',
  },
  {
    id: '3',
    name: 'Wengen',
    country: 'Switzerland',
    elevation: 1274,
    description: 'Home to the legendary Lauberhorn downhill, the longest race on the World Cup calendar.',
  },
  {
    id: '4',
    name: 'Kitzbühel',
    country: 'Austria',
    elevation: 762,
    description: 'The infamous Hahnenkamm downhill is considered the most dangerous and prestigious race in alpine skiing.',
  },
  {
    id: '5',
    name: 'Alta Badia',
    country: 'Italy',
    elevation: 1433,
    description: 'Known for its technical giant slalom on the Gran Risa slope, featuring the challenging Camel Bumps section.',
  },
  {
    id: '6',
    name: 'Bansko',
    country: 'Bulgaria',
    elevation: 1600,
    description: 'A modern ski resort that has become a regular stop on the World Cup circuit with excellent facilities.',
  }
];

export const races: Race[] = [
  // 2024/2025 Season
  {
    id: '1',
    locationId: '1',
    discipline: 'GS',
    date: '2024-12-15',
    season: '2024/2025',
    status: 'completed',
  },
  {
    id: '2',
    locationId: '2',
    discipline: 'DH',
    date: '2024-12-08',
    season: '2024/2025',
    status: 'completed',
  },
  {
    id: '3',
    locationId: '3',
    discipline: 'DH',
    date: '2025-01-18',
    season: '2024/2025',
    status: 'completed',
  },
  {
    id: '4',
    locationId: '4',
    discipline: 'DH',
    date: '2025-01-25',
    season: '2024/2025',
    status: 'completed',
  },
  {
    id: '5',
    locationId: '5',
    discipline: 'GS',
    date: '2024-12-22',
    season: '2024/2025',
    status: 'completed',
  },
  // 2025/2026 Season (upcoming)
  {
    id: '6',
    locationId: '1',
    discipline: 'SG',
    date: '2025-12-14',
    season: '2025/2026',
    status: 'scheduled',
  },
  {
    id: '7',
    locationId: '6',
    discipline: 'SL',
    date: '2025-11-23',
    season: '2025/2026',
    status: 'scheduled',
  },
];

export const raceResults: RaceResult[] = [
  // St. Moritz GS Results
  {
    id: '1',
    raceId: '1',
    competitorId: '1',
    position: 1,
    time: '2:18.45',
    points: 100,
  },
  {
    id: '2',
    raceId: '1',
    competitorId: '4',
    position: 2,
    time: '2:18.89',
    points: 80,
  },
  {
    id: '3',
    raceId: '1',
    competitorId: '6',
    position: 3,
    time: '2:19.12',
    points: 60,
  },
  // Val d'Isère DH Results
  {
    id: '4',
    raceId: '2',
    competitorId: '2',
    position: 1,
    time: '1:42.33',
    points: 100,
  },
  {
    id: '5',
    raceId: '2',
    competitorId: '3',
    position: 2,
    time: '1:42.67',
    points: 80,
  },
  {
    id: '6',
    raceId: '2',
    competitorId: '1',
    position: 3,
    time: '1:42.89',
    points: 60,
  },
  // Wengen DH Results
  {
    id: '7',
    raceId: '3',
    competitorId: '1',
    position: 1,
    time: '2:25.67',
    points: 100,
  },
  {
    id: '8',
    raceId: '3',
    competitorId: '2',
    position: 2,
    time: '2:26.12',
    points: 80,
  },
  {
    id: '9',
    raceId: '3',
    competitorId: '3',
    position: 3,
    time: '2:26.45',
    points: 60,
  },
  // Kitzbühel DH Results
  {
    id: '10',
    raceId: '4',
    competitorId: '3',
    position: 1,
    time: '1:56.14',
    points: 100,
  },
  {
    id: '11',
    raceId: '4',
    competitorId: '1',
    position: 2,
    time: '1:56.78',
    points: 80,
  },
  {
    id: '12',
    raceId: '4',
    competitorId: '2',
    position: 3,
    time: '1:57.02',
    points: 60,
  },
  // Alta Badia GS Results
  {
    id: '13',
    raceId: '5',
    competitorId: '4',
    position: 1,
    time: '2:31.89',
    points: 100,
  },
  {
    id: '14',
    raceId: '5',
    competitorId: '1',
    position: 2,
    time: '2:32.15',
    points: 80,
  },
  {
    id: '15',
    raceId: '5',
    competitorId: '6',
    position: 3,
    time: '2:32.67',
    points: 60,
  },
];

export const disciplineNames = {
  'DH': 'Downhill',
  'SG': 'Super Giant Slalom',
  'GS': 'Giant Slalom',
  'SL': 'Slalom'
};

export const getCompetitorById = (id: string) => competitors.find(c => c.id === id);
export const getLocationById = (id: string) => locations.find(l => l.id === id);
export const getRaceById = (id: string) => races.find(r => r.id === id);
export const getRaceResults = (raceId: string) => raceResults.filter(r => r.raceId === raceId);
export const getRacesByLocation = (locationId: string) => races.filter(r => r.locationId === locationId);
export const getRacesBySeason = (season: '2024/2025' | '2025/2026') => races.filter(r => r.season === season);