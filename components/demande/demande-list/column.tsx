import { ColumnDef } from "@tanstack/react-table"
import { Eye, SquarePen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import type { Demande } from "@/lib/api"

export type DataProps = Demande

export const columns: ColumnDef<DataProps>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "user",
    header: "Demandeur",
    cell: ({ row }) => {
      const demande = row.original
      const user = demande.user
      const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`
      return (
        <div className="flex gap-3 items-center font-medium text-card-foreground/80">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm text-default-900">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-default-500">{user?.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "serviceType",
    header: "Service",
    cell: ({ row }) => {
      const service = row.getValue<string>("serviceType")
      const serviceLabels: Record<string, string> = {
        VISA: "Visa",
        BIRTH_ACT_APPLICATION: "Acte de naissance",
        CONSULAR_CARD: "Carte consulaire",
        LAISSEZ_PASSER: "Laissez-passer",
        MARRIAGE_CAPACITY_ACT: "Acte de capacité de mariage",
        DEATH_ACT_APPLICATION: "Acte de décès",
        POWER_OF_ATTORNEY: "Procuration",
        NATIONALITY_CERTIFICATE: "Certificat de nationalité"
      }
      return <span className="text-sm">{serviceLabels[service] || service}</span>
    },
  },
  {
    accessorKey: "ticketNumber",
    header: "Numéro de Ticket",
    cell: ({ row }) => <span className="text-sm font-mono">{row.getValue("ticketNumber")}</span>,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue<string>("status")
      const statusConfig: Record<string, { label: string; className: string }> = {
        NEW: { label: "Nouvelle", className: "bg-blue-100 text-blue-700" },
        IN_REVIEW_DOCS: { label: "En révision", className: "bg-yellow-100 text-yellow-700" },
        PENDING_ADDITIONAL_INFO: { label: "Infos manquantes", className: "bg-orange-100 text-orange-700" },
        APPROVED_BY_AGENT: { label: "Approuvé par agent", className: "bg-green-100 text-green-700" },
        APPROVED_BY_CHEF: { label: "Approuvé par chef", className: "bg-green-200 text-green-800" },
        APPROVED_BY_CONSUL: { label: "Approuvé par consul", className: "bg-green-300 text-green-900" },
        REJECTED: { label: "Rejetée", className: "bg-red-100 text-red-700" },
        READY_FOR_PICKUP: { label: "Prête pour retrait", className: "bg-purple-100 text-purple-700" },
        DELIVERED: { label: "Délivrée", className: "bg-gray-100 text-gray-700" },
        ARCHIVED: { label: "Archivée", className: "bg-gray-200 text-gray-600" },
        EXPIRED: { label: "Expirée", className: "bg-red-200 text-red-800" },
        RENEWAL_REQUESTED: { label: "Renouvellement", className: "bg-indigo-100 text-indigo-700" }
      }
      const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-700" }
      return (
        <Badge className={cn("rounded-full px-3 py-1 text-xs", config.className)}>
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "submissionDate",
    header: "Date de soumission",
    cell: ({ row }) => {
      const date = row.getValue<string>("submissionDate")
      return (
        <span className="text-sm text-default-600">
          {format(new Date(date), "dd MMM yyyy", { locale: fr })}
        </span>
      )
    },
  },
  {
    accessorKey: "amount",
    header: "Montant",
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount")
      return (
        <span className="text-sm font-semibold">
          {amount} €
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const demande = row.original
      const meta = table.options.meta as {
        onView: (demande: DataProps) => void
        onEdit: (demande: DataProps) => void
        onDelete: (demande: DataProps) => void
      }

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
              <TooltipContent>Voir les détails</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => meta.onEdit(demande)}
                  className="w-7 h-7"
                >
                  <SquarePen className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Modifier la demande</TooltipContent>
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
                  disabled={demande.status === 'COMPLETED'}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {demande.status === 'COMPLETED' ? 'Impossible de supprimer une demande terminée' : 'Supprimer la demande'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
  },
]
