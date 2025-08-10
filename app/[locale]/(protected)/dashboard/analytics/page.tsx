"use client";
import { StatusBlock } from "@/components/blocks/status-block";
import TransactionsTable from "./components/transactions";
import { Box, DollarSign, TrendingUp, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewRadialChart from "./components/overview-radial";
import DashboardDropdown from "@/components/dashboard-dropdown";
import TeamTable from "@/components/project/team-table";
import { teamData } from "./data";
import RecentActivity from "./components/recent-activity";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { baseURL } from "@/config";

const DashboardPage = () => {
  const t = useTranslations("AnalyticsDashboard");
  const tm = useTranslations("ProjectDashboard");
  const session = useSession();

  console.log({ session });
  console.log({ baseURL });

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        <StatusBlock
          title={t("revenue_chart_title")}
          total="$3,564"
          iconWrapperClass="bg-success/10"
          chartColor="#10B981"
          icon={<DollarSign className="w-5 h-5 text-success" />}
        />
        <StatusBlock
          title={t("sold_chart_title")}
          total="564"
          iconWrapperClass="bg-warning/10"
          chartColor="#F59E0B"
          icon={<Box className="w-5 h-5 text-warning" />}
        />
        <StatusBlock
          title={t("growth_chart_title")}
          total="+5.0%"
          iconWrapperClass="bg-primary/10"
          chartColor="#3B82F6"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
        />
        <StatusBlock
          title={t("sold_chart_title")}
          total="150"
          iconWrapperClass="bg-muted/10"
          chartColor="#6366F1"
          icon={<LineChart className="w-5 h-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-12 gap-5 mt-10">
        <div className="lg:col-span-8 col-span-12">
          <Card>
            <CardContent className="px-0">
              <TransactionsTable />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 col-span-12">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">
                {t("overview_circle_chart_title")}
              </CardTitle>
              <DashboardDropdown />
            </CardHeader>
            <CardContent>
              <OverviewRadialChart />
              <div className="bg-default-50 rounded p-4 mt-8 flex justify-between flex-wrap gap-4">
                {[1, 2, 3].map((_, i) => (
                  <div className="space-y-1" key={i}>
                    <h4 className="text-default-600 text-xs font-normal">
                      {t("invested_amount")}
                    </h4>
                    <div className="text-sm font-medium text-default-900">
                      $8264.35
                    </div>
                    {i === 0 && (
                      <div className="text-default-500 text-xs font-normal">
                        +0.001.23 (0.2%)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4 lg:col-span-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{tm("team_members")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TeamTable data={teamData} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 col-span-12">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">
                {t("recent_activity_table_title")}
              </CardTitle>
              <DashboardDropdown />
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
