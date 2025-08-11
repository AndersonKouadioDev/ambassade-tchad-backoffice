import React from "react";
import { BookOpen } from "lucide-react";
import { ButtonGoLink } from "@/components/blocks/button-goLink";
import { getTranslations } from "next-intl/server";
import { PhotoNotFound } from "@/features/galeries/photos/components";
import { PhotoForm } from "@/features/galeries/photos/components/photo-form/photo-form";
import { prefetchPhotoDetailQuery } from "@/features/galeries/photos/queries/photo-details.query";

interface EditPhotoProps {
  params: Promise<{ id: string }>;
}

export default async function EditPhotoPage({
  params,
}: EditPhotoProps) {
  const { id } = await params;

  if (!id) {
    return PhotoNotFound();
  }
  // Prechargement de données
  await prefetchPhotoDetailQuery(id);

  const t = getTranslations("contenu.gestionPhoto");

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <ButtonGoLink href="/contenu/galerie-photo" />
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Modifier la photo</h1>
            <p className="text-primary-100 mt-2">
              Modifiez le contenu et les paramètres de la photo
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <PhotoForm id={id} />
      </div>
    </div>
  );
}
