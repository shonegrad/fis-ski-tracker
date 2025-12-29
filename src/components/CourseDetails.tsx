import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Mountain, Ruler, TrendingDown, Timer, Map, Thermometer, Cloud, Users, Target } from 'lucide-react';
import { fallbackDataService } from '../services/dataService';

interface CourseDetailsProps {
  raceId: string;
}

interface CourseData {
  name: string;
  length: number;
  verticalDrop: number;
  gates: number;
  surfaceCondition: string;
  temperature: number;
  startTime: string;
  weather: string;
  difficulty: string;
  startElevation?: number;
  finishElevation?: number;
  averageGradient?: number;
  maxGradient?: number;
  courseSetter?: string;
  forerunners?: string[];
}

export function CourseDetails({ raceId }: CourseDetailsProps) {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fallbackDataService.getCourseDetails(raceId);
        setCourseData(data);
      } catch (err) {
        setError('Failed to load course details');
        console.error('Course details fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [raceId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Course Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !courseData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Course Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error || 'Course details not available'}</p>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'extreme': return 'destructive';
      case 'expert': return 'secondary';
      case 'advanced': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Course Details - {courseData.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Course Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{courseData.length}m</div>
              <div className="text-sm text-muted-foreground">Length</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{courseData.verticalDrop}m</div>
              <div className="text-sm text-muted-foreground">Vertical Drop</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{courseData.gates}</div>
              <div className="text-sm text-muted-foreground">Gates</div>
            </div>
            <div className="text-center">
              <Badge variant={getDifficultyColor(courseData.difficulty)} className="text-xs">
                {courseData.difficulty}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Difficulty</div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <Mountain className="h-4 w-4" />
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseData.startElevation && courseData.finishElevation && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mountain className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Elevation</div>
                    <div className="text-sm text-muted-foreground">
                      Start: {courseData.startElevation}m • Finish: {courseData.finishElevation}m
                    </div>
                  </div>
                </div>
              )}
              
              {courseData.averageGradient && (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Gradient</div>
                    <div className="text-sm text-muted-foreground">
                      Avg: {courseData.averageGradient}% • Max: {courseData.maxGradient}%
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Ruler className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Surface</div>
                  <div className="text-sm text-muted-foreground">
                    {courseData.surfaceCondition}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Timer className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Start Time</div>
                  <div className="text-sm text-muted-foreground">
                    {courseData.startTime}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Conditions */}
          <div>
            <h3 className="flex items-center gap-2 mb-4">
              <Cloud className="h-4 w-4" />
              Current Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Thermometer className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">{courseData.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Cloud className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">{courseData.weather}</div>
                  <div className="text-sm text-muted-foreground">Weather</div>
                </div>
              </div>
            </div>
          </div>

          {/* Race Officials */}
          {(courseData.courseSetter || courseData.forerunners) && (
            <div>
              <h3 className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4" />
                Race Officials
              </h3>
              <div className="space-y-3">
                {courseData.courseSetter && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Target className="h-5 w-5 text-indigo-500" />
                    <div>
                      <div className="font-medium">Course Setter</div>
                      <div className="text-sm text-muted-foreground">
                        {courseData.courseSetter}
                      </div>
                    </div>
                  </div>
                )}
                
                {courseData.forerunners && courseData.forerunners.length > 0 && (
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Users className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Forerunners</div>
                      <div className="text-sm text-muted-foreground">
                        {courseData.forerunners.join(' • ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}