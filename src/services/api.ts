import { projectId, publicAnonKey } from '../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3fe23130`;

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    console.log(`Making request to: ${url}`);

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error for ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`API success for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // FIS API Integration
  async getFISRaces(season: '2024/2025' | '2025/2026') {
    // Split season to handle the forward slash in the URL path
    const [season1, season2] = season.split('/');
    return this.makeRequest(`/fis/races/${season1}/${season2}`);
  }

  async getFISResults(raceId: string) {
    return this.makeRequest(`/fis/results/${raceId}`);
  }

  async getWeatherData(locationId: string, date: string) {
    return this.makeRequest(`/weather/${locationId}/${date}`);
  }

  // Data Persistence
  async saveCompetitor(competitor: any) {
    return this.makeRequest('/competitors', {
      method: 'POST',
      body: JSON.stringify(competitor),
    });
  }

  async getCompetitors() {
    return this.makeRequest('/competitors');
  }

  async saveRaceResult(raceResult: any) {
    return this.makeRequest('/race-results', {
      method: 'POST',
      body: JSON.stringify(raceResult),
    });
  }

  async getRaceResults(raceId: string) {
    return this.makeRequest(`/race-results/${raceId}`);
  }

  async getHistoricalData(competitorId: string) {
    return this.makeRequest(`/historical/${competitorId}`);
  }
}

export const apiService = new ApiService();

// Weather condition helpers
export const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'overcast':
      return '☁️';
    case 'light snow':
      return '🌨️';
    case 'heavy snow':
      return '❄️';
    case 'fog':
      return '🌫️';
    default:
      return '🌤️';
  }
};

export const getWeatherColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'text-yellow-500';
    case 'overcast':
      return 'text-gray-500';
    case 'light snow':
    case 'heavy snow':
      return 'text-blue-500';
    case 'fog':
      return 'text-gray-400';
    default:
      return 'text-blue-400';
  }
};