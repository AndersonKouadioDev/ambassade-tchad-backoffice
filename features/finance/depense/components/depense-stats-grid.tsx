"use client";

import { StatusBlock } from "@/components/blocks/status-block";
import { DollarSign, TrendingUp, Tag, Calendar } from "lucide-react";
import { useDepenseStatsQuery } from "../queries/depense-stats.query";

export function DepensesStatsGrid() {
  const { data } = useDepenseStatsQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
      <StatusBlock
        title={"Total des dépenses"}
        total={data?.global?.totalExpenses ?? 0}
        series={[]}
        iconWrapperClass="bg-primary/10"
        chartColor="#0ea5e9"
        icon={<Calendar className="w-5 h-5 text-primary" />}
      />
      <StatusBlock
        title={"Montant total"}
        total={data?.global?.totalAmount ?? 0}
        series={[]}
        iconWrapperClass="bg-green-500/10"
        chartColor="#22c55e"
        icon={<DollarSign className="w-5 h-5 text-green-500" />}
      />
      <StatusBlock
        title={"Catégories actives"}
        total={data?.global?.activeCategories ?? 0}
        series={[]}
        iconWrapperClass="bg-purple-500/10"
        chartColor="#a855f7"
        icon={<Tag className="w-5 h-5 text-purple-500" />}
      />
      <StatusBlock
        title={"Catégories avec dépenses"}
        total={data?.global?.categoriesWithExpenses ?? 0}
        series={[]}
        iconWrapperClass="bg-orange-500/10"
        chartColor="#f97316"
        icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
      />
    </div>
  );
}
