"use client";

import React, { useState } from "react";
import {
  SquarePen,
  Trash2,
  AlertTriangle,
  X,
  Calendar,
  User,
  Clock,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IActualite } from "../../types/actualites.type";
import { formatImageUrl } from "../../utils/image-utils";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
interface ActualiteCardProps {
  actualite: IActualite;
  onView: (actualite: IActualite) => void;
  onDelete: (actualite: IActualite) => void;
}

export const ActualiteCard: React.FC<ActualiteCardProps> = ({
  actualite,
  onView,
  onDelete,
}) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "NA";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(actualite);
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
        onClick={() => onView(actualite)}
      >
        {/* Header avec gradient et boutons */}
        <CardHeader className="pb-3 px-4 pt-4 text-black bg-blue-50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-black leading-tight truncate">
                {actualite.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={cn(
                    "text-xs font-medium",
                    actualite.published
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  )}
                >
                  {actualite.published ? "Publié" : "Brouillon"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1 p-2">
              <Button
                variant="ghost"
                size="sm"
                color="secondary"
                onPress={() =>
                  router.push(`/contenu/actualite/edit/${actualite.id}`)
                }
                title="Modifier"
                isIconOnly
              >
                <SquarePen className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                color="danger"
                onPress={(e) => handleDeleteClick()}
                title="Supprimer"
                isIconOnly
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Image principale (première image seulement) */}
        <CardContent className="p-0">
          {actualite.imageUrls &&
          actualite.imageUrls.length > 0 &&
          !imageError ? (
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={formatImageUrl(actualite.imageUrls[0])}
                alt={actualite.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {actualite.imageUrls.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3"
                  onPress={(e) => {
                    onView(actualite);
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
            {actualite.content}
          </p>

          {/* Informations clés */}
          <div className="space-y-3">
            {/* Date de création */}
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Créé le{" "}
                {actualite.createdAt
                  ? new Date(actualite.createdAt).toLocaleDateString("fr-FR")
                  : "Date inconnue"}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Footer avec auteur */}
        <CardFooter className="pt-3 px-4 pb-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3 w-full">
            <Avatar className="w-8 h-8 ring-2 ring-white dark:ring-gray-700">
              <AvatarImage
                src={undefined}
                alt={actualite.author?.firstName || actualite.authorId}
              />
              <AvatarFallback className="text-xs bg-embassy-blue-100 text-embassy-blue-600 font-medium">
                {getInitials(
                  actualite.author?.firstName,
                  actualite.author?.lastName
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                <User className="w-3 h-3" />
                <span className="font-medium">
                  {actualite.author?.firstName && actualite.author?.lastName
                    ? `${actualite.author.firstName} ${actualite.author.lastName}`
                    : actualite.author?.firstName
                    ? actualite.author.firstName
                    : actualite.author?.lastName
                    ? actualite.author.lastName
                    : actualite.author?.email
                    ? actualite.author.email
                    : `Auteur (${actualite.authorId.slice(0, 8)}...)`}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  {actualite.createdAt
                    ? new Date(actualite.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Date inconnue"}
                </span>
              </div>
            </div>
          </div>
        </CardFooter>
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
                  Êtes-vous sûr de vouloir supprimer l&apos;actualité{" "}
                  <strong>{actualite.title}</strong> ?
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                        Attention
                      </p>
                      <p className="text-red-700 dark:text-red-300">
                        Cette action supprimera définitivement l&apos;actualité
                        et toutes ses données associées. Cette opération ne peut
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
