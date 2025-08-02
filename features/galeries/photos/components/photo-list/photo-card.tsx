"use client";

import React, { useState } from "react";
import {
  Trash2,
  AlertTriangle,
  X,
  Calendar,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

import { Button } from "@heroui/react";
import { IPhoto } from "../../types/photo.type";
import { formatImageUrl } from "@/features/actualites/utils/image-utils";

interface PhotoCardProps {
  photo: IPhoto;
  onView: (photo: IPhoto) => void;
  onEdit: (photo: IPhoto) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onView,

}) => {
  const [imageError, setImageError] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

 

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteAlert(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteAlert(false);
  };

  return (
    <>
      <Card
        className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 shadow-lg backdrop-blur-sm overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
        onClick={() => onView(photo)}
      >
        {/* Image principale (première image seulement) */}
        <CardContent className="p-0">
          {photo.imageUrl &&
          photo.imageUrl.length > 0 &&
          !imageError ? (
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={formatImageUrl(photo.imageUrl[0])}
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
                  className="absolute top-3 right-3"
                  onPress={(e) => {
                    onView(photo);
                  }}
                  title="Voir toutes les images"
                  isIconOnly
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
                <ImageIcon className="w-16 h-16" />
                <span className="text-sm font-medium">Aucune image</span>
              </div>
            </div>
          )}
        </CardContent>
        {/* Contenu principal */}
        <CardContent className="p-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
            {photo.description}
          </p>      
        {/* Informations clés */}
          <div className="space-y-3">
            {/* Date de création */}
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Créé le{" "}
                {photo.createdAt instanceof Date
                  ? photo.createdAt.toLocaleDateString("fr-FR")
                  : photo.createdAt
                  ? new Date(photo.createdAt).toLocaleDateString("fr-FR")
                  : "Date inconnue"}
              </span>
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Alerte de suppression professionnelle */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            {/* Header de l'alerte */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirmer la suppression
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cette action est irréversible
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={handleCancelDelete}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Contenu de l'alerte */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Êtes-vous sûr de vouloir supprimer la photo{" "}
                  <strong>{photo.title}</strong> ?
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                        Attention
                      </p>
                      <p className="text-red-700 dark:text-red-300">
                        Cette action supprimera définitivement la photo et
                        toutes ses données associées. Cette opération ne peut
                        pas être annulée.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3">
                <Button
                  variant="bordered"
                  className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={handleCancelDelete}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                  onClick={handleConfirmDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
