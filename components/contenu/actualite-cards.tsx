"use client";

import * as React from "react";
import { SquarePen, Trash2, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { IActualite } from "@/features/actualites/types/actualites.type";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface ActualiteCardsProps {
  data: IActualite[];
  onView: (actualite: IActualite) => void;
  onEdit: (actualite: IActualite) => void;
  onDelete: (actualite: IActualite) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

export const ActualiteCards: React.FC<ActualiteCardsProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false
}) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "NA";
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onCreate} className="bg-gradient-to-r from-embassy-blue-600 to-embassy-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />Nouvelle actualité
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {data.map((actualite) => (
          <Card key={actualite.id} className="group hover:shadow-xl transition-all duration-500 cursor-pointer border-0 shadow-md backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2 px-3 pt-3 flex flex-row items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-default-900 leading-tight truncate">
                  {actualite.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); onEdit(actualite); }}><SquarePen className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); onDelete(actualite); }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-0">
              {actualite.imageUrl && actualite.imageUrl.length > 0 && (
                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={actualite.imageUrl[0]}
                    alt={actualite.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {actualite.content}
              </p>
            </CardContent>
            <CardFooter className="pt-3 border-t border-default-200/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={undefined} alt={actualite.author?.firstName || actualite.authorId} />
                  <AvatarFallback className="text-xs bg-embassy-blue-100 text-embassy-blue-600">
                    {getInitials(actualite.author?.firstName, actualite.author?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {actualite.author?.firstName} {actualite.author?.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {actualite.createdAt instanceof Date ? actualite.createdAt.toLocaleDateString("fr-FR") : actualite.createdAt ? new Date(actualite.createdAt).toLocaleDateString("fr-FR") : "Date inconnue"}
              </div>
              <div>
                {actualite.published ? (
                  <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">Publié</span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">Brouillon</span>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
