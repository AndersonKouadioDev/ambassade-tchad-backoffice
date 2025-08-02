"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatImageUrl } from "@/features/actualites/utils/image-utils";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  type?: 'actualite' | 'evenement' | 'galerie-photo' | 'galerie-video' | 'service';
  translationNamespace?: string;
}

export const ViewModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  type = 'actualite',
  translationNamespace = "common"
}) => {
  const t = useTranslations(translationNamespace);

  if (!data) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1200px] max-h-[95vh] overflow-hidden flex flex-col p-0">
        {/* Header avec image de fond si disponible */}
        <div className="relative">
          {(type === 'actualite' || type === 'evenement') && data.imageUrl && data.imageUrl.length > 0 && (
            <div className="relative h-64 w-full overflow-hidden">
              <Image
               src={formatImageUrl(data.imageUrl[0])}
                alt={data.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          )}
          <div className={cn(
            "relative p-6",
            (type === 'actualite' || type === 'evenement') && data.imageUrl && data.imageUrl.length > 0 
              ? "absolute bottom-0 left-0 right-0 text-white" 
              : "bg-gradient-to-r from-embassy-blue-600 to-embassy-blue-700 text-white"
          )}>
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold leading-tight mb-2">
                  {data.title}
                </h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full flex-shrink-0",
                  (type === 'actualite' || type === 'evenement') && data.imageUrl && data.imageUrl.length > 0
                    ? "text-white hover:bg-white/20 hover:text-white bg-black/20" 
                    : "text-white hover:bg-white/20 hover:text-white"
                )}
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Métadonnées principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date de création */}
            {(type === 'actualite' || type === 'evenement') && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {type === 'evenement' ? 'Date de l\'événement' : 'Date de création'}
                </label>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Calendar className="w-4 h-4 text-embassy-blue-600" />
                  <span>
                    {type === 'evenement' 
                      ? (data.eventDate instanceof Date ? data.eventDate.toLocaleDateString('fr-FR') : new Date(data.eventDate).toLocaleDateString('fr-FR'))
                      : (data.createdAt instanceof Date ? data.createdAt.toLocaleDateString('fr-FR') : new Date(data.createdAt).toLocaleDateString('fr-FR'))
                    }
                  </span>
                </div>
              </div>
            )}
            {/* Statut */}
            {(type === 'actualite' || type === 'evenement') && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Statut</label>
                <div>
                  <span className={cn("text-xs px-2 py-1 rounded", data.published ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700")}>
                    {data.published ? "Publié" : "Brouillon"}
                  </span>
                </div>
              </div>
            )}
            {/* Auteur */}
            {(type === 'actualite' || type === 'evenement') && data.author && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Auteur</label>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={undefined} alt={data.author.firstName || data.authorId} />
                    <AvatarFallback className="bg-embassy-blue-100 text-embassy-blue-600">
                      {data.author.firstName?.[0]}{data.author.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{data.author.firstName} {data.author.lastName}</p>
                    <p className="text-sm text-muted-foreground">{data.author.email}</p>
                  </div>
                </div>
              </div>
            )}
            {/* Lieu pour les événements */}
            {type === 'evenement' && data.location && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Lieu</label>
                <div className="text-sm text-foreground">
                  {data.location}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <label className="text-lg font-semibold text-foreground">
              {type === 'evenement' ? 'Description' : 'Contenu'}
            </label>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {type === 'evenement' ? data.description : data.content}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
