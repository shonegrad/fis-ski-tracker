import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Share2, 
  Download,
  SkipBack,
  SkipForward
} from 'lucide-react';

export interface VideoHighlight {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  category: 'highlights' | 'full-race' | 'start' | 'finish' | 'crashes' | 'interviews';
  raceId: string;
  competitorId?: string;
  timestamp: string;
  views: number;
  quality: Array<{ label: string; url: string; resolution: string }>;
}

interface VideoHighlightsProps {
  videos: VideoHighlight[];
  raceTitle: string;
  onVideoSelect?: (video: VideoHighlight) => void;
}

interface VideoPlayerProps {
  video: VideoHighlight;
  onClose: () => void;
}

function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(video.quality[0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const handleEnd = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-6xl mx-4">
        <video
          ref={videoRef}
          src={selectedQuality.url}
          className="w-full h-auto"
          poster={video.thumbnail}
          onClick={togglePlay}
        />
        
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={video.duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
              
              <span className="text-sm ml-4">
                {formatTime(currentTime)} / {formatTime(video.duration)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={selectedQuality.resolution}
                onChange={(e) => {
                  const quality = video.quality.find(q => q.resolution === e.target.value);
                  if (quality) setSelectedQuality(quality);
                }}
                className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
              >
                {video.quality.map(quality => (
                  <option key={quality.resolution} value={quality.resolution} className="text-black">
                    {quality.label}
                  </option>
                ))}
              </select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
        
        {/* Video Info Overlay */}
        <div className="absolute top-4 left-4 right-4 text-white">
          <h3>{video.title}</h3>
          <p className="text-white/80 text-sm">{video.description}</p>
        </div>
      </div>
    </div>
  );
}

export function VideoHighlights({ videos, raceTitle, onVideoSelect }: VideoHighlightsProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoHighlight | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Videos' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'full-race', label: 'Full Race' },
    { id: 'start', label: 'Start' },
    { id: 'finish', label: 'Finish' },
    { id: 'crashes', label: 'Crashes' },
    { id: 'interviews', label: 'Interviews' }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const playVideo = (video: VideoHighlight) => {
    setSelectedVideo(video);
    onVideoSelect?.(video);
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleShare = async (video: VideoHighlight) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Watch this highlight from ${raceTitle}`,
          url: video.url
        });
      } catch (error) {
        console.error('Failed to share video:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
            {category.id !== 'all' && (
              <Badge variant="secondary" className="ml-2">
                {videos.filter(v => v.category === category.id).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted cursor-pointer group" onClick={() => playVideo(video)}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Play
                </Button>
              </div>
              <Badge className="absolute top-2 right-2">{video.category}</Badge>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {formatDuration(video.duration)}
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-2">{video.title}</CardTitle>
              <CardDescription className="line-clamp-2">{video.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{new Date(video.timestamp).toLocaleDateString()}</span>
                <span>{video.views.toLocaleString()} views</span>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleShare(video)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos found in this category.</p>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}