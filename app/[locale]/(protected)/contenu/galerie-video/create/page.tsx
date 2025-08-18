import React from "react";
import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonGoLink } from "@/components/blocks/button-goLink";
import {VideoForm} from "@/features/galeries/videos/components/video-form/video-form";

export default async function CreateVideoPage() {
    const t = await getTranslations("contenu.gestionVideo");

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <ButtonGoLink href="/contenu/galerie-video" />
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Créer une nouvelle video</h1>
            <p className="text-primary-100 mt-2">
              Rédigez et publiez une nouvelle video
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <VideoForm />
      </div>
    </div>
  );
}
