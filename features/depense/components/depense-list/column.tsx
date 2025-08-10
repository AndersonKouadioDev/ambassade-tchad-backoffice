import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, SquarePen } from "lucide-react";

import { IDepense } from "../../types/depense.type";
import { ICategorieDepense } from "../../types/categorie-depense.type";

export const columnsDepenses: ColumnDef<IDepense>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-sm text-default-600">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => (
      <span className="font-medium text-green-600">
        {row.getValue("amount")} FCFA
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => {
      const category = row.getValue("category") as ICategorieDepense;
      return (
        <Badge className="capitalize px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          {category?.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "expenseDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("expenseDate"));
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString("fr-FR")}
        </span>
      );
    },
  },
  {
    accessorKey: "recordedBy",
    header: "Enregistrée par",
    cell: ({ row }) => {
      const user = row.original.recordedBy;

      if (!user) {
        return <span className="text-gray-500">Non spécifié</span>;
      }

      return (
        <div className="flex gap-3 items-center">
          <Avatar className="w-7 h-7">
            <AvatarFallback>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{`${user.firstName} ${user.lastName}`}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const depense = row.original as IDepense;

      const meta = table.options.meta as {
        onEdit: (depense: IDepense) => void;
        onDelete: (depense: IDepense) => void;
      };

      return (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => meta.onEdit(depense)}
                  className="w-7 h-7"
                >
                  <SquarePen className="w-4 h-4" />
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
                  onClick={() => meta.onDelete(depense)}
                  className="w-7 h-7"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Supprimer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
