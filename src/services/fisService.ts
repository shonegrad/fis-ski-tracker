import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3fe23130`;

class FISService {
  private async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed for ${endpoint}: ${response.status} ${errorText}`);
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }

  async getCompetitions(season: string) {
    try {
      return await this.request(`/fis/competitions/${season}`);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      throw error;
    }
  }

  async getRaceResults(raceId: string) {
    try {
      return await this.request(`/fis/results/${raceId}`);
    } catch (error) {
      console.error('Error fetching race results:', error);
      throw error;
    }
  }

  async getCompetitor(competitorId: string) {
    try {
      return await this.request(`/fis/competitors/${competitorId}`);
    } catch (error) {
      console.error('Error fetching competitor:', error);
      throw error;
    }
  }

  async getWeatherData(locationId: string, date: string) {
    try {
      return await this.request(`/weather/${locationId}/${date}`);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getHistoricalData(competitorId: string, years: number = 5) {
    try {
      return await this.request(`/historical/${competitorId}/${years}`);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  async syncRaces(races: any[]) {
    try {
      return await this.request('/sync/races', {
        method: 'POST',
        body: JSON.stringify(races),
      });
    } catch (error) {
      console.error('Error syncing races:', error);
      throw error;
    }
  }

  async getStoredRaces() {
    try {
      return await this.request('/sync/races');
    } catch (error) {
      console.error('Error getting stored races:', error);
      throw error;
    }
  }

  async syncCompetitors(competitors: any[]) {
    try {
      return await this.request('/sync/competitors', {
        method: 'POST',
        body: JSON.stringify(competitors),
      });
    } catch (error) {
      console.error('Error syncing competitors:', error);
      throw error;
    }
  }

  async getStoredCompetitors() {
    try {
      return await this.request('/sync/competitors');
    } catch (error) {
      console.error('Error getting stored competitors:', error);
      throw error;
    }
  }
}

export const fisService = new FISService();
export default fisService;