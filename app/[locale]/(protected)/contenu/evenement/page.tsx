
import { EvenementStats } from "@/features/evenement/components";
import { EvenementList } from "@/features/evenement/components/evenement-list";
import { prefetchEvenementsList } from "@/features/evenement/queries/evenement-list.query";
import { prefetchEvenementStats } from "@/features/evenement/queries/evenement-stats.query";
import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function EvenementListPage() {
  const t = await getTranslations("contenu.gestionActualite");

  await Promise.all([
    prefetchEvenementsList({
      page: 1,
    }),
    prefetchEvenementStats(),
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
              Gérez et organisez vos évènements avec une interface moderne et
              intuitive
            </p>
          </div>
        </div>
      </div>

      <EvenementStats/>

      <div className="bg-white dark:bg-default-100 rounded-xl shadow-sm border border-default-200/50 p-6">
        <EvenementList />
      </div>
    </div>
  );
}
