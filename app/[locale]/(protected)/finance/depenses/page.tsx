import { getTranslations } from "next-intl/server";
import { DepensesStatsGrid } from "@/features/finance/depense/components/depense-stats-grid";
import { prefetchDepenseStatsQuery } from "@/features/finance/depense/queries/depense-stats.query";
import { DepenseList } from "@/features/finance/depense/components/depense-list";
import { prefetchDepensesListQuery } from "@/features/finance/depense/queries/depense-list.query";
import { BookOpen } from "lucide-react";

export default async function DepenseListPage() {
  const t = await getTranslations("finance.depenses");

  // Précharger les données
  await Promise.all([
    prefetchDepenseStatsQuery(),
    prefetchDepensesListQuery({
      page: 1,
      limit: 10,
    }),
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
              Gérez et organisez vos dépenses avec une interface moderne et
              intuitive
            </p>
          </div>
        </div>
      </div>
      <DepensesStatsGrid />
      <DepenseList />
    </div>
  );
}
