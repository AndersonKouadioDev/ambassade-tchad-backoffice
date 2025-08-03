"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IDemande } from "@/features/demande/types/demande.type";
import { ArrowLeft, Edit, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getDemandeStatusLabel } from "../../utils/getDemandeStatusLabel";
import { useRouter } from "next/navigation";

interface DemandeDetailPageProps {
  demande: IDemande;
}

export function DemandeDetailHeader({ demande }: DemandeDetailPageProps) {
  const router = useRouter();
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => router.push("/demande")}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Demande #{demande.ticketNumber}
              </h1>
              <p className="text-sm text-muted-foreground">
                Créée le{" "}
                {format(new Date(demande.submissionDate), "PPP", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getDemandeStatusLabel(demande.status).style}>
              {getDemandeStatusLabel(demande.status).label}
            </Badge>
            <Button size="sm" variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
            <Button size="sm" className="gap-2">
              <Clock className="h-4 w-4" />
              Mettre à jour le statut
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
