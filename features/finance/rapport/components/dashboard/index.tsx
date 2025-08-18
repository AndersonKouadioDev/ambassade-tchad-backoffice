"use client";

import React from "react";
import { PeriodFilters } from "./PeriodFilters";
import { KPICards } from "./KPICards";
import { Charts } from "./Charts";
import { RevenueTable } from "./RevenueTable";
import { TransactionLog } from "./TransactionLog";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { useFinancialReport } from "@/features/finance/rapport/hooks/use-financial-report-dashboard";

export const Dashboard: React.FC = () => {
  const {
    data,
    kpiData,
    isLoading,
    isError,
    error,
    filters,
    handleFilterChange,
  } = useFinancialReport();

  if (isError) {
    return (
      <Alert variant="outline">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Erreur lors du chargement des données</AlertTitle>
        <AlertDescription>
          {error?.message ||
            "Une erreur inattendue est survenue. Veuillez réessayer."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <PeriodFilters filters={filters} onFilterChange={handleFilterChange} />
      <KPICards data={kpiData} isLoading={isLoading} />
      {data && (
        <>
          <Charts
            monthlyData={data.monthlyData || []}
            expensesByCategory={data.expensesByCategory || []}
          />
          <RevenueTable data={data.revenueByService || []} />
          <TransactionLog transactions={data.transactions || []} />
        </>
      )}
    </div>
  );
};
