"use client";
import React, { useState, useMemo } from "react";
import { PeriodFilters } from "./PeriodFilters";
import { KPICards } from "./KPICards";
import { Charts } from "./Charts";
import { RevenueTable } from "./RevenueTable";
import { TransactionLog } from "./TransactionLog";
import { FilterOptions, KPIData } from "./types";
import {
  transactions,
  revenueByService,
  expensesByCategory,
  monthlyData,
} from "./mockData";

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    period: "year",
    year: 2024,
  });

  const kpiData: KPIData = useMemo(() => {
    const totalRevenue = revenueByService.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const totalExpenses = expensesByCategory.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const surplusDeficit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      surplusDeficit,
    };
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <PeriodFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* KPI Cards */}
      <KPICards data={kpiData} />

      {/* Charts */}
      <Charts
        monthlyData={monthlyData}
        expensesByCategory={expensesByCategory}
      />

      {/* Revenue Table */}
      <RevenueTable data={revenueByService} />

      {/* Transaction Log */}
      <TransactionLog transactions={transactions} />
    </div>
  );
};
