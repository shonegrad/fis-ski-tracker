import { useState, useEffect } from 'react';
import { SidebarNavigation } from './components/SidebarNavigation';
import { Dashboard } from './components/Dashboard';
import { DisciplinePage } from './components/DisciplinePage';
import { EnhancedRaceResults } from './components/EnhancedRaceResults';
import { EnhancedCompetitorList } from './components/EnhancedCompetitorList';
import { LocationList } from './components/LocationList';
import { RaceCalendar } from './components/RaceCalendar';
import { StandingsPage } from './components/StandingsPage';
import { athletePhotoService } from './services/athletePhotoService';

export default function App() {
  const [selectedSeason, setSelectedSeason] = useState<'2024/2025' | '2025/2026'>('2024/2025');
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for user's preferred theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Preload all athlete photos to prevent loading delays
    athletePhotoService.preloadPhotos().catch(console.warn);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            selectedSeason={selectedSeason}
            onViewChange={setCurrentView}
          />
        );
      case 'races':
        return (
          <RaceCalendar
            selectedSeason={selectedSeason}
            onRaceSelect={(race) => console.log('Selected race:', race)}
          />
        );
      case 'locations':
        return <LocationList selectedSeason={selectedSeason} />;
      case 'athletes':
        return (
          <EnhancedCompetitorList
            selectedSeason={selectedSeason}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'standings':
        return (
          <StandingsPage
            selectedSeason={selectedSeason}
            onAthleteSelect={(athleteId) => console.log('Selected athlete:', athleteId)}
          />
        );
      case 'slalom':
      case 'giant-slalom':
      case 'super-g':
      case 'downhill':
        return (
          <DisciplinePage
            discipline={currentView}
            selectedSeason={selectedSeason}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return (
          <Dashboard
            selectedSeason={selectedSeason}
            onViewChange={setCurrentView}
          />
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background transition-colors duration-300 flex">
      {/* Winter Gradient Background */}
      <div className="fixed inset-0 winter-gradient dark:winter-gradient-dark opacity-5 pointer-events-none" />

      {/* Sidebar Navigation */}
      <SidebarNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />

      {/* Main Content */}
      <div className="flex-1 relative z-10 h-full overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
}