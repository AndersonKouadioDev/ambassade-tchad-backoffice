"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EvenementImageGalleryModalProps {
  images: string[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EvenementImageGalleryModal: React.FC<EvenementImageGalleryModalProps> = ({
  images,
  title,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !images || images.length === 0) return null;

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentImageIndex];
    link.download = `${title}-image-${currentImageIndex + 1}.jpg`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Bouton de fermeture */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0 h-10 w-10 p-0"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Bouton de téléchargement */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-16 z-10 bg-black/50 hover:bg-black/70 text-white border-0 h-10 w-10 p-0"
        onClick={handleDownload}
      >
        <Download className="w-5 h-5" />
      </Button>

      {/* Indicateur d'image */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-black/70 text-white border-0">
          {currentImageIndex + 1} / {images.length}
        </Badge>
      </div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          {/* Bouton précédent */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 h-12 w-12 p-0"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          {/* Bouton suivant */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 h-12 w-12 p-0"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Image principale */}
      <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
        <Image
          src={images[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain rounded-lg"
          priority
        />
      </div>

      {/* Indicateurs de navigation en bas */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentImageIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Informations sur l'image */}
      <div className="absolute bottom-4 left-4 text-white text-sm opacity-75">
        <p>{title}</p>
        <p>Image {currentImageIndex + 1} sur {images.length}</p>
      </div>
    </div>
  );
}; 