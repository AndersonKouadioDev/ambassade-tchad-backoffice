"use client";

import React, {useState} from "react";
import {Calendar, Clock, Eye, SquarePen, Trash2, User,} from "lucide-react";
import {Card, CardContent, CardFooter,} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {IActualite} from "../../types/actualites.type";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ActualiteDeleteModal} from "../actualite-modal/actualite-delete-modal";
import {Link} from "@/i18n/navigation";
import CarouselImage from "@/components/blocks/carousel-image";

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
        className="group relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white dark:bg-gray-900"
        onClick={() => onView(actualite)}
      >
        {/* Image avec overlay titre & actions */}
        <div className="relative">
          <CarouselImage images={actualite.imageUrls!} />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

          {/* Titre & statut */}
          <div className="absolute bottom-3 left-3 z-20">
            <h3 className="text-white font-semibold text-lg truncate drop-shadow">
              {actualite.title}
            </h3>
            <Badge
              className={cn(
                "mt-1 text-xs font-medium",
                actualite.published
                  ? "bg-emerald-500 text-white"
                  : "bg-orange-500 text-white"
              )}
            >
              {actualite.published ? "Publié" : "Brouillon"}
            </Badge>
          </div>

          {/* Actions flottantes */}
          <div className="absolute top-3 right-3 flex gap-1 z-20">
            <Link
              href={`/contenu/actualite/view/${actualite.id}`}
              className="bg-white/80 hover:bg-white shadow-sm cursor-pointer rounded-md"
            >
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/contenu/actualite/view/${actualite.id}`);
                }}
                title="Modifier"
                className="bg-white/80 hover:bg-white shadow-sm"
              >
                <Eye className="w-4 h-4 text-yellow-500" />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/contenu/actualite/edit/${actualite.id}`);
              }}
              title="Modifier"
              className="bg-white/80 hover:bg-white shadow-sm"
            >
              <SquarePen className="w-4 h-4 text-green-500" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              title="Supprimer"
              className="bg-white/80 hover:bg-white shadow-sm"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <CardContent className="p-5 space-y-5 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          {/* Contenu principal */}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed tracking-wide">
            {actualite.content}
          </p>

          {/* Infos clés avec style pro */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-900/30 shadow-sm">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-800">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-1">
              <span className="text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300 font-medium">
                Créé le
              </span>
              <div className="text-sm font-semibold text-blue-800 dark:text-blue-100">
                {actualite.createdAt
                  ? new Date(actualite.createdAt).toLocaleDateString("fr-FR")
                  : "Date inconnue"}
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer auteur */}
        <CardFooter className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 w-full">
            {/* Avatar stylé */}
            <Avatar className="w-10 h-10 shadow ring-2 ring-white dark:ring-gray-700">
              <AvatarImage
                src={undefined}
                alt={actualite.author?.firstName || actualite.authorId}
              />
              <AvatarFallback className="text-sm bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 font-semibold">
                {getInitials(
                  actualite.author?.firstName,
                  actualite.author?.lastName
                )}
              </AvatarFallback>
            </Avatar>

            {/* Infos auteur */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                <User className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                {actualite.author?.firstName && actualite.author?.lastName
                  ? `${actualite.author.firstName} ${actualite.author.lastName}`
                  : actualite.author?.firstName
                    ? actualite.author.firstName
                    : actualite.author?.lastName
                      ? actualite.author.lastName
                      : actualite.author?.email
                        ? actualite.author.email
                        : `Auteur (${actualite.authorId.slice(0, 8)}...)`}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {actualite.createdAt
                  ? new Date(actualite.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "Date inconnue"}
              </div>
            </div>
          </div>
        </CardFooter>

      </Card>


      <ActualiteDeleteModal actualite={actualite} isOpen={showDeleteAlert} setIsOpen={setShowDeleteAlert} />
      
    </>
  );
};

