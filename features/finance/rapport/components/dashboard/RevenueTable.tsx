import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueByService } from "@/features/finance/rapport/types/rapport-financier.type";

interface RevenueTableProps {
  data: RevenueByService[];
}

export const RevenueTable: React.FC<RevenueTableProps> = ({ data }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(amount);
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Revenus par Type de Service</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type de Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Moyenne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  % du Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {item.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(item.amount / item.count)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {((item.amount / totalRevenue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/50">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  {formatCurrency(totalRevenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  {data.reduce((sum, item) => sum + item.count, 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  100.0%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
