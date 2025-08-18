import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { KPIData } from "@/features/finance/rapport/types/rapport-financier.type";
import { StatusBlock } from "@/components/blocks/status-block";

interface KPICardsProps {
  data: KPIData;
  isLoading: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ data, isLoading }) => {
  const { totalRevenue, totalExpenses, surplusDeficit } = data;
  const isPositive = surplusDeficit >= 0;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(Math.abs(amount));
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatusBlock
        title="Total Revenue"
        total={formatCurrency(totalRevenue)}
        iconWrapperClass="bg-green-100 dark:bg-green-900/30"
        chartColor="#10B981"
        icon={<TrendingUp className="h-6 w-6 text-green-600" />}
      />
      <StatusBlock
        title="Total Dépenses"
        total={formatCurrency(totalExpenses)}
        iconWrapperClass="bg-red-100 dark:bg-red-900/30"
        chartColor="#FB923C"
        icon={<DollarSign className="h-6 w-6 text-red-600" />}
      />
      <StatusBlock
        title={isPositive ? "Surplus" : "Deficit"}
        total={formatCurrency(surplusDeficit)}
        iconWrapperClass="bg-blue-100 dark:bg-blue-900/30"
        chartColor={isPositive ? "#10B981" : "#FB923C"}
        icon={
          isPositive ? (
            <TrendingUp
              className={`h-6 w-6 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            />
          ) : (
            <TrendingDown className="h-6 w-6 text-red-600" />
          )
        }
      />
    </div>
  );
};
