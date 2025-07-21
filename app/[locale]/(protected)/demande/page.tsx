"use client";

import { StatusBlock } from "@/components/blocks/status-block";
import DemandedList from "@/components/demande/demande-list";
import { Clock, CheckCircle2, XCircle, Archive, FileText, AlertTriangle, Package, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDemandeStats } from "@/hooks/use-demandes";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserLispage() {
  const t = useTranslations("gestionDemande");
  const { data: stats, isLoading } = useDemandeStats();

  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold">{t("title")}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {isLoading ? (
              // Skeleton loading pour les cartes de statistiques
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-11 w-31" />
                  </div>
                </div>
              ))
            ) : (
              <>
                <StatusBlock
                  title="Total"
                  total={stats?.total || 0}
                  iconWrapperClass="bg-blue-100"
                  chartColor="#3b82f6"
                  icon={<FileText className="w-5 h-5 text-blue-600" />}
                />
                <StatusBlock
                  title={t("pending")}
                  total={stats?.NOUVELLE || 0}
                  iconWrapperClass="bg-warning/10"
                  chartColor="#fbbf24"
                  icon={<Clock className="w-5 h-5 text-warning" />}
                />
                <StatusBlock
                  title={t("approved")}
                  total={(stats?.APPROUVEE_AGENT || 0) + (stats?.APPROUVEE_CHEF || 0) + (stats?.APPROUVEE_CONSUL || 0)}
                  iconWrapperClass="bg-success/10"
                  chartColor="#10b981"
                  icon={<CheckCircle2 className="w-5 h-5 text-success" />}
                />
                <StatusBlock
                  title={t("rejected")}
                  total={stats?.REJETEE || 0}
                  icon={<XCircle className="w-5 h-5 text-destructive" />}
                  iconWrapperClass="bg-destructive/10"
                  chartColor="#ef4444"
                />
                <StatusBlock
                  title="En révision"
                  total={stats?.EN_REVISION || 0}
                  iconWrapperClass="bg-orange-100"
                  chartColor="#f97316"
                  icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
                />
                <StatusBlock
                  title="Prêtes pour retrait"
                  total={stats?.PRETE_POUR_RETRAIT || 0}
                  iconWrapperClass="bg-purple-100"
                  chartColor="#8b5cf6"
                  icon={<Package className="w-5 h-5 text-purple-600" />}
                />
                <StatusBlock
                  title={t("archived")}
                  total={stats?.ARCHIVEE || 0}
                  icon={<Archive className="w-5 h-5 text-muted-foreground" />}
                  iconWrapperClass="bg-muted/10"
                  chartColor="#9ca3af"
                />
                <StatusBlock
                  title="Renouvellement"
                  total={stats?.RENOUVELLEMENT_DEMANDE || 0}
                  iconWrapperClass="bg-cyan-100"
                  chartColor="#06b6d4"
                  icon={<RotateCcw className="w-5 h-5 text-cyan-600" />}
                />
              </>
            )}
          </div>
        </div>

        <div className="col-span-12">
          <DemandedList />
        </div>
      </div>
    </div>
  );
}
