import React from "react";
import { format } from "date-fns";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/features/finance/rapport/types/rapport-financier.type";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";

interface TransactionLogProps {
  transactions: Transaction[];
}

export const TransactionLog: React.FC<TransactionLogProps> = ({
  transactions,
}) => {

  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "revenue"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.type === "revenue" ? (
                    <ArrowUpCircle className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm font-semibold ${
                  transaction.type === "revenue"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "revenue" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="link">Voir toutes les transactions</Button>
        </div>
      </CardContent>
    </Card>
  );
};
