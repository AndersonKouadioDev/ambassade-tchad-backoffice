"use client";

import { StatusBlock } from "@/components/blocks/status-block";
import { User, CheckCircle, PauseCircle, Ban } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGlobalDemandeStatsQuery } from "../queries/demande-stats.query";
import { DemandeStatus } from "../types/demande.type";

export function DemandeStatsGrid() {
  const t = useTranslations("gestionDemande");
  const { data } = useGlobalDemandeStatsQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
       <StatusBlock
        title={t("allStatus")}
        total={data?.total ?? 0}
        // series={data?.archivedSeries ?? []}
        iconWrapperClass="bg-destructive/10"
        chartColor="#ef4444"
        icon={<Ban className="w-5 h-5 text-destructive" />}
      />
      <StatusBlock
        title={t("pending")}
        total={data?.byStatus?.[DemandeStatus.NEW] ?? 0}
        // series={data?.pendingSeries ?? []}
        iconWrapperClass="bg-primary/10"
        chartColor="#0ea5e9"
        icon={<User className="w-5 h-5 text-primary" />}
      />
      <StatusBlock
        title={t("approved")}
        total={data?.byStatus?.[DemandeStatus.APPROVED_BY_AGENT] ?? 0}
        // series={data?.approvedSeries ?? []}
        iconWrapperClass="bg-success/10"
        chartColor="#10b981"
        icon={<CheckCircle className="w-5 h-5 text-success" />}
      />
      <StatusBlock
        title={t("rejected")}
        total={data?.byStatus?.[DemandeStatus.REJECTED] ?? 0}
        // series={data?.rejectedSeries ?? []}
        iconWrapperClass="bg-warning/10"
        chartColor="#facc15"
        icon={<PauseCircle className="w-5 h-5 text-warning" />}
      />
     
    </div>
  );
}
