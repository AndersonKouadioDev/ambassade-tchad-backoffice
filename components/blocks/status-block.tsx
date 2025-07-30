"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
  formatSeriesForChart,
  generateChartOptions,
  type SeriesData,
  type PeriodType,
} from "@/utils/chart.utils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StatusBlockProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  total?: number | string;
  series?: SeriesData[];
  chartColor?: string;
  iconWrapperClass?: string;
  chartType?: "area" | "bar" | "line" | "pie" | "donut" | "radialBar";
  opacity?: number;
  period?: PeriodType;
}

const StatusBlock = ({
  title,
  total,
  className,
  icon,
  series = [{ date: "", value: 0 }],
  chartColor = "#0ce7fa",
  iconWrapperClass,
  chartType = "area",
  opacity = 0.1,
  period = "month",
}: StatusBlockProps) => {
  const { theme: mode } = useTheme();

  // Utiliser les fonctions utilitaires
  const chartSeries = formatSeriesForChart(series);
  const options = generateChartOptions(
    chartColor,
    mode,
    series,
    period,
    opacity
  );

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        {/* Top: Icon + Title */}
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center text-2xl bg-default/10",
                iconWrapperClass
              )}
            >
              {icon}
            </div>
          )}
          {title && <div className="text-base font-semibold">{title}</div>}
        </div>

        {/* Bottom: Total + Chart */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-700">{total}</div>
          <div className="max-w-[124px]">
            <Chart
              options={options}
              series={chartSeries}
              type={chartType}
              height={45}
              width={124}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { StatusBlock };
