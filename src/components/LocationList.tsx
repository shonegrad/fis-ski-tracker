import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ArrowLeft, MapPin, Mountain, Calendar, Globe, Snowflake } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { CourseDetails } from './CourseDetails';
import { fallbackDataService } from '../services/dataService';

interface Location {
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

interface Race {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  status: 'scheduled' | 'live' | 'completed';
  discipline: string;
  locationId: string;
}

interface LocationListProps {
  selectedSeason: '2024/2025' | '2025/2026';
  locations?: Location[];
  races?: Race[];
  onLocationSelect?: (locationId: string) => void;
}

export function LocationList({ selectedSeason, locations, races, onLocationSelect }: LocationListProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [allRaces, setAllRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [locationsData, racesData] = await Promise.all([
          locations ? Promise.resolve(locations) : fallbackDataService.getLocations(selectedSeason),
          races ? Promise.resolve(races) : fallbackDataService.getRaces(selectedSeason)
        ]);
        setAllLocations(locationsData);
        setAllRaces(racesData);
      } catch (error) {
        console.error('Error loading locations data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedSeason, locations, races]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (selectedLocation) {
    const locationRaces = allRaces.filter(race => race.locationId === selectedLocation.id);
    
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => setSelectedLocation(null)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Locations
        </Button>
        
        <Card className="overflow-hidden">
          {/* Venue Image */}
          <div className="relative h-64 w-full">
            <img 
              src={selectedLocation.image} 
              alt={selectedLocation.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="headline-large font-bold">{selectedLocation.name}</h1>
              <p className="body-medium opacity-90">{selectedLocation.country}</p>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-xl bg-surface-container-low">
                  <CardContent className="p-4 text-center">
                    <Mountain className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="body-small text-on-surface-variant">Elevation</p>
                    <p className="body-large font-medium">{selectedLocation.elevation}m</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl bg-surface-container-low">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-secondary" />
                    <p className="body-small text-on-surface-variant">Races</p>
                    <p className="body-large font-medium">{locationRaces.length}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl bg-surface-container-low">
                  <CardContent className="p-4 text-center">
                    <Globe className="h-6 w-6 mx-auto mb-2 text-tertiary" />
                    <p className="body-small text-on-surface-variant">Location</p>
                    <p className="body-large font-medium">{selectedLocation.coordinates.lat.toFixed(2)}°</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl bg-surface-container-low">
                  <CardContent className="p-4 text-center">
                    <Snowflake className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="body-small text-on-surface-variant">Season</p>
                    <p className="body-large font-medium">{selectedSeason}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="headline-small mb-3">About {selectedLocation.name}</h3>
                <p className="body-large text-on-surface-variant leading-relaxed">{selectedLocation.description}</p>
              </div>

              {/* History */}
              {selectedLocation.seasonHistory && (
                <div>
                  <h4 className="body-large font-medium mb-2">World Cup History</h4>
                  <p className="body-medium text-on-surface-variant">{selectedLocation.seasonHistory}</p>
                </div>
              )}

              {/* Famous Slopes */}
              {selectedLocation.famousSlopes && selectedLocation.famousSlopes.length > 0 && (
                <div>
                  <h4 className="body-large font-medium mb-3">Famous Slopes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.famousSlopes.map((slope, index) => (
                      <Badge key={index} variant="outline" className="body-small">
                        {slope}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Weather for upcoming races */}
              {locationRaces.some(race => race.status === 'scheduled') && (
                <div className="my-6">
                  <WeatherWidget 
                    locationId={selectedLocation.id} 
                    date={locationRaces.find(race => race.status === 'scheduled')?.date || new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
              
              <div>
                <h3 className="headline-small mb-4">Races in {selectedSeason}</h3>
                {locationRaces.length > 0 ? (
                  <div className="grid gap-4">
                    {locationRaces.map((race) => (
                      <Card key={race.id} className="rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer"
                            onClick={() => onLocationSelect?.(selectedLocation.id)}>
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-primary" />
                              <span className="body-large font-medium">{new Date(race.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                              <Badge variant="secondary" className="rounded-lg">
                                {race.discipline}
                              </Badge>
                            </div>
                            <Badge variant={race.status === 'completed' ? 'default' : race.status === 'scheduled' ? 'outline' : 'destructive'}
                                   className="rounded-lg">
                              {race.status.charAt(0).toUpperCase() + race.status.slice(1)}
                            </Badge>
                          </div>
                          <h4 className="body-large font-medium text-on-surface mb-2">{race.name}</h4>
                          <CourseDetails 
                            locationId={selectedLocation.id}
                            locationName={selectedLocation.name}
                            discipline={race.discipline}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="rounded-xl bg-surface-container-low">
                    <CardContent className="p-8 text-center">
                      <Mountain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="body-large text-on-surface-variant">No races scheduled for this season at this location.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get locations that have races in the selected season
  const activeLocations = allLocations.filter(location => 
    allRaces.some(race => race.locationId === location.id)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="headline-large text-on-surface mb-2">World Cup Venues - {selectedSeason}</h2>
        <p className="body-medium text-on-surface-variant">Discover the legendary alpine skiing venues hosting the world's best athletes</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeLocations.map((location) => {
          const locationRaces = allRaces.filter(race => race.locationId === location.id);
          
          return (
            <Card key={location.id} className="cursor-pointer hover:elevation-2 transition-all duration-200 overflow-hidden rounded-2xl bg-surface-container-low border-0">
              {/* Venue Image */}
              <div className="relative h-48 w-full">
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-black border-0 rounded-lg">
                    {locationRaces.length} race{locationRaces.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="headline-small font-bold">{location.name}</h3>
                  <p className="body-small opacity-90">{location.country}</p>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mountain className="h-4 w-4 text-primary" />
                      <span className="body-small text-on-surface-variant">{location.elevation}m elevation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-secondary" />
                      <span className="body-small text-on-surface-variant">{location.coordinates.lat.toFixed(1)}°N</span>
                    </div>
                  </div>
                  
                  <p className="body-medium text-on-surface-variant line-clamp-3 leading-relaxed">
                    {location.description}
                  </p>
                  
                  {/* Famous Slopes Preview */}
                  {location.famousSlopes && location.famousSlopes.length > 0 && (
                    <div>
                      <p className="body-small text-on-surface-variant mb-2">Famous slopes:</p>
                      <div className="flex flex-wrap gap-1">
                        {location.famousSlopes.slice(0, 2).map((slope, index) => (
                          <Badge key={index} variant="outline" className="body-small px-2 py-1 rounded-lg">
                            {slope}
                          </Badge>
                        ))}
                        {location.famousSlopes.length > 2 && (
                          <Badge variant="outline" className="body-small px-2 py-1 rounded-lg">
                            +{location.famousSlopes.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {activeLocations.length === 0 && (
        <div className="col-span-full">
          <Card className="rounded-2xl bg-surface-container-low border-0">
            <CardContent className="p-12 text-center">
              <Mountain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="headline-small mb-2">No Venues Available</h3>
              <p className="body-medium text-on-surface-variant">
                No venues are scheduled for the {selectedSeason} season.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}