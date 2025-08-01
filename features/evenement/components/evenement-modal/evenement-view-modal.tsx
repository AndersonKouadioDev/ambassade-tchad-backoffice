"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IEvenement } from "@/types/evenement.types";
import { ViewModal } from "@/components/ui/view-modal";
import { EvenementImageGalleryModal } from "./evenement-image-gallery-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Eye } from "lucide-react";
import Image from "next/image";

interface EvenementViewModalProps {
  evenement: IEvenement | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (evenement: IEvenement) => void;
}

export const EvenementViewModal: React.FC<EvenementViewModalProps> = ({
  evenement,
  isOpen,
  onClose,
  onEdit,
}) => {
  const t = useTranslations("contenu.gestionEvenement");
  const [showImageGallery, setShowImageGallery] = useState(false);

  if (!evenement) return null;

  const images = evenement.imageUrl || [];

  // Préparer les données pour l'affichage
  const eventData = {
    ...evenement,
    // Ajouter des champs pour l'affichage
    dateCreation: evenement.createdAt,
    dateModification: evenement.updatedAt,
    auteur: evenement.author ? {
      nom: `${evenement.author.firstName || ''} ${evenement.author.lastName || ''}`.trim(),
      email: evenement.author.email
    } : null,
    statut: evenement.published ? t("status.publie") : t("status.brouillon"),
    images: images
  };

  return (
    <>
      <ViewModal
        isOpen={isOpen}
        onClose={onClose}
        title="Détails de l'événement"
        data={eventData}
        type="evenement"
        translationNamespace="contenu.gestionEvenement"
        customContent={
          images.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Images de l'événement ({images.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageGallery(true)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Voir toutes les images
                </Button>
              </div>
              
              {/* Grille d'aperçu des images */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={imageUrl}
                        alt={`${evenement.title} - Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      />

      {/* Modal de galerie d'images */}
      <EvenementImageGalleryModal
        images={images}
        title={evenement.title}
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
      />
    </>
  );
}; 