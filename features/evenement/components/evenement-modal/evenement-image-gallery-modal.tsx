"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatImageUrl } from "@/features/actualites/utils/image-utils";

interface EvenementImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title: string;
}

export const EvenementImageGalleryModal: React.FC<EvenementImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  title,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || images.length === 0) return null;

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

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Bouton fermer */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </>
        )}

        {/* Image principale */}
        <div className="relative flex items-center justify-center p-8">
          <div className="relative aspect-square max-w-4xl">
            <Image
              src={formatImageUrl(images[currentImageIndex])}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              fill

              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Indicateurs */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* Informations */}
        <div className="absolute bottom-4 left-4 text-white text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}; 