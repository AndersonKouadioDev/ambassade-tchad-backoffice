"use client";

import React from "react";
import { ViewModal } from "@/components/ui/view-modal";
import { IActualite } from "../../types/actualites.type";

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
        /* ESPACE RÉSERVÉ POUR LES IMAGES */
        images: (
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
            <p className="text-gray-500">Espace réservé pour l'affichage des images</p>
            <button 
              onClick={onOpenImageGallery}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Voir la galerie
            </button>
          </div>
        ),
        /* FIN DE L'ESPACE IMAGES */
        dateCreation: actualite.createdAt,
        dateModification: actualite.updatedAt,
        auteur: actualite.author
          ? {
              nom:
                actualite.author.firstName && actualite.author.lastName
                  ? `${actualite.author.firstName} ${actualite.author.lastName}`
                  : actualite.author.firstName
                  ? actualite.author.firstName
                  : actualite.author.lastName
                  ? actualite.author.lastName
                  : actualite.author.email
                  ? actualite.author.email
                  : `Auteur (${actualite.authorId.slice(0, 8)}...)`,
              email: actualite.author.email,
              id: actualite.author.id,
            }
          : {
              nom: `Auteur (${actualite.authorId.slice(0, 8)}...)`,
              id: actualite.authorId,
            },
        statut: actualite.published ? "Publié" : "Brouillon",
      }}
      type="actualite"
      translationNamespace="contenu.gestionActualite"
     
    />
  );
};