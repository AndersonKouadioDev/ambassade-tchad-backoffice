import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Card, CardContent } from "@/components/ui/card";
import {
  ExpenseByCategory,
  MonthlyData,
} from "@/features/finance/rapport/types/rapport-financier.type";

const colors = {
  // Couleurs principales du thème
  primary: "hsl(220, 100%, 30%)", // --primary
  primaryLight: "hsl(220, 100%, 45%)", // --primary-500
  secondary: "hsl(10, 95%, 58%)", // --secondary
  tertiary: "hsl(63, 100%, 50%)", // --tertiary
  accent: "hsl(48, 100%, 50%)", // --accent

  // Couleurs d'état
  success: "hsl(154, 52%, 55%)", // --success
  warning: "hsl(48, 100%, 50%)", // --warning
  danger: "hsl(0, 84.2%, 60.2%)", // --destructive
  info: "hsl(220, 100%, 30%)", // --info

  // Couleurs neutres
  "default-50": "hsl(210, 40%, 98%)",
  "default-100": "hsl(210, 40%, 96.1%)",
  "default-200": "hsl(214.3, 31.8%, 91.4%)",
  "default-300": "hsl(212.7, 26.8%, 83.9%)",
  "default-400": "hsl(215, 20.2%, 65.1%)",
  "default-500": "hsl(215.4, 16.3%, 46.9%)",
  "default-600": "hsl(215.3, 19.3%, 34.5%)",
  "default-700": "hsl(215.3, 25%, 26.7%)",
  "default-800": "hsl(217.2, 32.6%, 17.5%)",
  "default-900": "hsl(222.2, 47.4%, 11.2%)",

  // Couleurs pour le mode sombre
  darkPrimary: "hsl(220, 100%, 45%)",
  darkBackground: "hsl(222.2, 47.4%, 11.2%)",
  darkCard: "hsl(215, 27.9%, 16.9%)",
  darkBorder: "hsl(217.2, 32.6%, 17.5%)",
  darkForeground: "hsl(210, 40%, 98%)",
};

// Palette de couleurs pour les graphiques avec bon contraste
const chartColors = {
  light: [
    colors.primary, // Bleu foncé - texte blanc
    colors.success, // Vert - texte blanc
    colors.secondary, // Rouge/orange - texte blanc
    "hsl(45, 90%, 35%)", // Jaune foncé - texte blanc
    colors.info, // Bleu info - texte blanc
    "hsl(280, 70%, 45%)", // Violet foncé - texte blanc
    "hsl(15, 85%, 45%)", // Orange foncé - texte blanc
    colors["default-600"], // Gris foncé - texte blanc
  ],
  dark: [
    colors.darkPrimary, // Bleu clair - texte blanc
    colors.success, // Vert - texte blanc
    colors.secondary, // Rouge/orange - texte blanc
    "hsl(48, 95%, 60%)", // Jaune plus saturé - texte noir
    "hsl(200, 90%, 60%)", // Bleu clair - texte blanc
    "hsl(280, 70%, 65%)", // Violet clair - texte blanc
    "hsl(15, 85%, 65%)", // Orange clair - texte blanc
    colors["default-300"], // Gris clair - texte noir
  ],
};

// Couleurs de texte correspondantes pour chaque couleur
const textColors = {
  light: [
    "#ffffff", // Blanc pour bleu foncé
    "#ffffff", // Blanc pour vert
    "#ffffff", // Blanc pour rouge/orange
    "#ffffff", // Blanc pour jaune foncé
    "#ffffff", // Blanc pour bleu info
    "#ffffff", // Blanc pour violet foncé
    "#ffffff", // Blanc pour orange foncé
    "#ffffff", // Blanc pour gris foncé
  ],
  dark: [
    "#ffffff", // Blanc pour bleu clair
    "#ffffff", // Blanc pour vert
    "#ffffff", // Blanc pour rouge/orange
    "#000000", // Noir pour jaune clair
    "#ffffff", // Blanc pour bleu clair
    "#ffffff", // Blanc pour violet clair
    "#ffffff", // Blanc pour orange clair
    "#000000", // Noir pour gris clair
  ],
};

interface ChartsProps {
  monthlyData: MonthlyData[];
  expensesByCategory: ExpenseByCategory[];
  theme?: "light" | "dark";
  isRtl?: boolean;
  currency?: string;
}

export const Charts: React.FC<ChartsProps> = ({
  monthlyData,
  expensesByCategory,
  theme = "light",
  isRtl = false,
  currency = "XOF",
}) => {
  // Configuration pour le graphique en barres
  const barChartSeries = [
    {
      name: "Revenus",
      data: monthlyData.map((item) => item.revenue),
      color: colors.success,
    },
    {
      name: "Dépenses",
      data: monthlyData.map((item) => item.expenses),
      color: colors.danger,
    },
  ];

  const barChartOptions: any = {
    chart: {
      toolbar: {
        show: false,
      },
      type: "bar",
      background: "transparent",
    },
    title: {
      text: "Revenus vs Dépenses",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 600,
        color:
          theme === "light" ? colors["default-600"] : colors.darkForeground,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [colors.success, colors.danger],
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
            theme === "light" ? colors["default-600"] : colors.darkForeground,
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
            theme === "light" ? colors["default-600"] : colors.darkForeground,
          fontSize: "12px",
        },
        formatter: function (value: number) {
          return value.toLocaleString() + " " + currency;
        },
      },
    },
    grid: {
      show: true,
      borderColor:
        theme === "light" ? colors["default-200"] : colors.darkBorder,
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
      theme: theme === "light" ? "light" : "dark",
      y: {
        formatter: function (value: number) {
          return value.toLocaleString() + " " + currency;
        },
      },
    },
    legend: {
      labels: {
        colors:
          theme === "light" ? colors["default-600"] : colors.darkForeground,
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
      background: "transparent",
    },
    title: {
      text: "Dépenses par catégorie",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 600,
        color:
          theme === "light" ? colors["default-600"] : colors.darkForeground,
      },
    },
    labels: expensesByCategory.map((item) => item.category),
    colors: theme === "light" ? chartColors.light : chartColors.dark,
    stroke: {
      width: 1,
      colors: [theme === "light" ? colors["default-100"] : colors.darkCard],
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontWeight: "600",
        colors: textColors[theme],
      },
      formatter: function (val: number, opts: any) {
        return val.toFixed(1) + "%";
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val: number, opts: any) {
          const categoryIndex = opts.dataPointIndex;
          const amount = expensesByCategory[categoryIndex].amount;
          return `${amount.toLocaleString()} ${currency} (${val.toFixed(1)}%)`;
        },
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors:
          theme === "light" ? colors["default-600"] : colors.darkForeground,
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
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="border-border bg-card">
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

      <Card className="border-border bg-card">
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
