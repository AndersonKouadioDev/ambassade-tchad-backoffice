"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EvenementImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
  showNavigation?: boolean;
  showBadge?: boolean;
}

export const EvenementImageGallery: React.FC<EvenementImageGalleryProps> = ({
  images,
  title,
  className,
  showNavigation = true,
  showBadge = true,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={cn("relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <ImageIcon className="w-16 h-16" />
          <span className="text-sm font-medium">Aucune image</span>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={cn("relative h-56 w-full overflow-hidden", className)}>
      {/* Image principale */}
      <Image
        src={images[currentImageIndex]}
        alt={`${title} - Image ${currentImageIndex + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        onError={handleImageError}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Badge pour indiquer le nombre d'images */}
      {showBadge && images.length > 1 && (
        <Badge className="absolute top-3 right-3 bg-black/70 text-white border-0">
          {currentImageIndex + 1}/{images.length}
        </Badge>
      )}
      
      {/* Navigation */}
      {showNavigation && images.length > 1 && (
        <>
          {/* Bouton précédent */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {/* Bouton suivant */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}
      
      {/* Indicateurs de navigation */}
      {showNavigation && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentImageIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 