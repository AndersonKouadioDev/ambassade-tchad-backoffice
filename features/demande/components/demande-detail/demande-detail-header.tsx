"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IDemande } from "@/features/demande/types/demande.type";
import { ArrowLeft, Clock } from "lucide-react";
import { getDemandeStatusLabel } from "../../utils/getDemandeStatusLabel";
import { useRouter } from "next/navigation";
import { getServiceTypeLabel } from "../../utils/getServiceTypeLabel";

interface DemandeDetailPageProps {
  demande: IDemande;
  setIsOpen: (open: boolean) => void;
}

export function DemandeDetailHeader({
  demande,
  setIsOpen,
}: DemandeDetailPageProps) {
  const router = useRouter();
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 shrink-0"
              onClick={() => router.push("/demande")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-2xl font-bold text-foreground truncate">
                Demande #{demande.ticketNumber}
              </h1>
              <p className="text-sm font-bold text-primary truncate">
                Type : {getServiceTypeLabel(demande.serviceType).label}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
            <Badge
              className={`${
                getDemandeStatusLabel(demande.status).style
              } whitespace-nowrap`}
            >
              {getDemandeStatusLabel(demande.status).label}
            </Badge>
            <Button
              size="sm"
              className="gap-2 flex-grow sm:flex-grow-0"
              onClick={() => setIsOpen(true)}
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Mettre à jour le statut</span>
              <span className="sm:hidden">Mettre à jour</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
