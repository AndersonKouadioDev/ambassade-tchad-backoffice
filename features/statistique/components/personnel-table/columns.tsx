"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IRecentPersonnel } from "@/features/statistique/types/statistique.type";
import {
  UtilisateurRole,
  UtilisateurStatus,
} from "@/features/utilisateur/types/utilisateur.type";
import { getUtilisateurRole } from "@/features/utilisateur/utils/getUtilisateurRole";

export const columns: ColumnDef<IRecentPersonnel>[] = [
  {
    accessorKey: "firstName",
    header: "Nom et Prénom",
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-default-600 whitespace-nowrap">
              {fullName || "Utilisateur Inconnu"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      // The role is a number from the enum, so we convert it to string
      const role = row.getValue<UtilisateurRole>("role");
      // Map numeric role to string for display and color
      const roleName = getUtilisateurRole(role) || "Inconnu";

      const statusColors: Record<string, string> = {
        [UtilisateurRole.ADMIN]:
          "bg-green-100 text-green-600 hover:bg-green-200",
        [UtilisateurRole.CHEF_SERVICE]:
          "bg-purple-100 text-purple-700 hover:bg-purple-200",
        [UtilisateurRole.CONSUL]: "bg-blue-100 text-blue-600 hover:bg-blue-200",
        [UtilisateurRole.AGENT]:
          "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        default: "bg-muted text-muted-foreground hover:bg-muted/80",
      };

      const roleStyles = statusColors[role] || statusColors.default;

      return (
        <Badge
          className={cn(
            "rounded-full px-4 py-1 text-xs capitalize",
            roleStyles
          )}
        >
          {roleName} {/* Display friendly name */}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue<UtilisateurStatus>("status");
      const statusName =
        status === UtilisateurStatus.ACTIVE
          ? "actif"
          : status === UtilisateurStatus.INACTIVE
          ? "verrouillé"
          : status === UtilisateurStatus.DELETED
          ? "banni"
          : "inconnu";

      const statusColors: Record<string, string> = {
        actif: "bg-green-100 text-green-600 hover:bg-green-200",
        verrouillé: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
        banni: "bg-red-100 text-red-600 hover:bg-red-200",
        default: "bg-muted text-muted-foreground hover:bg-muted/80",
      };

      const statusStyles = statusColors[statusName] || statusColors.default;

      return (
        <Badge
          className={cn(
            "rounded-full px-4 py-1 text-xs capitalize",
            statusStyles
          )}
        >
          {statusName}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date de Création",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
];
