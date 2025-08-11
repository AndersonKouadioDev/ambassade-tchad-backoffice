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
          <Avatar className="w-8 h-8 border border-default-600">
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
      const { label, style } = getServiceTypeLabel(serviceType);

      return (
        <Badge className={cn("text-xs text-center capitalize", style)}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue<DemandeStatus>("status");
      const { label, style } = getDemandeStatusLabel(status);

      return (
        <Badge className={cn("text-xs text-center capitalize", style)}>
          {label}
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
      };

      return (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => meta.onView(demande)}>
            <SquarePen className="mr-2 h-4 w-4" />
            Traiter
          </Button>
        </div>
      );
    },
  },
];
