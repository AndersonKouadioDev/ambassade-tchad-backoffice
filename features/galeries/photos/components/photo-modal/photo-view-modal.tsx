"use client";

import React, { useState } from "react";
import { ViewModal } from "@/components/blocks/view-modal";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, Image as ImageIcon } from "lucide-react";
import { IPhoto } from "../../types/photo.type";

interface PhotoViewModal {
  photo: IPhoto | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenImageGallery: () => void;
}

export const PhotoViewModal: React.FC<PhotoViewModal> = ({
  photo,
  isOpen,
  onClose,
  onOpenImageGallery,
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (!photo) return null;

  const renderImages = () => {
    if (!photo.imageUrl || photo.imageUrl.length === 0) {
      return (
        <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
            <ImageIcon className="w-16 h-16" />
            <span className="text-sm font-medium">Aucune image</span>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={photo.imageUrl[0]}
          alt={photo.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {photo.imageUrl.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onOpenImageGallery();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir toutes ({photo.imageUrl.length})
          </Button>
        )}
      </div>
    );
  };



  return (
    <ViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de la photo"
      data={{
        ...photo,
        images: renderImages(),
        dateCreation: photo.createdAt,
        dateModification: photo.updatedAt,
        description: photo.description || "Aucune description fournie",
       
      }}
      type="galerie-photo"
      translationNamespace="contenu.gestionPhoto"
    />
  );
};