import { getTranslations } from "next-intl/server";
import { UtilisateursStatsGrid } from "@/features/utilisateur/components/utilisateurs-stats-grid";
import { prefetchUtilisateurStatsQuery } from "@/features/utilisateur/queries/utilisateur-stats.query";
import { UserList } from "@/features/utilisateur/components/utilisateur-list";
import { prefetchUtilisateursListQuery } from "@/features/utilisateur/queries/utilisateur-list.query";

export default async function UserListPage() {
  const t = await getTranslations("gestionDemandeur");

  // Précharger les données
  await Promise.all([
    prefetchUtilisateurStatsQuery({ type: "demandeur" }),
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
          <UtilisateursStatsGrid type="demandeur" />
        </div>

        <div className="col-span-12">
          <UserList />
        </div>
      </div>
    </div>
  );
}
