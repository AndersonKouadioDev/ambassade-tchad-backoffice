'use client';

import React, {useState} from "react";
import {AlertTriangle, Calendar, Clock, Eye, MapPin, SquarePen, Trash2, User, X,} from "lucide-react";
import {Card, CardContent, CardFooter,} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

import {IEvenement} from "../../types/evenement.type";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import CarouselImage from "@/components/blocks/carousel-image";
import {useRouter} from "next/navigation";
import {EvenementDeleteModal} from "@/features/evenement/components/evenement-modal/evenement-delete-modal";

interface EvenementCardProps {
  evenement: IEvenement;
}

export const EvenementCard: React.FC<EvenementCardProps> = ({
  evenement,
}) => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "NA";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  const onView = (evenement: IEvenement) => {
    router.push(`/contenu/evenement/view/${evenement.id}`);
  }

  return (
    <>
      <Card
          className="group relative overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white dark:bg-gray-900"
          onClick={() => onView(evenement)}
      >
        {/* Image avec overlay titre & actions */}
        <div className="relative">
          <CarouselImage images={evenement.imageUrl!} />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

          {/* Titre & statut */}
          <div className="absolute bottom-3 left-3 z-20">
            <h3 className="text-white font-semibold text-lg truncate drop-shadow">
              {evenement.title}
            </h3>
            <Badge
                className={cn(
                    "mt-1 text-xs font-medium",
                    evenement.published
                        ? "bg-emerald-500 text-white"
                        : "bg-orange-500 text-white"
                )}
            >
              {evenement.published ? "Publié" : "Brouillon"}
            </Badge>
          </div>

          {/* Actions flottantes */}
          <div className="absolute top-3 right-3 flex gap-1 z-20">
            <Link
                href={`/contenu/evenement/view/${evenement.id}`}
                className="bg-white/80 hover:bg-white shadow-sm cursor-pointer rounded-md"
            >
              <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/contenu/evenement/view/${evenement.id}`);
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
                onClick={async (e) => {
                  e.stopPropagation();
                  router.push(`/contenu/evenement/edit/${evenement.id}`);
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
            {evenement.description}
          </p>

          {/* Infos clés avec style pro */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-orange-100 dark:border-orange-800 bg-orange-50/70 dark:bg-orange-900/30 shadow-sm">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-800">
              <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-300" />
            </div>
            <div className="flex-1">
              <span className="text-xs uppercase tracking-wide text-orange-500 dark:text-orange-300 font-medium">
                Date de l&#39;événement
              </span>
              <div className="text-sm font-semibold text-orange-800 dark:text-orange-100">
                {evenement.eventDate
                    ? formatDate(evenement.eventDate)
                    : "Date inconnue"}
              </div>
            </div>
          </div>

          {/* Lieu de l evenement */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-900/30 shadow-sm">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-800">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-1">
              <span className="text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300 font-medium">
                Lieu de l&#39;événement
              </span>
              <div className="text-sm font-semibold text-blue-800 dark:text-blue-100 first-letter:capitalize">
                {evenement.location}
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
                  alt={evenement.author?.firstName || evenement.authorId}
              />
              <AvatarFallback className="text-sm bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 font-semibold">
                {getInitials(
                    evenement.author?.firstName,
                    evenement.author?.lastName
                )}
              </AvatarFallback>
            </Avatar>

            {/* Infos auteur */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                <User className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                {evenement.author?.firstName && evenement.author?.lastName
                    ? `${evenement.author.firstName} ${evenement.author.lastName}`
                    : evenement.author?.firstName
                        ? evenement.author.firstName
                        : evenement.author?.lastName
                            ? evenement.author.lastName
                            : evenement.author?.email
                                ? evenement.author.email
                                : `Auteur (${evenement.authorId.slice(0, 8)}...)`}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                {evenement.createdAt
                    ? new Date(evenement.createdAt).toLocaleDateString("fr-FR", {
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
      <EvenementDeleteModal isOpen={showDeleteAlert} setIsOpen={setShowDeleteAlert} evenement={evenement}/>
    </>
  );
};

function formatDate(date: string|Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}