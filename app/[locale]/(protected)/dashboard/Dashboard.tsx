"use client";
import { useState, useMemo } from "react";
import { StatusBlock } from "@/components/blocks/status-block";
import { DollarSign, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardDropdown from "@/components/dashboard-dropdown";
import { useTranslations } from "next-intl";
import { useStatistiqueQuery } from "@/features/statistique/queries/statistiques.query";
import DateRangePicker from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import HistoriqueStatusTable from "@/features/statistique/components/historique-status-table";
import PersonnelTable from "@/features/statistique/components/personnel-table";
import DemandeursTable from "@/features/statistique/components/demandeur-table";
import ContentChart from "@/features/statistique/components/content-chart";

export function Dashboard() {
  const t = useTranslations("AnalyticsDashboard");
  const tm = useTranslations("ProjectDashboard");

  // Initialiser les dates une seule fois pour éviter les re-créations
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1),
      to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    };
  });

  // Mémoriser les paramètres de la query pour éviter les re-renders
  const queryParams = useMemo(
    () => ({
      fromDate: range?.from?.toISOString(),
      toDate: range?.to?.toISOString(),
    }),
    [range?.from, range?.to]
  );

  const { data } = useStatistiqueQuery(queryParams);

  return (
    <div className="container">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="text-2xl font-medium text-default-800 capitalize">
          {t("title")}
        </div>
        <DateRangePicker
          range={range}
          onRangeChange={(newRange) => setRange(newRange)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        <StatusBlock
          title={t("total_requests")}
          total={data?.totalRequests.toString() || "0"}
          iconWrapperClass="bg-success/10"
          chartColor="#10B981"
          icon={<TrendingUp className="w-5 h-5 text-success" />}
        />
        <StatusBlock
          title={t("total_expenses")}
          total={data?.totalExpenses.toString() || "0"}
          iconWrapperClass="bg-warning/10"
          chartColor="#F59E0B"
          icon={<DollarSign className="w-5 h-5 text-warning" />}
        />
        <StatusBlock
          title={t("personnel_count")}
          total={data?.personnelCount?.toString() || "0"}
          iconWrapperClass="bg-primary/10"
          chartColor="#3B82F6"
          icon={<User className="w-5 h-5 text-primary" />}
        />
        <StatusBlock
          title={t("demandeur_count")}
          total={data?.demandeurCount?.toString() || "0"}
          iconWrapperClass="bg-muted/10"
          chartColor="#6366F1"
          icon={<User className="w-5 h-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-12 gap-5 mt-10">
        <div className="lg:col-span-8 col-span-12 flex">
          <Card className="flex-1 flex flex-col">
            <CardContent className="px-0 flex-1 flex flex-col">
              <HistoriqueStatusTable data={data?.recentStatusHistory || []} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 col-span-12 flex">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">{t("media_content")}</CardTitle>
              <DashboardDropdown />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ContentChart
                data={
                  data?.contentStats || {
                    news: 0,
                    events: 0,
                    photos: 0,
                    videos: 0,
                  }
                }
              />
              <div className="bg-default-50 rounded p-4 mt-8 flex justify-between flex-wrap gap-4">
                {data?.contentStats &&
                  Object.entries(data.contentStats).map(([key, value]) => (
                    <div className="space-y-1" key={key}>
                      <h4 className="text-default-600 text-xs font-normal">
                        {t(key)}
                      </h4>
                      <div className="text-sm font-medium text-default-900">
                        {value}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4 lg:col-span-8 flex">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{tm("team_members")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <PersonnelTable data={data?.recentPersonnel || []} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 col-span-12 flex">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">{tm("demandeurs")}</CardTitle>
              <DashboardDropdown />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <DemandeursTable data={data?.recentDemandeurs || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
