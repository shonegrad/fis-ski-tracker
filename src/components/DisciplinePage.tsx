import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Mountain, Zap, BarChart3, Clock, Users, Trophy, TrendingUp } from 'lucide-react';
import { fallbackDataService } from '../services/dataService';
import { AthleteImage } from './AthleteImage';

interface DisciplinePageProps {
  discipline: string;
  selectedSeason: '2024/2025' | '2025/2026';
  onBack: () => void;
}

interface DisciplineInfo {
  name: string;
  icon: any;
  description: string;
  characteristics: string[];
  equipment: string[];
  technique: string;
  history: string;
  famousRaces: string[];
}

const disciplineData: Record<string, DisciplineInfo> = {
  'slalom': {
    name: 'Slalom',
    icon: Target,
    description: 'The most technical alpine skiing discipline, requiring precise turns through closely spaced gates.',
    characteristics: [
      'Short, rapid turns',
      'Close gate spacing (4-6 meters)',
      'Two runs on same day',
      'Emphasis on technique and agility'
    ],
    equipment: [
      'Shorter skis (155-165cm typical)',
      'Flexible boots for quick edge changes',
      'Shin guards and arm guards',
      'Poles with large baskets'
    ],
    technique: 'Slalom demands exceptional edge control, quick reflexes, and the ability to maintain rhythm through rapid direction changes. Skiers must keep their upper body facing downhill while their legs work independently to navigate the gates.',
    history: 'Originating in Norway, slalom was one of the original alpine disciplines. The modern slalom course was standardized in the 1920s and has been part of the Winter Olympics since 1936.',
    famousRaces: ['Levi Black (Finland)', 'Wengen Slalom (Switzerland)', 'Kitzbühel Slalom (Austria)']
  },
  'giant-slalom': {
    name: 'Giant Slalom',
    icon: Mountain,
    description: 'A technical discipline with wider turns and higher speeds than slalom, testing both technical skill and racing speed.',
    characteristics: [
      'Wider gate spacing than slalom',
      'Longer course length',
      'Two runs, often on different days',
      'Balance of technique and speed'
    ],
    equipment: [
      'Longer skis than slalom (185-195cm)',
      'Stiffer boots for stability',
      'Protective gear for higher speeds',
      'Aerodynamic racing suit'
    ],
    technique: 'Giant slalom requires powerful, carved turns with emphasis on maintaining speed through the course. Skiers must balance aggression with precision, using longer radius turns to maintain momentum.',
    history: 'Developed in the 1930s as a compromise between slalom and downhill, giant slalom became an Olympic discipline in 1952. It tests the complete range of alpine skiing skills.',
    famousRaces: ['Sölden Opener (Austria)', 'Alta Badia Gran Risa (Italy)', 'Adelboden Chuenisbärgli (Switzerland)']
  },
  'super-g': {
    name: 'Super G',
    icon: Zap,
    description: 'Super Giant Slalom combines the speed of downhill with the technical demands of giant slalom racing.',
    characteristics: [
      'Single run competition',
      'No course inspection allowed',
      'High speeds with technical sections',
      'Wider gates than giant slalom'
    ],
    equipment: [
      'Downhill-length skis (210-220cm)',
      'Aerodynamic equipment',
      'Enhanced safety gear',
      'Speed-oriented bindings'
    ],
    technique: 'Super G demands exceptional course reading skills, as skiers see the course for the first time during their racing run. Success requires aggressive skiing combined with tactical intelligence.',
    history: 'Introduced in 1982, Super G was created to provide a middle ground between giant slalom and downhill. It became an Olympic discipline in 1988 and quickly gained popularity.',
    famousRaces: ['Val Gardena Super G (Italy)', 'Beaver Creek Birds of Prey (USA)', 'St. Moritz Super G (Switzerland)']
  },
  'downhill': {
    name: 'Downhill',
    icon: BarChart3,
    description: 'The ultimate test of speed and courage in alpine skiing, featuring the longest and fastest courses.',
    characteristics: [
      'Single run competition',
      'Speeds exceeding 140 km/h',
      'Course inspection required',
      'Longest racing courses'
    ],
    equipment: [
      'Longest skis (210-220cm minimum)',
      'Maximum aerodynamic gear',
      'Enhanced safety equipment',
      'Specialized downhill boots'
    ],
    technique: 'Downhill racing requires exceptional courage, precise line selection, and the ability to maintain control at extreme speeds. Skiers must balance aggression with safety over terrain features.',
    history: 'The oldest alpine racing discipline, downhill evolved from simple descents in the Alps. It has been part of the Winter Olympics since 1948 and remains the most prestigious speed event.',
    famousRaces: ['Kitzbühel Hahnenkamm (Austria)', 'Wengen Lauberhorn (Switzerland)', 'Val Gardena Saslong (Italy)']
  }
};

export function DisciplinePage({ discipline, selectedSeason, onBack }: DisciplinePageProps) {
  const [races, setRaces] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const disciplineInfo = disciplineData[discipline];
  const Icon = disciplineInfo?.icon || Target;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [raceData, athleteData] = await Promise.all([
          fallbackDataService.getRaces(selectedSeason),
          fallbackDataService.getCompetitors(selectedSeason)
        ]);

        // Filter races by discipline
        const disciplineName = disciplineInfo?.name || '';
        const filteredRaces = raceData.filter(race => 
          race.discipline.toLowerCase().includes(discipline.replace('-', ' ')) ||
          race.discipline.toLowerCase() === disciplineName.toLowerCase()
        );

        // Filter athletes who compete in this discipline
        const filteredAthletes = athleteData.filter(athlete =>
          athlete.disciplines.some((d: string) => 
            d.toLowerCase().includes(discipline.replace('-', ' ')) ||
            d.toLowerCase() === disciplineName.toLowerCase()
          )
        ).slice(0, 12); // Top 12 athletes

        setRaces(filteredRaces);
        setAthletes(filteredAthletes);
      } catch (error) {
        console.error('Error loading discipline data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (disciplineInfo) {
      loadData();
    }
  }, [discipline, selectedSeason, disciplineInfo]);

  if (!disciplineInfo) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Discipline not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 to-primary-container/20 border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">{disciplineInfo.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{disciplineInfo.description}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Races</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{races.length}</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Athletes</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{athletes.length}+</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Season</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{selectedSeason}</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Level</span>
              </div>
              <p className="text-2xl font-bold text-foreground">Elite</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About {disciplineInfo.name}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">{disciplineInfo.technique}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Key Characteristics</h3>
                  <ul className="space-y-2">
                    {disciplineInfo.characteristics.map((char, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Equipment</h3>
                  <ul className="space-y-2">
                    {disciplineInfo.equipment.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Races Section */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-4">{disciplineInfo.name} Races</h2>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : races.length > 0 ? (
                <div className="space-y-3">
                  {races.map((race) => (
                    <div key={race.id} className="p-4 bg-surface-container rounded-lg border border-border hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{race.name}</h3>
                          <p className="text-sm text-muted-foreground">{race.location}, {race.country}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{new Date(race.date).toLocaleDateString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            race.status === 'completed' ? 'bg-success-container text-success-foreground' :
                            race.status === 'live' ? 'bg-warning-container text-warning-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {race.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No {disciplineInfo.name.toLowerCase()} races found for {selectedSeason}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Athletes */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">Top {disciplineInfo.name} Athletes</h3>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted/50 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 bg-muted/30 rounded w-20 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {athletes.map((athlete, index) => (
                    <div key={athlete.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors">
                      <div className="relative">
                        <AthleteImage
                          athleteId={athlete.id}
                          athleteName={athlete.name}
                          className="w-10 h-10 rounded-lg"
                          width={40}
                          height={40}
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{athlete.name}</p>
                        <p className="text-sm text-muted-foreground">{athlete.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{athlete.worldCupPoints}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* History */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">History</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{disciplineInfo.history}</p>
              
              <h4 className="font-semibold mb-2">Famous Races</h4>
              <ul className="space-y-1">
                {disciplineInfo.famousRaces.map((race, index) => (
                  <li key={index} className="text-sm text-muted-foreground">• {race}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}