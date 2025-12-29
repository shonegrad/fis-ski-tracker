import { useState } from 'react';
import { athletePhotoService } from '../services/athletePhotoService';

interface AthleteImageProps {
  athleteId: string;
  athleteName: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function AthleteImage({ 
  athleteId, 
  athleteName, 
  className = '',
  alt,
  width,
  height 
}: AthleteImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const primaryImage = athletePhotoService.getAthletePhoto(athleteId);
  const fallbackImage = athletePhotoService.getFallbackPhoto(athleteId);
  
  const currentSrc = hasError ? fallbackImage : primaryImage;
  const altText = alt || athleteName || 'Alpine skier';

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-surface-container animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={altText}
        width={width}
        height={height}
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
}