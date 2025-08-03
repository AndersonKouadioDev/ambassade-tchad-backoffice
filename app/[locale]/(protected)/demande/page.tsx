import { getTranslations } from "next-intl/server";
import { DemandeStatsGrid } from "@/features/demande/components/demande-stats-grid";
import { prefetchGlobalDemandeStatsQuery } from "@/features/demande/queries/demande-stats.query";
import { DemandeList } from "@/features/demande/components/demande-view-list";
import { prefetchDemandesFilteredListQuery } from "@/features/demande/queries/demande-list.query";

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
    <div className="container">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold">{t("title")}</h1>

          <DemandeStatsGrid />
        </div>

        <div className="col-span-12">
          <DemandeList />
        </div>
      </div>
    </div>
  );
}
