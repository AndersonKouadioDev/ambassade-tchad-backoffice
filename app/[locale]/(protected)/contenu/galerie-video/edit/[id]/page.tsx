import React from "react";
import {BookOpen} from "lucide-react";
import {ButtonGoLink} from "@/components/blocks/button-goLink";
import {getTranslations} from "next-intl/server";
import {VideoNotFound} from "@/features/galeries/videos/components";
import {VideoForm} from "@/features/galeries/videos/components/video-form/video-form";
import {prefetchVideoDetailQuery} from "@/features/galeries/videos/queries/video-details.query";

interface EditVideoProps {
  params: Promise<{ id: string }>;
}

export default async function EditVideoPage({
  params,
}: EditVideoProps) {
  const { id } = await params;

  if (!id) {
    return VideoNotFound();
  }
  // Prechargement de données
  await prefetchVideoDetailQuery(id);

  const t = getTranslations("contenu.gestionVideo");

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <ButtonGoLink href="/contenu/galerie-video" />
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Modifier la video</h1>
            <p className="text-primary-100 mt-2">
              Modifiez le contenu et les paramètres de la video
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <VideoForm id={id} />
      </div>
    </div>
  );
}
