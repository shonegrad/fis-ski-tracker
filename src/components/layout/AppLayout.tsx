import { Outlet } from 'react-router-dom';
import { SidebarNavigation } from '../SidebarNavigation';
import { GlobalSearch } from '../search/GlobalSearch';
import { useAppContext } from '../../context/AppContext';

export function AppLayout() {
    const { isDarkMode, toggleTheme, selectedSeason, setSelectedSeason } = useAppContext();

    return (
        <div className="min-h-screen bg-background transition-colors duration-300 flex">
            {/* Winter Gradient Background */}
            <div className="fixed inset-0 winter-gradient dark:winter-gradient-dark opacity-5 pointer-events-none" />

            {/* Sidebar Navigation */}
            <SidebarNavigation
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
                isDarkMode={isDarkMode}
                onThemeToggle={toggleTheme}
            />

            {/* Main Content */}
            <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
                {/* Top Header with Search */}
                <header className="flex items-center justify-between px-6 py-3 border-b bg-background/80 backdrop-blur-sm">
                    <div className="flex-1" />
                    <GlobalSearch />
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
