"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { colors } from "@/lib/colors";
import { useTheme } from "next-themes";
import { IContentStats } from "@/features/statistique/types/statistique.type";

interface ContentChartProps {
  data: IContentStats;
  height?: number;
}

const ContentChart = ({ data, height = 373 }: ContentChartProps) => {
  const { theme: mode } = useTheme();

  const chartSeries = [data.news, data.events, data.photos, data.videos];

  const labels = ["Actualités", "Événements", "Photos", "Vidéos"];

  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    labels: labels,
    colors: [colors.primary, colors.info, colors.success, colors.warning],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
      y: {
        formatter: function (val: number) {
          return `${val}`;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return `${val.toFixed(1)}%`;
      },
    },
    legend: {
      show: true,
      position: "bottom",
      labels: {
        colors:
          mode === "light" ? colors["default-600"] : colors["default-300"],
      },
    },
    stroke: {
      show: false,
    },
  };
  if (chartSeries.some((value) => value > 0)) {
    return (
      <Chart
        options={options}
        series={chartSeries}
        type="pie"
        height={height}
        width={"100%"}
      />
    );
  } else {
    return null;
  }
};
export default ContentChart;
