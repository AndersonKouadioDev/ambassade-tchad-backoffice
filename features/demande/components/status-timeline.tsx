import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Package,
  User,
  FileCheck,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  IDemande,
  IHistoriqueStatutDemande,
  DemandeStatus,
} from "@/features/demande/types/demande.type";

interface StatusTimelineProps {
  currentStatus: DemandeStatus;
  statusHistory?: IHistoriqueStatutDemande[];
}

const statusConfig = {
  [DemandeStatus.NEW]: {
    label: "Nouveau",
    icon: Clock,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    variant: "secondary" as const,
  },
  [DemandeStatus.IN_REVIEW_DOCS]: {
    label: "Révision des documents",
    icon: FileCheck,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    variant: "warning" as const,
  },
  [DemandeStatus.PENDING_ADDITIONAL_INFO]: {
    label: "Informations supplémentaires requises",
    icon: AlertCircle,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    variant: "warning" as const,
  },
  [DemandeStatus.APPROVED_BY_AGENT]: {
    label: "Approuvé par l'agent",
    icon: User,
    color: "bg-green-100 text-green-700 border-green-200",
    variant: "success" as const,
  },
  [DemandeStatus.APPROVED_BY_CHEF]: {
    label: "Approuvé par le chef de service",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
    variant: "success" as const,
  },
  [DemandeStatus.APPROVED_BY_CONSUL]: {
    label: "Approuvé par le consul",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
    variant: "success" as const,
  },
  [DemandeStatus.REJECTED]: {
    label: "Rejeté",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200",
    variant: "destructive" as const,
  },
  [DemandeStatus.READY_FOR_PICKUP]: {
    label: "Prêt pour retrait",
    icon: Package,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    variant: "default" as const,
  },
  [DemandeStatus.DELIVERED]: {
    label: "Livré",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
    variant: "success" as const,
  },
  [DemandeStatus.ARCHIVED]: {
    label: "Archivé",
    icon: Calendar,
    color: "bg-gray-100 text-gray-700 border-gray-200",
    variant: "outline" as const,
  },
  [DemandeStatus.EXPIRED]: {
    label: "Expiré",
    icon: Clock,
    color: "bg-red-100 text-red-700 border-red-200",
    variant: "destructive" as const,
  },
  [DemandeStatus.RENEWAL_REQUESTED]: {
    label: "Renouvellement demandé",
    icon: AlertCircle,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    variant: "secondary" as const,
  },
};

export function StatusTimeline({
  currentStatus,
  statusHistory = [],
}: StatusTimelineProps) {
  const allStatuses = Object.values(DemandeStatus);
  const currentStatusIndex = allStatuses.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Suivi de la demande
        </h3>
        <Badge className={statusConfig[currentStatus].color}>
          {statusConfig[currentStatus].label}
        </Badge>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-border"></div>

        {/* Timeline items */}
        <div className="space-y-8">
          {statusHistory.map((history, index) => {
            const config = statusConfig[history.newStatus];
            const Icon = config.icon;
            const isCompleted = true;
            const isCurrent = history.newStatus === currentStatus;

            return (
              <div key={history.id} className="relative flex items-start">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary border-primary shadow-lg"
                      : "bg-background border-border"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isCompleted
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="ml-6 flex-1 pb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4
                        className={`font-medium ${
                          isCurrent ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {config.label}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(history.changedAt), "PPP à HH:mm", {
                          locale: fr,
                        })}
                      </p>
                      {history.changer && (
                        <p className="text-sm text-muted-foreground">
                          Par {history.changer.firstName}{" "}
                          {history.changer.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  {history.reason && (
                    <div className="mt-3 p-3 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground">
                        {history.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
