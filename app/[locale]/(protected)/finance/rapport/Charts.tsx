import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Card, CardContent } from "@/components/ui/card";
import { MonthlyData, ExpenseByCategory } from "./types";

// Vous devrez créer ces fichiers utilitaires ou adapter selon votre projet
const colors = {
  primary: "#3b82f6",
  info: "#06b6d4",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  secondary: "#8b5cf6",
  "default-600": "#4b5563",
  "default-300": "#d1d5db",
};

interface ChartsProps {
  monthlyData: MonthlyData[];
  expensesByCategory: ExpenseByCategory[];
  theme?: "light" | "dark";
  isRtl?: boolean;
}

export const Charts: React.FC<ChartsProps> = ({
  monthlyData,
  expensesByCategory,
  theme = "light",
  isRtl = false,
}) => {
  // Configuration pour le graphique en barres
  const barChartSeries = [
    {
      name: "Revenue",
      data: monthlyData.map((item) => item.revenue),
      color: "rgba(34, 197, 94, 0.8)",
    },
    {
      name: "Expenses",
      data: monthlyData.map((item) => item.expenses),
      color: "rgba(239, 68, 68, 0.8)",
    },
  ];

  const barChartOptions: any = {
    chart: {
      toolbar: {
        show: false,
      },
      type: "bar",
    },
    title: {
      text: "Monthly Revenue vs Expenses",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 600,
        color:
          theme === "light" ? colors["default-600"] : colors["default-300"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: monthlyData.map((item) => item.month),
      labels: {
        style: {
          colors:
            theme === "light" ? colors["default-600"] : colors["default-300"],
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      beginAtZero: true,
      labels: {
        style: {
          colors:
            theme === "light" ? colors["default-600"] : colors["default-300"],
          fontSize: "12px",
        },
        formatter: function (value: number) {
          return "$" + value.toLocaleString();
        },
      },
    },
    grid: {
      show: true,
      borderColor: theme === "light" ? "#e5e7eb" : "#374151",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      y: {
        formatter: function (value: number) {
          return "$" + value.toLocaleString();
        },
      },
    },
    legend: {
      labels: {
        colors:
          theme === "light" ? colors["default-600"] : colors["default-300"],
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        offsetX: isRtl ? 5 : -5,
      },
    },
  };

  // Configuration pour le graphique en secteurs (pie chart)
  const pieChartSeries = expensesByCategory.map((item) => item.percentage);

  const pieChartOptions: any = {
    chart: {
      toolbar: {
        show: false,
      },
      type: "pie",
    },
    title: {
      text: "Expense Breakdown by Category",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 600,
        color:
          theme === "light" ? colors["default-600"] : colors["default-300"],
      },
    },
    labels: expensesByCategory.map((item) => item.category),
    colors: [
      "rgba(59, 130, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 101, 101, 0.8)",
      "rgba(251, 191, 36, 0.8)",
      "rgba(139, 92, 246, 0.8)",
      "rgba(236, 72, 153, 0.8)",
      "rgba(156, 163, 175, 0.8)",
    ],
    stroke: {
      width: 1,
      colors: [
        "rgba(59, 130, 246, 1)",
        "rgba(16, 185, 129, 1)",
        "rgba(245, 101, 101, 1)",
        "rgba(251, 191, 36, 1)",
        "rgba(139, 92, 246, 1)",
        "rgba(236, 72, 153, 1)",
        "rgba(156, 163, 175, 1)",
      ],
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        colors: ["#fff"],
      },
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
    },
    tooltip: {
      theme: theme === "dark" ? "dark" : "light",
      y: {
        formatter: function (val: number, opts: any) {
          const categoryIndex = opts.dataPointIndex;
          const amount = expensesByCategory[categoryIndex].amount;
          return `$${amount.toLocaleString()} (${val.toFixed(1)}%)`;
        },
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors:
          theme === "light" ? colors["default-600"] : colors["default-300"],
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        offsetX: isRtl ? 5 : -5,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="h-80">
            <Chart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height="100%"
              width="100%"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="h-80">
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
              height="100%"
              width="100%"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
