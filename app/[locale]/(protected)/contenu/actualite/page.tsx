import {
  ActualiteList,
  ActualiteStats,
} from "@/features/actualites/components";
import { prefetchActualitesList } from "@/features/actualites/queries/actualite-list.query";
import { prefetchActualiteStats } from "@/features/actualites/queries/actualite-stats.query";
import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ActualiteListPage() {
  const t = await getTranslations("contenu.gestionActualite");

  // Prechargement des données
  await Promise.all([
    prefetchActualitesList({
      page: 1,
    }),
    prefetchActualiteStats(),
  ]);

  return (
    <div className="space-y-8">
      {/* En-tête avec titre et description */}
      <div className="bg-gradient-to-r from-embassy-blue-600 to-embassy-blue-700 dark:from-embassy-blue-800 dark:to-embassy-blue-900 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-embassy-blue-100 dark:text-embassy-blue-200 mt-2">
              Gérez et organisez vos actualités avec une interface moderne et
              intuitive
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <ActualiteStats />

      {/* Composant principal des actualités */}
      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <ActualiteList />
      </div>
    </div>
  );
}
