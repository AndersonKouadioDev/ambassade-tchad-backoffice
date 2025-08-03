"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusTimeline } from "../status-timeline";
import { ServiceDetailsSection } from "../service-details-section";
import { DocumentsSection } from "../documents-section";
import { PaymentSection } from "../payment-section";
import { IDemande, DemandeStatus } from "@/features/demande/types/demande.type";
import {
  ArrowLeft,
  Edit,
  Download,
  Calendar,
  User,
  Hash,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DemandeDetailHeader } from "./demande-detail-header";
import { useGetDemandeByTicketAdminQuery } from "@/features/demande/queries/demande-detail.query";
import { DemandeDetailContent } from "./demande-detail-content";
import { DemandeDetailSidebar } from "./demande-detail-sidebar";

export function DemandeDetail({ ticket }: { ticket: string }) {
  const { data: demande, error } = useGetDemandeByTicketAdminQuery(ticket);

  if (error || !demande) {
    return (
      <div>Une erreur est survenue lors de la récupération de la demande</div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DemandeDetailHeader demande={demande} />
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <DemandeDetailContent demande={demande} />

          <DemandeDetailSidebar demande={demande} />
        </div>
      </div>
    </div>
  );
}
