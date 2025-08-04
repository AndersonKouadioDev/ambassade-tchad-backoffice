import { ColumnDef } from "@tanstack/react-table";
import { Lock, LockOpen, SquarePen, Trash2 } from "lucide-react";
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

// Import IUtilisateur and UtilisateurRole from your types
import {
  IUtilisateur,
  UtilisateurRole,
  UtilisateurStatus,
} from "../../types/utilisateur.type";
import { getUtilisateurRole } from "../../utils/getUtilisateurRole";

// Adjust DataProps to be IUtilisateur directly
export type DataProps = IUtilisateur;

export const columns: ColumnDef<DataProps>[] = [
  {
    accessorKey: "firstName", // Changed to firstName as per IUtilisateur
    header: "Nom Complet",
    cell: ({ row }) => {
      const user = row.original; // row.original is now of type IUtilisateur
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
    accessorKey: "email", // Add email as a column
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "phoneNumber", // Add phoneNumber as a column
    header: "Téléphone",
    cell: ({ row }) => <span>{row.getValue("phoneNumber")}</span>,
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
        [UtilisateurRole.ADMIN]: "bg-green-100 text-green-600",
        [UtilisateurRole.CHEF_SERVICE]: "bg-purple-100 text-purple-700",
        [UtilisateurRole.CONSUL]: "bg-blue-100 text-blue-600",
        [UtilisateurRole.AGENT]: "bg-yellow-100 text-yellow-700",
        default: "bg-muted text-muted-foreground",
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
    accessorKey: "status", // Add status as a column
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue<UtilisateurStatus>("status"); // Status is a number enum
      const statusName =
        status === UtilisateurStatus.ACTIVE
          ? "actif"
          : status === UtilisateurStatus.INACTIVE
          ? "verrouillé"
          : status === UtilisateurStatus.DELETED
          ? "banni"
          : "inconnu"; // Directly mapping for simplicity, adjust if more statuses

      const statusColors: Record<string, string> = {
        actif: "bg-green-100 text-green-600",
        verrouillé: "bg-yellow-100 text-yellow-600",
        banni: "bg-red-100 text-red-600",
        default: "bg-muted text-muted-foreground",
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
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original as DataProps;
      
      const meta = table.options.meta as {
        onView: (user: DataProps) => void;
        onEdit: (user: DataProps) => void;
        onDelete: (user: DataProps) => void;
        onLockUnlock: (user: DataProps) => void;
      };

      if (user.status === UtilisateurStatus.DELETED) {
        return (
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => meta.onLockUnlock(user)}
                    className="w-7 h-7"
                  >
                    <LockOpen className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Activer</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }
      return (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => meta.onEdit(user)}
                  className="w-7 h-7"
                >
                  <SquarePen className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Modifier</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => meta.onDelete(user)}
                  className="w-7 h-7"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Supprimer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => meta.onLockUnlock(user)}
                  className="w-7 h-7"
                >
                  {user.status === UtilisateurStatus.ACTIVE ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <LockOpen className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {user.status === UtilisateurStatus.ACTIVE
                  ? "Verrouiller"
                  : "Activer"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];

export const columnsdemandeur: ColumnDef<DataProps>[] = [
  {
    accessorKey: "firstName", // Changed to firstName as per IUtilisateur
    header: "Nom Complet",
    cell: ({ row }) => {
      const user = row.original; // row.original is now of type IUtilisateur
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
    accessorKey: "email", // Add email as a column
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "phoneNumber", // Add phoneNumber as a column
    header: "Téléphone",
    cell: ({ row }) => <span>{row.getValue("phoneNumber")}</span>,
  },
  {
    accessorKey: "status", // Add status as a column
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue<UtilisateurStatus>("status"); // Status is a number enum
      const statusName =
        status === UtilisateurStatus.ACTIVE
          ? "actif"
          : status === UtilisateurStatus.INACTIVE
          ? "verrouillé"
          : status === UtilisateurStatus.DELETED
          ? "banni"
          : "inconnu"; // Directly mapping for simplicity, adjust if more statuses

      const statusColors: Record<string, string> = {
        actif: "bg-green-100 text-green-600",
        verrouillé: "bg-yellow-100 text-yellow-600",
        banni: "bg-red-100 text-red-600",
        default: "bg-muted text-muted-foreground",
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
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original as DataProps;
      const meta = table.options.meta as {
        onDelete: (user: DataProps) => void;
        onLockUnlock: (user: DataProps) => void;
      };

      return (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => meta.onDelete(user)}
                  className="w-7 h-7"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Supprimer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => meta.onLockUnlock(user)}
                  className="w-7 h-7"
                >
                  {user.status === UtilisateurStatus.ACTIVE ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <LockOpen className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {user.status === UtilisateurStatus.ACTIVE
                  ? "Verrouiller"
                  : "Activer"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];

export const getColumns = ({ type }: { type: "personnel" | "demandeur" }) => {
  return type === "personnel" ? columns : columnsdemandeur;
};
