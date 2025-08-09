import { getTranslations } from "next-intl/server";
import { UtilisateursStatsGrid } from "@/features/utilisateur/components/utilisateurs-stats-grid";
import { prefetchUtilisateurStatsQuery } from "@/features/utilisateur/queries/utilisateur-stats.query";
import { UtilisateurList } from "@/features/utilisateur/components/utilisateur-list";
import { prefetchUtilisateursListQuery } from "@/features/utilisateur/queries/utilisateur-list.query";
import { BookOpen } from "lucide-react";

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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-xl p-8 text-white shadow-lg dark:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-primary-100 dark:text-primary-200 mt-2">
              Gérez et organisez vos citoyens avec une interface moderne et
              intuitive
            </p>
          </div>
        </div>
      </div>
      <UtilisateursStatsGrid type="demandeur" />
      <UtilisateurList type="demandeur" />
    </div>
  );
}
