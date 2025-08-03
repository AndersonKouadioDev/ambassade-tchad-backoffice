"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusTimeline } from "../status-timeline";
import { IDemande, DemandeStatus } from "@/features/demande/types/demande.type";
import { Edit, Download, Clock } from "lucide-react";

export function DemandeDetailSidebar({ demande }: { demande: IDemande }) {
  return (
    <div className="space-y-8">
      {/* Status Timeline */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <StatusTimeline
            currentStatus={demande.status}
            statusHistory={demande.statusHistory}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full gap-2">
            <Clock className="h-4 w-4" />
            Mettre à jour le statut
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Télécharger le dossier
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Edit className="h-4 w-4" />
            Modifier la demande
          </Button>
        </CardContent>
      </Card>

      {/* Progress indicator */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>État actuel</span>
              <span className="font-medium">
                {demande.status === DemandeStatus.DELIVERED
                  ? "100%"
                  : demande.status === DemandeStatus.READY_FOR_PICKUP
                  ? "90%"
                  : demande.status === DemandeStatus.APPROVED_BY_CONSUL
                  ? "80%"
                  : demande.status === DemandeStatus.APPROVED_BY_CHEF
                  ? "70%"
                  : demande.status === DemandeStatus.APPROVED_BY_AGENT
                  ? "60%"
                  : demande.status === DemandeStatus.IN_REVIEW_DOCS
                  ? "40%"
                  : demande.status === DemandeStatus.NEW
                  ? "20%"
                  : "0%"}
              </span>
            </div>
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{
                  width:
                    demande.status === DemandeStatus.DELIVERED
                      ? "100%"
                      : demande.status === DemandeStatus.READY_FOR_PICKUP
                      ? "90%"
                      : demande.status === DemandeStatus.APPROVED_BY_CONSUL
                      ? "80%"
                      : demande.status === DemandeStatus.APPROVED_BY_CHEF
                      ? "70%"
                      : demande.status === DemandeStatus.APPROVED_BY_AGENT
                      ? "60%"
                      : demande.status === DemandeStatus.IN_REVIEW_DOCS
                      ? "40%"
                      : demande.status === DemandeStatus.NEW
                      ? "20%"
                      : "0%",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {demande.status === DemandeStatus.DELIVERED
                ? "Demande terminée avec succès"
                : demande.status === DemandeStatus.READY_FOR_PICKUP
                ? "Prêt pour le retrait"
                : demande.status === DemandeStatus.APPROVED_BY_CONSUL
                ? "En attente de finalisation"
                : "Demande en cours de traitement"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
