// Type definitions for FIS Ski World Cup data

export type Season = '2025/2026' | '2024/2025';

export interface Athlete {
    id: string;
    fisCode: string;
    name: string;
    firstName: string;
    lastName: string;
    country: string;
    countryCode: string;
    birthDate?: string;
    age?: number;
    disciplines: string[];
    equipment?: string;
    image?: string;
}

export interface Standing {
    rank: number;
    athleteId: string;
    name: string;
    country: string;
    countryCode: string;
    points: number;
    equipment?: string;
    disciplineRanks?: {
        overall?: { rank: number; points: number };
        downhill?: { rank: number; points: number };
        slalom?: { rank: number; points: number };
        giantSlalom?: { rank: number; points: number };
        superG?: { rank: number; points: number };
    };
}

export interface Race {
    id: string;
    name: string;
    location: string;
    country: string;
    countryCode: string;
    date: string;
    endDate?: string;
    discipline: string;
    category: string; // WC, EC, NAC, etc.
    gender: 'M' | 'W' | 'Mixed';
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    eventId?: string;
}

export interface RaceResult {
    raceId: string;
    rank: number;
    athleteId: string;
    name: string;
    country: string;
    time: string;
    gap: string;
    points: number;
    run1?: string;
    run2?: string;
    status?: 'finished' | 'dnf' | 'dsq' | 'dns';
}

export interface Location {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    altitude?: number;
    courses?: {
        name: string;
        discipline: string;
        length?: number;
        verticalDrop?: number;
    }[];
    description?: string;
    image?: string;
}

// Country code mappings
export const COUNTRY_CODES: Record<string, string> = {
    'SUI': 'ch',
    'Switzerland': 'ch',
    'AUT': 'at',
    'Austria': 'at',
    'NOR': 'no',
    'Norway': 'no',
    'FRA': 'fr',
    'France': 'fr',
    'ITA': 'it',
    'Italy': 'it',
    'GER': 'de',
    'Germany': 'de',
    'USA': 'us',
    'United States': 'us',
    'CAN': 'ca',
    'Canada': 'ca',
    'SWE': 'se',
    'Sweden': 'se',
    'SLO': 'si',
    'Slovenia': 'si',
    'CRO': 'hr',
    'Croatia': 'hr',
    'BRA': 'br',
    'Brazil': 'br',
    'FIN': 'fi',
    'Finland': 'fi',
    'GBR': 'gb',
    'Great Britain': 'gb',
    'JPN': 'jp',
    'Japan': 'jp',
    'CHN': 'cn',
    'China': 'cn',
    'POL': 'pl',
    'Poland': 'pl',
    'CZE': 'cz',
    'Czechia': 'cz',
    'SVK': 'sk',
    'Slovakia': 'sk',
    'BEL': 'be',
    'Belgium': 'be',
    'NED': 'nl',
    'Netherlands': 'nl',
    'ESP': 'es',
    'Spain': 'es',
    'AND': 'ad',
    'Andorra': 'ad',
    'LIE': 'li',
    'Liechtenstein': 'li',
};

// Discipline mappings
export const DISCIPLINES: Record<string, string> = {
    'DH': 'Downhill',
    'SG': 'Super G',
    'GS': 'Giant Slalom',
    'SL': 'Slalom',
    'AC': 'Alpine Combined',
    'PAR': 'Parallel',
};
