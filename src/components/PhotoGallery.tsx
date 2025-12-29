import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, Download, Share2, Heart, X } from 'lucide-react';

export interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  photographer: string;
  timestamp: string;
  category: 'action' | 'podium' | 'start' | 'finish' | 'crowd' | 'behind-scenes';
  raceId: string;
  competitorId?: string;
  likes: number;
  downloads: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
  raceTitle: string;
  onPhotoSelect?: (photo: Photo) => void;
}

export function PhotoGallery({ photos, raceTitle, onPhotoSelect }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'action', label: 'Action' },
    { id: 'podium', label: 'Podium' },
    { id: 'start', label: 'Start' },
    { id: 'finish', label: 'Finish' },
    { id: 'crowd', label: 'Crowd' },
    { id: 'behind-scenes', label: 'Behind the Scenes' }
  ];

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    onPhotoSelect?.(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (currentIndex + 1) % filteredPhotos.length;
    
    setCurrentIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photo.title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download photo:', error);
    }
  };

  const handleShare = async (photo: Photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: `Check out this photo from ${raceTitle}`,
          url: photo.url
        });
      } catch (error) {
        console.error('Failed to share photo:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(photo.url);
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
                {photos.filter(p => p.category === category.id).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted"
            onClick={() => openLightbox(photo, index)}
          >
            <ImageWithFallback
              src={photo.thumbnail}
              alt={photo.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm truncate">{photo.title}</p>
              <p className="text-white/70 text-xs">{photo.photographer}</p>
            </div>
            <Badge className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {photo.category}
            </Badge>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No photos found in this category.</p>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full p-0">
          {selectedPhoto && (
            <>
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="flex items-center justify-between">
                  <div>
                    <h3>{selectedPhoto.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      by {selectedPhoto.photographer} • {new Date(selectedPhoto.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeLightbox}>
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="relative">
                <ImageWithFallback
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                
                {/* Navigation Buttons */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={() => navigatePhoto('prev')}
                  disabled={filteredPhotos.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => navigatePhoto('next')}
                  disabled={filteredPhotos.length <= 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Photo Actions */}
              <div className="p-6 pt-4 flex items-center justify-between border-t">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{selectedPhoto.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} of {filteredPhotos.length}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleShare(selectedPhoto)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(selectedPhoto)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    {selectedPhoto.likes}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}