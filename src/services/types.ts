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
    'AUT': 'at',
    'NOR': 'no',
    'FRA': 'fr',
    'ITA': 'it',
    'GER': 'de',
    'USA': 'us',
    'CAN': 'ca',
    'SWE': 'se',
    'SLO': 'si',
    'CRO': 'hr',
    'BRA': 'br',
    'FIN': 'fi',
    'GBR': 'gb',
    'JPN': 'jp',
    'CHN': 'cn',
    'POL': 'pl',
    'CZE': 'cz',
    'SVK': 'sk',
    'BEL': 'be',
    'NED': 'nl',
    'ESP': 'es',
    'AND': 'ad',
    'LIE': 'li',
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
