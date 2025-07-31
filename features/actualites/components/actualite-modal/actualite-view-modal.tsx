"use client";

import React from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewModal } from "@/components/ui/view-modal";
import Image from "next/image";
import { IActualite } from "../../types/actualites.type";
import { formatImageUrl } from "../../utils/image-utils";

interface ActualiteViewModalProps {
  actualite: IActualite | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenImageGallery: () => void;
}

export const ActualiteViewModal: React.FC<ActualiteViewModalProps> = ({
  actualite,
  isOpen,
  onClose,
  onOpenImageGallery,
}) => {
  if (!actualite) return null;

  return (
    <ViewModal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de l'actualité"
      data={{
        ...actualite,
        dateCreation: actualite.createdAt,
        dateModification: actualite.updatedAt,
                 auteur: actualite.author ? {
           nom: actualite.author.firstName && actualite.author.lastName 
             ? `${actualite.author.firstName} ${actualite.author.lastName}`
             : actualite.author.firstName 
             ? actualite.author.firstName
             : actualite.author.lastName
             ? actualite.author.lastName
             : actualite.author.email
             ? actualite.author.email
             : `Auteur (${actualite.authorId.slice(0, 8)}...)`,
           email: actualite.author.email,
           id: actualite.author.id
         } : {
           nom: `Auteur (${actualite.authorId.slice(0, 8)}...)`,
           id: actualite.authorId
         },
        statut: actualite.published ? "Publié" : "Brouillon",
        images: actualite.imageUrls || []
      }}
      type="actualite"
      translationNamespace="contenu.gestionActualite"
    />
  );
}; 