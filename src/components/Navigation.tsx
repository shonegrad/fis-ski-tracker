import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LocationList } from "./LocationList";
import { RaceResults } from "./RaceResults";
import { CompetitorList } from "./CompetitorList";
import { SeasonSelector } from "./SeasonSelector";

interface NavigationProps {
  selectedSeason: '2024/2025' | '2025/2026';
  onSeasonChange: (season: '2024/2025' | '2025/2026') => void;
}

export function Navigation({ selectedSeason, onSeasonChange }: NavigationProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">FIS Alpine Ski World Cup</h1>
        <SeasonSelector selectedSeason={selectedSeason} onSeasonChange={onSeasonChange} />
      </div>
      
      <Tabs defaultValue="locations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="results">Race Results</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="locations" className="mt-6">
          <LocationList selectedSeason={selectedSeason} />
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <RaceResults selectedSeason={selectedSeason} />
        </TabsContent>
        
        <TabsContent value="competitors" className="mt-6">
          <CompetitorList />
        </TabsContent>
      </Tabs>
    </div>
  );
}