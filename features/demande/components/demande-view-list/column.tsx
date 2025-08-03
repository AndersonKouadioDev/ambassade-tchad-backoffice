import { ColumnDef } from "@tanstack/react-table";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { IDemande, DemandeStatus } from "../../types/demande.type";
import { ServiceType } from "@/features/service/types/service.type";

import { getDemandeStatusLabel } from "../../utils/getDemandeStatusLabel";
import { getServiceTypeLabel } from "../../utils/getServiceTypeLabel";

export type DataProps = IDemande;

export const columns: ColumnDef<DataProps>[] = [
  {
    accessorKey: "ticketNumber",
    header: "N° Ticket",
    cell: ({ row }) => {
      const demande = row.original;
      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm text-default-600">
            {demande.ticketNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "user.firstName",
    header: "Demandeur",
    cell: ({ row }) => {
      const demande = row.original;
      const user = demande.user;

      if (!user) {
        return <span className="text-sm text-muted-foreground">N/A</span>;
      }

      return (
        <div className="flex gap-3 items-center font-medium text-card-foreground/80">
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              {user.firstName ? user.firstName.charAt(0) : ""}
              {user.lastName ? user.lastName.charAt(0) : ""}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-default-600">{`${user.firstName} ${user.lastName}`}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "contactPhoneNumber",
    header: "Téléphone Contact",
    cell: ({ row }) => <span>{row.getValue("contactPhoneNumber")}</span>,
  },
  {
    accessorKey: "serviceType",
    header: "Type de Service",
    cell: ({ row }) => {
      const serviceType = row.getValue<ServiceType>("serviceType");
      const { label: serviceTypeName, style: serviceTypeStyle } =
        getServiceTypeLabel(serviceType);

      return (
        <Badge
          className={cn(
            "rounded-full px-4 py-1 text-xs capitalize",
            serviceTypeStyle
          )}
        >
          {serviceTypeName}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue<DemandeStatus>("status");
      const { label: statusName, style: statusStyle } =
        getDemandeStatusLabel(status);

      return (
        <Badge
          className={cn(
            "rounded-full px-4 py-1 text-xs capitalize",
            statusStyle
          )}
        >
          {statusName}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount");
      return (
        <span>
          {amount.toLocaleString("fr-FR", {
            style: "currency",
            currency: "XOF",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "submissionDate",
    header: "Date de Soumission",
    cell: ({ row }) => {
      const submissionDate = new Date(row.getValue<string>("submissionDate"));
      return <span>{submissionDate.toLocaleDateString("fr-FR")}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const demande = row.original as DataProps;
      const meta = table.options.meta as {
        onView: (demande: DataProps) => void;
        onUpdateStatus: (demande: DataProps) => void;
        onDelete: (demande: DataProps) => void;
      };

      return (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => meta.onView(demande)}
                  className="w-7 h-7"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voir Détails</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {![
            DemandeStatus.DELIVERED,
            DemandeStatus.ARCHIVED,
            DemandeStatus.EXPIRED,
            DemandeStatus.REJECTED,
          ].includes(demande.status) && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => meta.onUpdateStatus(demande)}
                      className="w-7 h-7"
                    >
                      <SquarePen className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mettre à Jour Statut</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => meta.onDelete(demande)}
                      className="w-7 h-7"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Supprimer</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      );
    },
  },
];
