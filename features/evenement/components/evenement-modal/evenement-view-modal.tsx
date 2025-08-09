"use client";

import React, { useState } from "react";
import { ViewModal } from "@/components/blocks/view-modal";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, Image as ImageIcon } from "lucide-react";
import { IEvenement } from "../../types/evenement.type";
import { formatImageUrl } from "@/features/actualites/utils/image-utils";

interface EvenementViewModal {
  evenement: IEvenement | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenImageGallery: () => void;
}

export const EvenementViewModal: React.FC<EvenementViewModal> = ({
  evenement,
  isOpen,
  onClose,
  onOpenImageGallery,
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (!evenement) return null;

  const renderImages = () => {
    if (!evenement.imageUrl || evenement.imageUrl.length === 0) {
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
          src={formatImageUrl(evenement.imageUrl[0])}
          alt={evenement.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {evenement.imageUrl.length > 1 && (
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
            Voir toutes ({evenement.imageUrl.length})
          </Button>
        )}
      </div>
    );
  };

  const getAuthorName = () => {
    if (!evenement.author) return `Auteur (${evenement.authorId.slice(0, 8)}...)`;
    
    const { firstName, lastName, email } = evenement.author;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return firstName || lastName || email || `Auteur (${evenement.authorId.slice(0, 8)}...)`;
  };

  return (
    <ViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de l'événement"
      data={{
        ...evenement,
        images: renderImages(),
        dateCreation: evenement.createdAt,
        dateModification: evenement.updatedAt,
        auteur: {
          nom: getAuthorName(),
          email: evenement.author?.email,
          id: evenement.author?.id || evenement.authorId
        },
        statut: evenement.published ? "Publié" : "Brouillon",
        description: evenement.description || "Aucune description fournie",
        localisation: evenement.location || "Aucune localisation fournie",
        date: evenement.eventDate? new Date(evenement.eventDate).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }) : "Aucune date fournie"
      }}
      type="evenement"
      translationNamespace="contenu.gestionActualite"
    />
  );
};