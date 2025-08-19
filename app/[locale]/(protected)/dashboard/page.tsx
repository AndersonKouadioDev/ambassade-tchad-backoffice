import { prefetchStatistiqueQuery } from "@/features/statistique/queries/statistiques.query";
import { Dashboard } from "./Dashboard";

export default async function DashboardPage() {
  // Du début à la fin du mois en cours
  await prefetchStatistiqueQuery({
    fromDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString(),
    toDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).toISOString(),
  });
  return <Dashboard />;
}
