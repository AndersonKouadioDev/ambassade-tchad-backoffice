'use client';

import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VideoThumbnailProps {
  src: string;
  title: string;
  duration?: string;
  className?: string;
  showPlayButton?: boolean;
  isNew?: boolean;
  onPlay?: () => void;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  src,
  title,
  duration,
  className,
  showPlayButton = true,
  isNew = false,
  onPlay,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div 
      className={cn(
        "relative h-64 w-full bg-gradient-to-br from-embassy-blue-100 to-embassy-blue-200 dark:from-embassy-blue-900/30 dark:to-embassy-blue-800/30 overflow-hidden rounded-lg group cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPlay}
    >
      {/* Vidéo en background avec première frame comme thumbnail */}
      {!videoError ? (
        <video
          src={src}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          onError={handleVideoError}
          poster="" // Utilise la première frame comme poster
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <Play className="w-16 h-16 text-embassy-blue-600 mx-auto mb-2" />
            <p className="text-sm text-embassy-blue-600">Vidéo non disponible</p>
          </div>
        </div>
      )}
      
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Bouton play central */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            variant="default"
            className={cn(
              "rounded-full bg-white/90 hover:bg-white text-embassy-blue-600 h-16 w-16 p-0 shadow-lg transition-all duration-300",
              isHovered ? "scale-110" : "scale-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
          >
            <Play className="w-8 h-8 ml-1" />
          </Button>
        </div>
      )}
      
      {/* Badge "Nouveau" */}
      {isNew && (
        <div className="absolute top-3 left-3">
          <Badge className="bg-embassy-red-500 text-white font-medium">
            Nouveau
          </Badge>
        </div>
      )}
      
      {/* Durée */}
      {duration && (
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-black/70 text-white font-mono">
            {duration}
          </Badge>
        </div>
      )}
      
      {/* Overlay avec effet hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-white font-medium text-sm line-clamp-2 leading-tight">
            {title}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;
