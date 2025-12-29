import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PhotoGallery, Photo } from './PhotoGallery';
import { VideoHighlights, VideoHighlight } from './VideoHighlights';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Camera, Video, Calendar, Eye } from 'lucide-react';

interface MediaGalleryProps {
  raceId: string;
  raceTitle: string;
  photos: Photo[];
  videos: VideoHighlight[];
  onMediaSelect?: (media: Photo | VideoHighlight, type: 'photo' | 'video') => void;
}

export function MediaGallery({ raceId, raceTitle, photos, videos, onMediaSelect }: MediaGalleryProps) {
  const [selectedTab, setSelectedTab] = useState('photos');

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalDownloads = photos.reduce((sum, photo) => sum + photo.downloads, 0);

  const recentMedia = [
    ...photos.map(p => ({ ...p, type: 'photo' as const, timestamp: p.timestamp })),
    ...videos.map(v => ({ ...v, type: 'video' as const, timestamp: v.timestamp }))
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Media Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{photos.length}</p>
                <p className="text-sm text-muted-foreground">Photos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{videos.length}</p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Video Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Media Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentMedia.map((media, index) => (
              <div
                key={`${media.type}-${media.id}`}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted group"
                onClick={() => onMediaSelect?.(media, media.type)}
              >
                <img
                  src={media.type === 'photo' ? (media as Photo).thumbnail : (media as VideoHighlight).thumbnail}
                  alt={media.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <Badge
                  variant={media.type === 'photo' ? 'default' : 'secondary'}
                  className="absolute top-2 left-2"
                >
                  {media.type === 'photo' ? <Camera className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                </Badge>
                {media.type === 'video' && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                    {Math.floor((media as VideoHighlight).duration / 60)}:{String(Math.floor((media as VideoHighlight).duration % 60)).padStart(2, '0')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Media Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos ({videos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-6">
          <PhotoGallery
            photos={photos}
            raceTitle={raceTitle}
            onPhotoSelect={(photo) => onMediaSelect?.(photo, 'photo')}
          />
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <VideoHighlights
            videos={videos}
            raceTitle={raceTitle}
            onVideoSelect={(video) => onMediaSelect?.(video, 'video')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}