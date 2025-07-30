import { getTranslations } from "next-intl/server";
import UtilisateursStatsGrid from "@/features/utilisateur/components/utilisateurs-stats-grid";
import { prefetchUtilisateurStatsQuery } from "@/features/utilisateur/queries/utilisateur-stats.query";
import UserListTable from "@/features/utilisateur/components/user-list-table";
import { prefetchUtilisateursListQuery } from "@/features/utilisateur/queries/utilisateur-list.query";

export default async function UserListPage() {
  const t = await getTranslations("gestionUtilisateur");

  // Précharger les données
  await Promise.all([
    prefetchUtilisateurStatsQuery(),
    prefetchUtilisateursListQuery({
      page: 1,
      limit: 10,
    }),
  ]);

  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <UtilisateursStatsGrid />
        </div>

        <div className="col-span-12">
          <UserListTable />
        </div>
      </div>
    </div>
  );
}
