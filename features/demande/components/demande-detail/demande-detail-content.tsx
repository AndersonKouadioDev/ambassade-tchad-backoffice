"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceDetailsSection } from "../service-details-section";
import { DocumentsSection } from "../documents-section";
import { PaymentSection } from "../payment-section";
import { IDemande } from "@/features/demande/types/demande.type";
import { Calendar, User, Hash, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function DemandeDetailContent({ demande }: { demande: IDemande }) {
  return (
    <div className="lg:col-span-2 space-y-8">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
            <Hash className="h-6 w-6 text-primary" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Numéro de ticket */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Numéro de ticket</span>
              </div>
              <p className="text-base sm:text-lg font-mono bg-muted px-3 py-2 rounded break-all">
                {demande.ticketNumber}
              </p>
            </div>

            {/* Date de soumission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Date de soumission</span>
              </div>
              <p className="text-sm text-foreground">
                {format(new Date(demande.submissionDate), "PPP à HH:mm", {
                  locale: fr,
                })}
              </p>
            </div>

            {/* Demandeur */}
            {demande.user && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Demandeur</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {demande.user.firstName} {demande.user.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground break-all">
                      {demande.user.email}
                    </p>
                  </div>
                  {demande.user.phoneNumber && (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                        {demande.user.phoneNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact de la demande */}
            {demande.contactPhoneNumber && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Contact de la demande
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {demande.contactPhoneNumber}
                </p>
              </div>
            )}

            {/* Completion Date */}
            {demande.completionDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Date de completion
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  {format(new Date(demande.completionDate), "PPP à HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
            )}

            {/* Issued Date */}
            {demande.issuedDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Date d&apos;émission
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  {format(new Date(demande.issuedDate), "PPP à HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Détails du service</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payment">Paiement</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <ServiceDetailsSection demande={demande} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentsSection documents={demande.documents} />
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <PaymentSection payment={demande.payment} amount={demande.amount} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
