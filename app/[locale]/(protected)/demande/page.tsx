import { getTranslations } from "next-intl/server";
import { DemandeStatsGrid } from "@/features/demande/components/demande-stats-grid";
import { prefetchGlobalDemandeStatsQuery } from "@/features/demande/queries/demande-stats.query";
import { DemandeList } from "@/features/demande/components/demande-view-list";
import { prefetchDemandesFilteredListQuery } from "@/features/demande/queries/demande-list.query";
import { BookOpen } from "lucide-react";

export default async function DemandePage() {
  const t = await getTranslations("gestionDemande");

  await Promise.all([
    prefetchGlobalDemandeStatsQuery(),
    prefetchDemandesFilteredListQuery({
      page: 1,
      limit: 10,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-embassy-blue-600 to-embassy-blue-700 dark:from-embassy-blue-800 dark:to-embassy-blue-900 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-embassy-blue-100 dark:text-embassy-blue-200 mt-2">
              Gérez et organisez vos demandes avec une interface moderne et
              intuitive
            </p>
          </div>
        </div>
      </div>
      <DemandeStatsGrid />
      <DemandeList />
    </div>
  );
}
