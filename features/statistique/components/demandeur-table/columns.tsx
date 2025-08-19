"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IRecentDemandeurs } from "@/features/statistique/types/statistique.type";

export const columns: ColumnDef<IRecentDemandeurs>[] = [
  {
    accessorKey: "personName",
    header: "Nom et Prénom",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-default-600 whitespace-nowrap">
              {fullName || "Demandeur Inconnu"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date d'enregistrement",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
];
