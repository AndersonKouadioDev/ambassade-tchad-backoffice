import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, User, Hash, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  IPaiement,
  MethodePaiement,
} from "@/features/paiement/types/paiement.type";

interface PaymentSectionProps {
  payment?: IPaiement;
  amount: number;
}

const paymentMethodLabels = {
  [MethodePaiement.CASH]: "Espèces",
  [MethodePaiement.MOBILE_MONEY]: "Mobile Money",
  [MethodePaiement.BANK_TRANSFER]: "Virement bancaire",
  [MethodePaiement.CREDIT_CARD]: "Carte de crédit",
  [MethodePaiement.OTHER]: "Autre",
};

const paymentMethodColors = {
  [MethodePaiement.CASH]: "bg-green-100 text-green-700 border-green-200",
  [MethodePaiement.MOBILE_MONEY]: "bg-blue-100 text-blue-700 border-blue-200",
  [MethodePaiement.BANK_TRANSFER]:
    "bg-purple-100 text-purple-700 border-purple-200",
  [MethodePaiement.CREDIT_CARD]:
    "bg-indigo-100 text-indigo-700 border-indigo-200",
  [MethodePaiement.OTHER]: "bg-gray-100 text-gray-700 border-gray-200",
};

export function PaymentSection({ payment, amount }: PaymentSectionProps) {
  const isPaid = !!payment;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            Informations de paiement
          </CardTitle>
          <Badge
            className={
              isPaid
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
            }
          >
            {isPaid ? "Payé" : "En attente"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Amount information */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
            <div>
              <p className="text-sm text-muted-foreground">Montant à payer</p>
              <p className="text-2xl font-bold text-primary">
                {amount.toLocaleString()} FCFA
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-primary/60" />
          </div>

          {isPaid && payment ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Méthode de paiement
                    </span>
                  </div>
                  <Badge className={paymentMethodColors[payment.method]}>
                    {paymentMethodLabels[payment.method]}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Date de paiement
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    {format(new Date(payment.paymentDate), "PPP à HH:mm", {
                      locale: fr,
                    })}
                  </p>
                </div>

                {payment.transactionRef && (
                  <div className="space-y-3 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Référence de transaction
                      </span>
                    </div>
                    <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                      {payment.transactionRef}
                    </code>
                  </div>
                )}

                {payment.recordedBy && (
                  <div className="space-y-3 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Enregistré par
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {payment.recordedBy.firstName}{" "}
                      {payment.recordedBy.lastName}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-success">
                      ✓ Paiement confirmé
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Montant payé: {payment.amount.toLocaleString()} FCFA
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Voir le reçu
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-1">
                Paiement en attente
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Le paiement n&apos;est pas encore effectué pour cette demande.
              </p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Enregistrer le paiement
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
