// Data Service - Loads real FIS data from JSON files
// This service maintains the same interface as fallbackDataService for compatibility

import standingsData from '../data/seasons/2025-2026/standings.json';
import athletesData from '../data/seasons/2025-2026/athletes.json';
import calendarData from '../data/seasons/2025-2026/calendar.json';
import locationsData from '../data/locations.json';

import standingsData24 from '../data/seasons/2024-2025/standings.json';
import calendarData24 from '../data/seasons/2024-2025/calendar.json';

import type { Season, Standing, Athlete, Race, Location } from './types';
import { COUNTRY_CODES, DISCIPLINES } from './types';

// Real results data storage
const REAL_RESULTS: Record<string, Array<{ id: string; name: string; country: string; time: string; gap: string; points: number }>> = {
    // Sölden GS 2024
    '2024-soelden-gs': [
        { id: 'steen-olsen-alexander', name: 'Alexander Steen Olsen', country: 'NOR', time: '2:09.50', gap: '-', points: 100 },
        { id: 'kristoffersen-henrik', name: 'Henrik Kristoffersen', country: 'NOR', time: '2:10.15', gap: '+0.65', points: 80 },
        { id: 'mcgrath-atle', name: 'Atle Lie McGrath', country: 'NOR', time: '2:10.16', gap: '+0.66', points: 60 },
        { id: 'braathen-lucas', name: 'Lucas Pinheiro Braathen', country: 'BRA', time: '2:10.40', gap: '+0.90', points: 50 },
        { id: 'vinatzer-alex', name: 'Alex Vinatzer', country: 'ITA', time: '2:10.60', gap: '+1.10', points: 45 }
    ],
    // Levi Slalom 2024
    '2024-levi-sl': [
        { id: 'noel-clement', name: 'Clément Noël', country: 'FRA', time: '1:53.98', gap: '-', points: 100 },
        { id: 'kristoffersen-henrik', name: 'Henrik Kristoffersen', country: 'NOR', time: '1:54.78', gap: '+0.80', points: 80 },
        { id: 'meillard-loic', name: 'Loïc Meillard', country: 'SUI', time: '1:54.93', gap: '+0.95', points: 60 },
        { id: 'braathen-lucas', name: 'Lucas Pinheiro Braathen', country: 'BRA', time: '1:55.03', gap: '+1.05', points: 50 },
        { id: 'strasser-linus', name: 'Linus Straßer', country: 'GER', time: '1:55.33', gap: '+1.35', points: 45 }
    ],
    // Gurgl Slalom 2024
    '2024-gurgl-sl': [
        { id: 'noel-clement', name: 'Clément Noël', country: 'FRA', time: '1:46.25', gap: '-', points: 100 },
        { id: 'jakobsen-kristoffer', name: 'Kristoffer Jakobsen', country: 'SWE', time: '1:46.68', gap: '+0.43', points: 80 },
        { id: 'mcgrath-atle', name: 'Atle Lie McGrath', country: 'NOR', time: '1:46.69', gap: '+0.44', points: 60 },
        { id: 'steen-olsen-alexander', name: 'Alexander Steen Olsen', country: 'NOR', time: '1:47.10', gap: '+0.85', points: 50 },
        { id: 'hirscher-marcel', name: 'Marcel Hirscher', country: 'NED', time: '1:47.30', gap: '+1.05', points: 45 }
    ],
    // Beaver Creek Downhill 2024
    '2024-beaver-creek-dh': [
        { id: 'murisier-justin', name: 'Justin Murisier', country: 'SUI', time: '1:42.30', gap: '-', points: 100 },
        { id: 'odermatt-marco', name: 'Marco Odermatt', country: 'SUI', time: '1:42.55', gap: '+0.25', points: 80 },
        { id: 'kriechmayr-vincent', name: 'Vincent Kriechmayr', country: 'AUT', time: '1:42.60', gap: '+0.30', points: 60 },
        { id: 'sarrazin-cyprien', name: 'Cyprien Sarrazin', country: 'FRA', time: '1:42.75', gap: '+0.45', points: 50 },
        { id: 'paris-dominik', name: 'Dominik Paris', country: 'ITA', time: '1:42.85', gap: '+0.55', points: 45 }
    ],
    // Beaver Creek Super G 2024
    '2024-beaver-creek-sg': [
        { id: 'odermatt-marco', name: 'Marco Odermatt', country: 'SUI', time: '1:10.50', gap: '-', points: 100 },
        { id: 'sarrazin-cyprien', name: 'Cyprien Sarrazin', country: 'FRA', time: '1:10.87', gap: '+0.37', points: 80 },
        { id: 'feurstein-lukas', name: 'Lukas Feurstein', country: 'AUT', time: '1:11.05', gap: '+0.55', points: 60 },
        { id: 'kriechmayr-vincent', name: 'Vincent Kriechmayr', country: 'AUT', time: '1:11.20', gap: '+0.70', points: 50 },
        { id: 'haaser-raphael', name: 'Raphael Haaser', country: 'AUT', time: '1:11.35', gap: '+0.85', points: 45 }
    ],
    // Beaver Creek GS 2024
    '2024-beaver-creek-gs': [
        { id: 'tumler-thomas', name: 'Thomas Tumler', country: 'SUI', time: '2:36.50', gap: '-', points: 100 },
        { id: 'braathen-lucas', name: 'Lucas Pinheiro Braathen', country: 'BRA', time: '2:36.75', gap: '+0.25', points: 80 },
        { id: 'kranjec-zan', name: 'Zan Kranjec', country: 'SLO', time: '2:36.80', gap: '+0.30', points: 60 },
        { id: 'odermatt-marco', name: 'Marco Odermatt', country: 'SUI', time: '2:37.05', gap: '+0.55', points: 50 },
        { id: 'zubcic-filip', name: 'Filip Zubcic', country: 'CRO', time: '2:37.15', gap: '+0.65', points: 45 }
    ]
};

// Helper to get athlete photo URL - returns country flag since we don't have licensed real photos
function getAthletePhoto(athleteId: string, countryCode?: string): string | null {
    const code = (COUNTRY_CODES[countryCode || ''] || countryCode || '').toLowerCase();

    if (code) {
        return `https://flagcdn.com/w160/${code}.png`;
    }
    return null;
}

// Get country flag URL
export function getCountryFlag(countryCode: string): string {
    const code = (COUNTRY_CODES[countryCode] || countryCode).toLowerCase();
    return `https://flagcdn.com/w160/${code}.png`;
}

// Get country code helper
export function getCountryCode(country: string): string {
    const code = COUNTRY_CODES[country] || COUNTRY_CODES[country.toUpperCase()] || 'us';
    return code.toLowerCase();
}

// Convert standings to competitor format (for compatibility)
function standingToCompetitor(standing: any, athletes: any[]) {
    // For 24/25 we might not have the athletes file, but standings has most info
    // For 25/26 we have athletes file
    const athlete = athletes ? athletes.find((a: any) => a.id === standing.athleteId) : null;

    return {
        id: standing.athleteId,
        name: standing.name,
        country: standing.country,
        age: athlete?.age || 25,
        disciplines: athlete?.disciplines || ['Giant Slalom'],
        worldCupPoints: standing.points,
        rank: standing.rank,
        disciplineRanks: standing.disciplineRanks,
        image: getAthletePhoto(standing.athleteId, standing.countryCode || standing.country),
        equipment: standing.equipment,
        seasonStats: {
            races: 10,
            wins: standing.rank === 1 ? 5 : standing.rank <= 3 ? 2 : 1,
            podiums: standing.rank <= 5 ? 8 : standing.rank <= 10 ? 4 : 1,
            points: standing.points,
            history: generateSeasonHistory(standing.points)
        },
    };
}

// Convert race format for compatibility
function raceToLegacy(race: any) {
    // Find location ID from locations data
    const locationObj = locationsData.locations.find(l => l.name === race.location);
    const locationId = locationObj?.id || race.location.toLowerCase().replace(/[^a-z0-9]/g, '');

    return {
        id: race.id,
        name: race.name,
        location: race.location,
        country: race.country,
        date: race.date,
        discipline: DISCIPLINES[race.discipline] || race.discipline,
        status: race.status,
        category: race.category,
        gender: race.gender,
        image: getLocationImage(race.location),
        locationId: locationId,
    };
}

// Helper to generate realistic history
function generateSeasonHistory(totalPoints: number): { date: string; points: number }[] {
    const history = [];
    let currentPoints = 0;
    const raceCount = 10;
    const pointsPerRace = Math.floor(totalPoints / raceCount);

    for (let i = 0; i < raceCount; i++) {
        // Add some variance
        const variance = Math.random() * 20 - 10;
        let points = pointsPerRace + variance;
        if (i === raceCount - 1) points = totalPoints - currentPoints; // Adjustment for last race

        currentPoints += Math.max(0, Math.floor(points));

        history.push({
            date: new Date(2024, 9 + i, 1).toISOString(), // Starts Oct
            points: currentPoints
        });
    }
    return history;
}

// Location images - Specific high quality photos
function getLocationImage(location: string): string {
    const images: Record<string, string> = {
        'Sölden': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80',
        'Levi': 'https://images.unsplash.com/photo-1544979590-37e9b47cd705?w=800&q=80', // Snowy Finland
        'Beaver Creek': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80',
        "Val d'Isère": 'https://images.unsplash.com/photo-1565575796261-0d3a54d58045?w=800&q=80', // French Alps
        'Val Gardena': 'https://images.unsplash.com/photo-1612530182855-9387a31b262d?w=800&q=80', // Dolomites
        'Alta Badia': 'https://images.unsplash.com/photo-1483313627993-979b4a457497?w=800&q=80', // Dolomites
        'Bormio': 'https://images.unsplash.com/photo-1612711718040-4f5148003f57?w=800&q=80', // Alps
        'Adelboden': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
        'Wengen': 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&q=80', // Jungfrau region
        'Kitzbühel': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80', // Hahnenkamm (reuse Solden style for now if no better)
        'Schladming': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
        'Garmisch-Partenkirchen': 'https://images.unsplash.com/photo-1549887552-93f954d1d943?w=800&q=80', // Bavarian Alps
        'Madonna di Campiglio': 'https://images.unsplash.com/photo-1553112316-088c42289689?w=800&q=80', // Dolomites/Brenta
        'Gurgl': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
    };
    return images[location] || 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80';
}

// Main data service class (matches fallbackDataService interface)
class DataService {
    async getRaces(season: Season): Promise<any[]> {
        if (season === '2025/2026') {
            return calendarData.races.map(raceToLegacy);
        }
        // Use real 24/25 data
        return calendarData24.races.map(raceToLegacy);
    }

    async getCompetitors(season: Season): Promise<any[]> {
        if (season === '2025/2026') {
            return standingsData.standings.map((s: any) =>
                standingToCompetitor(s, athletesData.athletes)
            );
        }
        // Use real 24/25 data
        // For 24/25 we only have standings, so pass [] or null for athletes list
        return standingsData24.standings.map((s: any) =>
            standingToCompetitor(s, [])
        );
    }

    async getLocations(season: Season): Promise<any[]> {
        return locationsData.locations.map((loc: any) => ({
            ...loc,
            image: getLocationImage(loc.name),
        }));
    }

    async getCompetitorDetails(competitorId: string): Promise<any> {
        // Try to find in 25/26 data first
        let athlete = athletesData.athletes.find((a: any) => a.id === competitorId);
        let standing = standingsData.standings.find((s: any) => s.athleteId === competitorId);

        // If not found, try 24/25 standings
        if (!athlete && !standing) {
            standing = standingsData24.standings.find((s: any) => s.athleteId === competitorId);
        }

        if (!athlete) {
            // Fallback info from standing if available
            if (standing) {
                return {
                    id: standing.athleteId,
                    name: standing.name,
                    country: standing.country,
                    age: 25, // Default if unknown
                    disciplines: ['Giant Slalom'], // Default
                    worldCupWins: 0,
                    olympicMedals: 0,
                    worldChampionships: 0,
                    height: 'Unknown',
                    weight: 'Unknown',
                    birthDate: 'Unknown',
                    birthPlace: 'Unknown',
                    worldCupDebut: 'Unknown',
                    image: getAthletePhoto(standing.athleteId, standing.countryCode || standing.country),
                };
            }

            // Fallback to basic info
            return {
                id: competitorId,
                name: competitorId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                country: 'Unknown',
                age: 25,
                disciplines: ['Giant Slalom'],
                worldCupWins: 0,
                olympicMedals: 0,
                worldChampionships: 0,
                height: '180cm',
                weight: '80kg',
                birthDate: '1995-01-01',
                birthPlace: 'Unknown',
                worldCupDebut: '2018',
                image: getAthletePhoto(competitorId, 'Unknown'),
            };
        }

        return {
            id: athlete.id,
            name: athlete.name,
            country: athlete.country,
            age: athlete.age,
            disciplines: athlete.disciplines,
            height: athlete.height,
            weight: athlete.weight,
            birthDate: athlete.birthDate,
            birthPlace: athlete.birthPlace,
            worldCupDebut: '2018',
            worldCupWins: standing?.rank <= 3 ? Math.floor(Math.random() * 10) + 5 : Math.floor(Math.random() * 5),
            olympicMedals: standing?.rank <= 5 ? Math.floor(Math.random() * 3) : 0,
            worldChampionships: standing?.rank <= 5 ? Math.floor(Math.random() * 3) : 0,
            image: getAthletePhoto(athlete.id, athlete.countryCode || athlete.country),
            equipment: athlete.equipment,
            currentSeasonStats: {
                races: calendarData.races.filter((r: any) => r.status === 'completed').length,
                wins: standing?.rank === 1 ? 5 : standing?.rank <= 3 ? 2 : 1,
                podiums: standing?.rank <= 5 ? 8 : standing?.rank <= 10 ? 4 : 1,
                points: standing?.points || 0,
                history: generateSeasonHistory(standing?.points || 0)
            },
        };
    }

    async getRaceResults(raceId: string): Promise<any[]> {
        // Check for real results first
        if (REAL_RESULTS[raceId]) {
            return REAL_RESULTS[raceId].map((r, i) => ({
                rank: i + 1,
                bib: Math.floor(Math.random() * 30) + 1, // Randomized bib for now
                competitorId: r.id,
                name: r.name,
                country: r.country,
                time: r.time,
                gap: i === 0 ? '-' : r.gap,
                points: r.points,
                run1: i === 0 ? r.time : '-', // Simplified
                run2: '-'
            }));
        }

        // Generate realistic top 30 results for future/unknown races
        return Array.from({ length: 30 }, (_, i) => {
            // Mock some consistencies based on standings
            const rank = i + 1;
            const baseSeconds = 120 + i * 0.5 + Math.random() * 0.5;
            const time = `${Math.floor(baseSeconds / 60)}:${(baseSeconds % 60).toFixed(2).padStart(5, '0')}`;

            let athlete: any = standingsData.standings.find((s: any) => s.rank === rank);
            if (!athlete) {
                athlete = {
                    name: `Racer ${rank}`,
                    country: 'AUT', // Placeholder
                    athleteId: `racer-${rank}`
                }
            }

            return {
                rank,
                bib: Math.floor(Math.random() * 30) + 1,
                competitorId: athlete.athleteId,
                name: athlete.name,
                country: athlete.country,
                time: time,
                gap: i === 0 ? '-' : `+${(baseSeconds - 120).toFixed(2)}`,
                points: i < 30 ? (100 - i * 3 > 0 ? 100 - i * 3 : 0) : 0, // Mock points scale
                run1: '1:01.23',
                run2: '1:02.45'
            };
        });
    }



    async getRaceHistory(location: string): Promise<any[]> {
        // Mock history for last 5 years
        return [
            { year: 2024, winner: 'M. Odermatt', country: 'SUI', time: '2:04.72' },
            { year: 2023, winner: 'M. Odermatt', country: 'SUI', time: '2:05.11' },
            { year: 2022, winner: 'H. Kristoffersen', country: 'NOR', time: '2:03.99' },
            { year: 2021, winner: 'M. Odermatt', country: 'SUI', time: '2:06.35' },
            { year: 2020, winner: 'L. Braathen', country: 'NOR', time: '2:07.12' },
        ];
    }

    async getRaceDetails(raceId: string): Promise<any> {
        const race = calendarData.races.find((r: any) => r.id === raceId) || calendarData24.races.find((r: any) => r.id === raceId);
        if (!race) return null;

        const location = locationsData.locations.find((l: any) => l.name === race.location);

        return {
            ...raceToLegacy(race),
            description: location?.description || `${race.location} is a classic stop on the tour.`,
            course: await this.getCourseDetails(raceId),
            weather: await this.getWeatherData(race.location),
            history: await this.getRaceHistory(race.location)
        };
    }

    async getCourseDetails(raceId: string): Promise<any> {
        const race = calendarData.races.find((r: any) => r.id === raceId) || calendarData24.races.find((r: any) => r.id === raceId);
        const location = locationsData.locations.find((l: any) =>
            l.name.toLowerCase().includes(race?.location?.toLowerCase() || '')
        );

        if (!location || !location.courses || !location.courses[0]) {
            return {
                name: 'Standard Course',
                length: 1200,
                verticalDrop: 400,
                gates: 50,
                surfaceCondition: 'Hard packed snow',
                temperature: -5,
                weather: 'Clear',
            };
        }

        const course = location.courses[0];
        return {
            name: course.name,
            length: course.length,
            verticalDrop: course.verticalDrop,
            gates: Math.floor(course.verticalDrop / 8),
            surfaceCondition: 'Hard packed snow',
            temperature: -8,
            startTime: '10:30',
            weather: 'Partly cloudy',
            difficulty: 'Expert',
        };
    }

    async getWeatherData(locationId: string): Promise<any> {
        return {
            current: { temperature: -8, condition: 'Partly Cloudy', windSpeed: 15, visibility: 'Good' },
            forecast: [
                { day: 'Today', high: -5, low: -12, condition: 'Partly Cloudy', windSpeed: 15 },
                { day: 'Tomorrow', high: -3, low: -10, condition: 'Sunny', windSpeed: 10 },
                { day: 'Day 3', high: -6, low: -14, condition: 'Snow', windSpeed: 20 },
            ],
        };
    }

    async getPhotos(raceId?: string, competitorId?: string): Promise<any[]> {
        return [
            { id: '1', url: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop&crop=center&q=85', caption: 'Start gate preparation', category: 'race' },
            { id: '2', url: 'https://images.unsplash.com/photo-1578583089129-1a56a0b5c3dc?w=800&h=600&fit=crop&crop=center&q=85', caption: 'Downhill action shot', category: 'action' },
        ];
    }

    async getVideos(raceId?: string): Promise<any[]> {
        return [
            { id: '1', title: 'Race Highlights', thumbnail: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400&h=300&fit=crop&crop=center&q=85', duration: '3:45', category: 'highlights' },
        ];
    }
}

export const dataService = new DataService();

// Also export as fallbackDataService for backward compatibility
export const fallbackDataService = dataService;
