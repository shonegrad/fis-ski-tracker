import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Zap,
  Mountain,
  Target,
  BarChart3,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarNavigationProps {
  selectedSeason: '2024/2025' | '2025/2026';
  onSeasonChange: (season: '2024/2025' | '2025/2026') => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function SidebarNavigation({
  selectedSeason,
  onSeasonChange,
  isDarkMode,
  onThemeToggle
}: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { id: '/', label: 'Dashboard', icon: Home },
    { id: '/races', label: 'Races', icon: Calendar },
    { id: '/locations', label: 'Locations', icon: MapPin },
    { id: '/athletes', label: 'Athletes', icon: Users },
    { id: '/standings', label: 'Standings', icon: Trophy },
  ];

  const disciplineItems = [
    { id: '/discipline/slalom', label: 'Slalom', icon: Target },
    { id: '/discipline/giant-slalom', label: 'Giant Slalom', icon: Mountain },
    { id: '/discipline/super-g', label: 'Super G', icon: Zap },
    { id: '/discipline/downhill', label: 'Downhill', icon: BarChart3 },
  ];

  const utilityItems = [
    { id: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }: { item: { id: string; label: string; icon: any } }) => (
    <button
      onClick={() => navigate(item.id)}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
        ${isActive(item.id)
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'hover:bg-surface-container text-on-surface hover:text-on-surface'
        }
        ${isCollapsed ? 'justify-center px-2' : ''}
      `}
    >
      <item.icon className={`
        transition-transform duration-200 
        ${isActive(item.id) ? 'scale-110' : 'group-hover:scale-105'} 
        ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 flex-shrink-0'}
      `} />
      {!isCollapsed && (
        <span className="truncate font-medium">{item.label}</span>
      )}
    </button>
  );

  return (
    <div className={`
      relative h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">FIS Alpine</h1>
              <p className="text-sm text-sidebar-foreground/70">World Cup Tracker</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Season Selector */}
      {!isCollapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <label className="text-sm font-medium text-sidebar-foreground/70 block mb-2">
            Season
          </label>
          <select
            value={selectedSeason}
            onChange={(e) => onSeasonChange(e.target.value as '2024/2025' | '2025/2026')}
            className="w-full px-3 py-2 rounded-lg bg-sidebar-accent border border-sidebar-border text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring transition-all duration-200"
          >
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
          </select>
        </div>
      )}

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3">
              Main
            </h3>
          )}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Disciplines */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3">
              Disciplines
            </h3>
          )}
          <div className="space-y-1">
            {disciplineItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {/* Utility Navigation */}
        <div className="space-y-1">
          {utilityItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
            hover:bg-sidebar-accent text-sidebar-foreground
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
          ) : (
            <Moon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
          )}
          {!isCollapsed && (
            <span className="truncate font-medium">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}