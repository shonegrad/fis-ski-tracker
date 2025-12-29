import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { athletePhotoService } from '../services/athletePhotoService';

type Season = '2024/2025' | '2025/2026';

interface AppContextType {
    selectedSeason: Season;
    setSelectedSeason: (season: Season) => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [selectedSeason, setSelectedSeason] = useState<Season>('2024/2025');
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

    return (
        <AppContext.Provider value={{ selectedSeason, setSelectedSeason, isDarkMode, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
