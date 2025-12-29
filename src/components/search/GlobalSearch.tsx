import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, MapPin, Calendar, Trophy } from 'lucide-react';
import { fallbackDataService } from '../../services/fallbackDataService';
import { useAppContext } from '../../context/AppContext';

interface SearchResult {
    id: string;
    type: 'athlete' | 'location' | 'race';
    name: string;
    subtitle?: string;
    url: string;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { selectedSeason } = useAppContext();

    // Keyboard shortcut to open search (Cmd+K / Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search function
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const [athletes, locations, races] = await Promise.all([
                fallbackDataService.getCompetitors(selectedSeason),
                fallbackDataService.getLocations(selectedSeason),
                fallbackDataService.getRaces(selectedSeason),
            ]);

            const searchResults: SearchResult[] = [];
            const lowerQuery = searchQuery.toLowerCase();

            // Search athletes
            athletes
                .filter(a => a.name.toLowerCase().includes(lowerQuery) || a.country.toLowerCase().includes(lowerQuery))
                .slice(0, 5)
                .forEach(a => {
                    searchResults.push({
                        id: a.id,
                        type: 'athlete',
                        name: a.name,
                        subtitle: `${a.country} • Rank #${a.rank}`,
                        url: `/athletes/${a.id}`,
                    });
                });

            // Search locations
            locations
                .filter(l => l.name.toLowerCase().includes(lowerQuery) || l.country.toLowerCase().includes(lowerQuery))
                .slice(0, 3)
                .forEach(l => {
                    searchResults.push({
                        id: l.id,
                        type: 'location',
                        name: l.name,
                        subtitle: l.country,
                        url: '/locations',
                    });
                });

            // Search races
            races
                .filter(r => r.name.toLowerCase().includes(lowerQuery) || r.location.toLowerCase().includes(lowerQuery))
                .slice(0, 3)
                .forEach(r => {
                    searchResults.push({
                        id: r.id,
                        type: 'race',
                        name: r.name,
                        subtitle: `${r.location} • ${new Date(r.date).toLocaleDateString()}`,
                        url: '/races',
                    });
                });

            setResults(searchResults);
            setSelectedIndex(0);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedSeason]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(query);
        }, 200);
        return () => clearTimeout(timer);
    }, [query, performSearch]);

    const handleSelect = (result: SearchResult) => {
        navigate(result.url);
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'athlete': return <User className="w-4 h-4" />;
            case 'location': return <MapPin className="w-4 h-4" />;
            case 'race': return <Calendar className="w-4 h-4" />;
            default: return <Trophy className="w-4 h-4" />;
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs">
                    ⌘K
                </kbd>
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setIsOpen(false)}
            />

            {/* Search Modal */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 p-4">
                <div className="bg-background rounded-xl shadow-2xl border overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search athletes, locations, races..."
                            className="flex-1 bg-transparent outline-none text-lg"
                        />
                        <button onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-muted-foreground">
                                Searching...
                            </div>
                        ) : results.length > 0 ? (
                            <ul className="py-2">
                                {results.map((result, index) => (
                                    <li key={`${result.type}-${result.id}`}>
                                        <button
                                            onClick={() => handleSelect(result)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${index === selectedIndex ? 'bg-muted' : ''
                                                }`}
                                        >
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                {getIcon(result.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{result.name}</div>
                                                {result.subtitle && (
                                                    <div className="text-sm text-muted-foreground truncate">
                                                        {result.subtitle}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground uppercase">
                                                {result.type}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : query.trim() ? (
                            <div className="p-4 text-center text-muted-foreground">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">
                                Type to search athletes, locations, or races
                            </div>
                        )}
                    </div>

                    {/* Footer hint */}
                    <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
                        <span className="mr-4">↑↓ Navigate</span>
                        <span className="mr-4">↵ Select</span>
                        <span>Esc Close</span>
                    </div>
                </div>
            </div>
        </>
    );
}
