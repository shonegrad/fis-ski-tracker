interface HistoricalStats {
  totalRaces: number;
  wins: number;
  podiums: number;
  averagePoints: number;
  bestSeason: string;
  disciplineBreakdown: {
    [discipline: string]: {
      races: number;
      wins: number;
      podiums: number;
    };
  };
}

interface HistoricalData {
  competitorId: string;
  period: string;
  stats: HistoricalStats;
  lastUpdated: string;
}

class HistoricalDataService {
  private readonly competitorStatsBase: { [key: string]: any } = {
    'odermatt-marco': {
      totalRaces: 95,
      wins: 37,
      podiums: 65,
      averagePoints: 85.4,
      bestSeason: '2023/2024',
      disciplineBreakdown: {
        'Giant Slalom': { races: 40, wins: 18, podiums: 32 },
        'Super G': { races: 30, wins: 12, podiums: 22 },
        'Downhill': { races: 25, wins: 7, podiums: 11 }
      }
    },
    'kristoffersen-henrik': {
      totalRaces: 87,
      wins: 23,
      podiums: 58,
      averagePoints: 78.2,
      bestSeason: '2022/2023',
      disciplineBreakdown: {
        'Slalom': { races: 45, wins: 18, podiums: 35 },
        'Giant Slalom': { races: 42, wins: 5, podiums: 23 }
      }
    },
    'pinturault-alexis': {
      totalRaces: 102,
      wins: 15,
      podiums: 48,
      averagePoints: 72.1,
      bestSeason: '2021/2022',
      disciplineBreakdown: {
        'Giant Slalom': { races: 38, wins: 8, podiums: 22 },
        'Slalom': { races: 32, wins: 4, podiums: 15 },
        'Super G': { races: 32, wins: 3, podiums: 11 }
      }
    }
  };

  generateHistoricalData(competitorId: string, years: number): HistoricalData {
    const baseStats = this.competitorStatsBase[competitorId] || this.competitorStatsBase['odermatt-marco'];
    
    // Adjust stats based on selected years
    const multiplier = years / 5;
    
    return {
      competitorId,
      period: `${new Date().getFullYear() - years}-${new Date().getFullYear()}`,
      stats: {
        totalRaces: Math.round(baseStats.totalRaces * multiplier),
        wins: Math.round(baseStats.wins * multiplier),
        podiums: Math.round(baseStats.podiums * multiplier),
        averagePoints: baseStats.averagePoints,
        bestSeason: baseStats.bestSeason,
        disciplineBreakdown: Object.entries(baseStats.disciplineBreakdown).reduce((acc, [discipline, data]: [string, any]) => {
          acc[discipline] = {
            races: Math.round(data.races * multiplier),
            wins: Math.round(data.wins * multiplier),
            podiums: Math.round(data.podiums * multiplier)
          };
          return acc;
        }, {} as any)
      },
      lastUpdated: new Date().toISOString()
    };
  }

  async fetchHistoricalData(competitorId: string, years: number): Promise<HistoricalData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.generateHistoricalData(competitorId, years);
  }
}

export const historicalDataService = new HistoricalDataService();
export type { HistoricalData, HistoricalStats };