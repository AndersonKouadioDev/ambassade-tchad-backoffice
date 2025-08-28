import { PhotoStats } from "@/features/galeries/photos/components";
import { prefetchPhotosList } from "@/features/galeries/photos/queries/photo-list.query";
import { prefetchPhotoStats } from "@/features/galeries/photos/queries/photo-stats.query";
import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PhotoListTable } from "@/features/galeries/photos/components/photo-list";

export default async function PhotoListPage() {
  const t = await getTranslations("contenu.gestionPhoto");

  // Prechargement des données
  await Promise.all([
    prefetchPhotosList({
      page: 1,
    }),
    prefetchPhotoStats(),
  ]);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-primary-100 mt-2">
              Gérez et organisez vos photos avec une interface moderne et
              intuitive
            </p>
          </div>
        </div>
      </div>

      <PhotoStats />

      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <PhotoListTable />
      </div>
    </div>
  );
}
