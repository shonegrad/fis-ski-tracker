import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LocationList } from "./LocationList";
import { EnhancedRaceResults } from "./EnhancedRaceResults";
import { EnhancedCompetitorList } from "./EnhancedCompetitorList";
import { SeasonSelector } from "./SeasonSelector";
import { Dashboard } from "./Dashboard";
import { Mountain, Activity, Users, MapPin } from "lucide-react";

interface EnhancedNavigationProps {
  selectedSeason: '2024/2025' | '2025/2026';
  onSeasonChange: (season: '2024/2025' | '2025/2026') => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

export function EnhancedNavigation({ 
  selectedSeason, 
  onSeasonChange, 
  isDarkMode, 
  onThemeToggle 
}: EnhancedNavigationProps) {
  return (
    <div className="w-full">
      {/* Material 3 Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mountain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="headline-large text-on-surface">FIS Alpine Ski World Cup</h1>
              <p className="body-medium text-on-surface-variant">Real-time race tracking and competitor analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SeasonSelector selectedSeason={selectedSeason} onSeasonChange={onSeasonChange} />
          </div>
        </div>
        
        {/* Material 3 Divider */}
        <div className="h-px bg-outline-variant opacity-50" />
      </div>
      
      {/* Material 3 Navigation Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-surface-container rounded-xl p-1 mb-6">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
          >
            <Mountain className="w-4 h-4" />
            <span className="hidden sm:inline">Live Results</span>
          </TabsTrigger>
          <TabsTrigger 
            value="competitors" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Athletes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="locations" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Venues</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <div className="rounded-2xl bg-surface-container-lowest p-1">
            <Dashboard selectedSeason={selectedSeason} />
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-0">
          <div className="rounded-2xl bg-surface-container-lowest p-1">
            <Dashboard selectedSeason={selectedSeason} />
          </div>
        </TabsContent>
        
        <TabsContent value="competitors" className="mt-0">
          <div className="rounded-2xl bg-surface-container-lowest p-1">
            <EnhancedCompetitorList selectedSeason={selectedSeason} />
          </div>
        </TabsContent>
        
        <TabsContent value="locations" className="mt-0">
          <div className="rounded-2xl bg-surface-container-lowest p-1">
            <LocationList selectedSeason={selectedSeason} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}