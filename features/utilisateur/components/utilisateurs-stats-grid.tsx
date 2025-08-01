"use client";

import { StatusBlock } from "@/components/blocks/status-block";
import { User, CheckCircle, PauseCircle, Ban } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUtilisateurStatsQuery } from "@/features/utilisateur/queries/utilisateur-stats.query";

export function UtilisateursStatsGrid({
  type,
}: {
  type: "personnel" | "demandeur";
}) {
  const t = useTranslations("gestionUtilisateur");
  const { data } = useUtilisateurStatsQuery({ type });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
      <StatusBlock
        title={t("total_utilisateur")}
        total={data?.allUsers ?? 0}
        series={data?.allUsersSeries ?? []}
        iconWrapperClass="bg-primary/10"
        chartColor="#0ea5e9"
        icon={<User className="w-5 h-5 text-primary" />}
      />
      <StatusBlock
        title={t("utilisateur_actif")}
        total={data?.activeUsers ?? 0}
        series={data?.activeUsersSeries ?? []}
        iconWrapperClass="bg-success/10"
        chartColor="#10b981"
        icon={<CheckCircle className="w-5 h-5 text-success" />}
      />
      <StatusBlock
        title={t("utilisateur_inactif")}
        total={data?.inactiveUsers ?? 0}
        series={data?.inactiveUsersSeries ?? []}
        iconWrapperClass="bg-warning/10"
        chartColor="#facc15"
        icon={<PauseCircle className="w-5 h-5 text-warning" />}
      />
      <StatusBlock
        title={t("utilisateur_banni")}
        total={data?.bannedUsers ?? 0}
        series={data?.bannedUsersSeries ?? []}
        iconWrapperClass="bg-destructive/10"
        chartColor="#ef4444"
        icon={<Ban className="w-5 h-5 text-destructive" />}
      />
    </div>
  );
}
