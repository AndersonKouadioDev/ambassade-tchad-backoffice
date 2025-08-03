"use client";

import React from "react";

import { DemandeDetailHeader } from "./demande-detail-header";
import { useGetDemandeByTicketAdminQuery } from "@/features/demande/queries/demande-detail.query";
import { DemandeDetailContent } from "./demande-detail-content";
import { DemandeDetailSidebar } from "./demande-detail-sidebar";
import { DemandeUpdateStatusModal } from "../demande-modal/demande-update-status-modal";

export function DemandeDetail({ ticket }: { ticket: string }) {
  const { data: demande, error } = useGetDemandeByTicketAdminQuery(ticket);

  const [isOpen, setIsOpen] = React.useState(false);

  if (error || !demande) {
    return (
      <div>Une erreur est survenue lors de la récupération de la demande</div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DemandeDetailHeader demande={demande} setIsOpen={setIsOpen} />
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <DemandeDetailContent demande={demande} />

          <DemandeDetailSidebar demande={demande} setIsOpen={setIsOpen} />
          <DemandeUpdateStatusModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            demande={demande}
          />
        </div>
      </div>
    </div>
  );
}
