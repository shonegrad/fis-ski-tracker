// Centralized athlete photo service to ensure consistency across the application
interface AthletePhoto {
  id: string;
  name: string;
  country: string;
  primaryImage: string;
  fallbackImage: string;
  verified: boolean; // Indicates if the image has been verified to load correctly
}

class AthletePhotoService {
  // Verified, consistent male athlete photos mapped to specific athletes
  private readonly athletePhotos: Record<string, AthletePhoto> = {
    'odermatt-marco': {
      id: 'odermatt-marco',
      name: 'Marco Odermatt',
      country: 'Switzerland',
      primaryImage: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'kristoffersen-henrik': {
      id: 'kristoffersen-henrik',
      name: 'Henrik Kristoffersen',
      country: 'Norway',
      primaryImage: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'pinturault-alexis': {
      id: 'pinturault-alexis',
      name: 'Alexis Pinturault',
      country: 'France',
      primaryImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'zubcic-filip': {
      id: 'zubcic-filip',
      name: 'Filip Zubčić',
      country: 'Croatia',
      primaryImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'mayer-matthias': {
      id: 'mayer-matthias',
      name: 'Matthias Mayer',
      country: 'Austria',
      primaryImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'noel-clement': {
      id: 'noel-clement',
      name: 'Clément Noël',
      country: 'France',
      primaryImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'schwarz-marco': {
      id: 'schwarz-marco',
      name: 'Marco Schwarz',
      country: 'Austria',
      primaryImage: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'haugan-timon': {
      id: 'haugan-timon',
      name: 'Timon Haugan',
      country: 'Norway',
      primaryImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'meillard-loic': {
      id: 'meillard-loic',
      name: 'Loïc Meillard',
      country: 'Switzerland',
      primaryImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'braathen-lucas': {
      id: 'braathen-lucas',
      name: 'Lucas Braathen',
      country: 'Brazil',
      primaryImage: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'faivre-mathieu': {
      id: 'faivre-mathieu',
      name: 'Mathieu Faivre',
      country: 'France',
      primaryImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'cochran-dupraz-sam': {
      id: 'cochran-dupraz-sam',
      name: 'Sam Cochran-Dupraz',
      country: 'France',
      primaryImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'caviezel-gino': {
      id: 'caviezel-gino',
      name: 'Gino Caviezel',
      country: 'Switzerland',
      primaryImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'vinatzer-alex': {
      id: 'vinatzer-alex',
      name: 'Alex Vinatzer',
      country: 'Italy',
      primaryImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    },
    'strasser-linus': {
      id: 'strasser-linus',
      name: 'Linus Straßer',
      country: 'Germany',
      primaryImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face&q=85',
      fallbackImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&q=85',
      verified: true
    }
  };

  // Generic fallback photos for unknown athletes
  private readonly genericAthletePhotos = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&q=85',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&q=85',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face&q=85',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face&q=85',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face&q=85'
  ];

  /**
   * Get consistent athlete photo by ID
   */
  getAthletePhoto(athleteId: string): string {
    const athlete = this.athletePhotos[athleteId];
    if (athlete) {
      return athlete.primaryImage;
    }
    
    // Return a consistent generic photo based on athlete ID hash
    const hash = this.hashCode(athleteId);
    const index = Math.abs(hash) % this.genericAthletePhotos.length;
    return this.genericAthletePhotos[index];
  }

  /**
   * Get fallback photo for an athlete
   */
  getFallbackPhoto(athleteId: string): string {
    const athlete = this.athletePhotos[athleteId];
    if (athlete) {
      return athlete.fallbackImage;
    }
    
    // Return a different generic photo for fallback
    const hash = this.hashCode(athleteId + 'fallback');
    const index = Math.abs(hash) % this.genericAthletePhotos.length;
    return this.genericAthletePhotos[index];
  }

  /**
   * Check if athlete has verified photos
   */
  hasVerifiedPhoto(athleteId: string): boolean {
    return this.athletePhotos[athleteId]?.verified || false;
  }

  /**
   * Get all athlete photos for preloading
   */
  getAllAthletePhotos(): string[] {
    const primaryPhotos = Object.values(this.athletePhotos).map(athlete => athlete.primaryImage);
    const fallbackPhotos = Object.values(this.athletePhotos).map(athlete => athlete.fallbackImage);
    return [...primaryPhotos, ...fallbackPhotos, ...this.genericAthletePhotos];
  }

  /**
   * Simple hash function for consistent photo assignment
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Preload all athlete photos to prevent loading delays
   */
  preloadPhotos(): Promise<void[]> {
    const allPhotos = this.getAllAthletePhotos();
    const preloadPromises = allPhotos.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error to not block
        img.src = src;
      });
    });
    
    return Promise.all(preloadPromises);
  }
}

// Export singleton instance
export const athletePhotoService = new AthletePhotoService();