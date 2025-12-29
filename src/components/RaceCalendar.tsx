import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Trophy, Clock, Target, Mountain, Zap, BarChart3 } from 'lucide-react';
import { fallbackDataService } from '../services/fallbackDataService';

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

interface RaceCalendarProps {
  selectedSeason: '2024/2025' | '2025/2026';
  onRaceSelect?: (race: Race) => void;
}

export function RaceCalendar({ selectedSeason, onRaceSelect }: RaceCalendarProps) {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  useEffect(() => {
    loadRaces();
  }, [selectedSeason]);

  const loadRaces = async () => {
    try {
      setLoading(true);
      const data = await fallbackDataService.getRaces(selectedSeason);
      setRaces(data);
    } catch (error) {
      console.error('Failed to load races:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisciplineInfo = (discipline: string) => {
    switch (discipline.toLowerCase()) {
      case 'downhill':
        return { icon: BarChart3, color: 'bg-error-container text-on-error-container' };
      case 'super g':
        return { icon: Zap, color: 'bg-warning-container text-on-warning-container' };
      case 'giant slalom':
        return { icon: Mountain, color: 'bg-primary-container text-on-primary-container' };
      case 'slalom':
        return { icon: Target, color: 'bg-secondary-container text-on-secondary-container' };
      default:
        return { icon: Trophy, color: 'bg-surface-container text-on-surface' };
    }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getRacesForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return races.filter(race => new Date(race.date).toDateString() === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const nextRace = races
    .filter(race => new Date(race.date) > new Date() && race.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const upcomingRaces = races
    .filter(race => new Date(race.date) > new Date() && race.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(42)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Race Calendar
          </h1>
          <p className="text-muted-foreground mt-1">{selectedSeason} FIS Alpine World Cup Schedule</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1">
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="px-3 py-1.5 h-auto text-xs"
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3 py-1.5 h-auto text-xs"
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Next Race Highlight */}
      {nextRace && (
        <Card className="rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">Next Race</h3>
                <p className="text-lg font-medium text-primary">{nextRace.name}</p>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{nextRace.location}, {nextRace.country}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(nextRace.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {nextRace.discipline}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {Math.ceil((new Date(nextRace.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-muted-foreground">days away</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'month' ? (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                      className="w-9 h-9 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 h-9 text-xs"
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                      className="w-9 h-9 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((date, index) => {
                    const dayRaces = getRacesForDate(date);
                    const isCurrentMonthDay = isCurrentMonth(date);
                    const isTodayDate = isToday(date);
                    
                    return (
                      <div
                        key={index}
                        className={`
                          aspect-square p-2 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-surface-container
                          ${isCurrentMonthDay ? 'border-border' : 'border-transparent'}
                          ${isTodayDate ? 'bg-primary/10 border-primary ring-2 ring-primary/20' : ''}
                          ${dayRaces.length > 0 ? 'bg-secondary/5 border-secondary/20' : ''}
                        `}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className={`text-sm font-medium ${
                          isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground'
                        } ${isTodayDate ? 'text-primary font-bold' : ''}`}>
                          {date.getDate()}
                        </div>
                        
                        {dayRaces.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {dayRaces.slice(0, 2).map(race => {
                              const { icon: DisciplineIcon, color } = getDisciplineInfo(race.discipline);
                              return (
                                <div
                                  key={race.id}
                                  className={`
                                    text-xs p-1 rounded ${color} truncate flex items-center gap-1
                                  `}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRaceSelect?.(race);
                                  }}
                                >
                                  <DisciplineIcon className="w-2.5 h-2.5 flex-shrink-0" />
                                  <span className="truncate">{race.name.split(' ')[0]}</span>
                                </div>
                              );
                            })}
                            {dayRaces.length > 2 && (
                              <div className="text-xs text-muted-foreground px-1">
                                +{dayRaces.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Races */}
            <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Today's Races</CardTitle>
              </CardHeader>
              <CardContent>
                {getRacesForDate(new Date()).length > 0 ? (
                  <div className="space-y-3">
                    {getRacesForDate(new Date()).map(race => {
                      const { icon: DisciplineIcon, color } = getDisciplineInfo(race.discipline);
                      return (
                        <div
                          key={race.id}
                          className="p-3 rounded-xl bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors"
                          onClick={() => onRaceSelect?.(race)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                              <DisciplineIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{race.name}</h4>
                              <p className="text-sm text-muted-foreground truncate">{race.location}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No races today</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Races */}
            <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Upcoming Races</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingRaces.map(race => {
                    const { icon: DisciplineIcon, color } = getDisciplineInfo(race.discipline);
                    const daysUntil = Math.ceil((new Date(race.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div
                        key={race.id}
                        className="p-3 rounded-xl bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors"
                        onClick={() => onRaceSelect?.(race)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                            <DisciplineIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{race.name}</h4>
                            <p className="text-sm text-muted-foreground truncate">{race.location}</p>
                            <p className="text-xs text-primary font-medium">
                              {daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {races
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(race => {
              const { icon: DisciplineIcon, color } = getDisciplineInfo(race.discipline);
              const raceDate = new Date(race.date);
              const isPast = raceDate < new Date();
              
              return (
                <Card
                  key={race.id}
                  className={`
                    rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg
                    ${isPast ? 'opacity-75' : ''}
                    ${isToday(raceDate) ? 'ring-2 ring-primary bg-primary/5' : ''}
                  `}
                  onClick={() => onRaceSelect?.(race)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center`}>
                        <DisciplineIcon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{race.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{race.location}, {race.country}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{raceDate.toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={race.status === 'completed' ? 'secondary' : race.status === 'live' ? 'destructive' : 'default'}
                          className="mb-2"
                        >
                          {race.status}
                        </Badge>
                        <Badge variant="outline" className="block">
                          {race.discipline}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}