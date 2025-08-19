"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IRecentStatusHistory } from "@/features/statistique/types/statistique.type";
import { DemandeStatus } from "@/features/demande/types/demande.type";
import { getDemandeStatusLabel } from "@/features/demande/utils/getDemandeStatusLabel";
import { ServiceType } from "@/features/service/types/service.type";
import { getServiceTypeLabel } from "@/features/demande/utils/getServiceTypeLabel";

export const columns: ColumnDef<IRecentStatusHistory>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-center capitalize">
        {new Date(row.original.date).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "personName",
    header: "User",
    cell: ({ row }) => {
      const personName = row.original.personName;
      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm text-default-600 whitespace-nowrap">
            {personName ?? "Unknown User"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "serviceType",
    header: "Service Type",
    cell: ({ row }) => {
      const serviceType = row.getValue<ServiceType>("serviceType");
      const { label, style } = getServiceTypeLabel(serviceType);

      return (
        <p className={cn("text-xs text-center capitalize")}>
          <Badge className={cn("text-xs text-center capitalize", style)}>
            {label}
          </Badge>
          <p>{row.original.ticketNumber}</p>
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
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
    header: "Amount",
    cell: ({ row }) => {
      return <span>{row.original.amount}</span>;
    },
  },
];
