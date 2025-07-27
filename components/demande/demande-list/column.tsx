import { ColumnDef } from "@tanstack/react-table"
import { Eye, SquarePen, Trash2, FileText, Calendar, User } from "lucide-react"
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
import type { Demande, RequestStatus, ServiceType } from "@/types/demande.types"
import { format, isValid } from "date-fns"
import { fr } from "date-fns/locale"
import { useTranslations } from "next-intl"

export type DataProps = Demande

// Fonction utilitaire pour formater les dates de manière sécurisée
const formatSafeDate = (dateValue: any, formatString: string = "dd/MM/yyyy") => {
  if (!dateValue) return "Date non disponible";
  
  // Si c'est une chaîne ISO, on la convertit en Date
  let date: Date;
  if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    return "Date invalide";
  }
  
  if (!isValid(date)) return "Date invalide";
  
  return format(date, formatString, { locale: fr });
};

// Fonction utilitaire pour obtenir les couleurs des statuts
const getStatusColor = (status: RequestStatus): string => {
  const colorMap: Record<RequestStatus, string> = {
    NEW: "bg-blue-100 text-blue-700 border-blue-200",
    IN_REVIEW_DOCS: "bg-yellow-100 text-yellow-700 border-yellow-200",
    PENDING_ADDITIONAL_INFO: "bg-orange-100 text-orange-700 border-orange-200",
    APPROVED_BY_AGENT: "bg-green-100 text-green-700 border-green-200",
    APPROVED_BY_CHEF: "bg-emerald-100 text-emerald-700 border-emerald-200",
    APPROVED_BY_CONSUL: "bg-teal-100 text-teal-700 border-teal-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    READY_FOR_PICKUP: "bg-purple-100 text-purple-700 border-purple-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    ARCHIVED: "bg-slate-100 text-slate-700 border-slate-200",
  }
  return colorMap[status] || "bg-gray-100 text-gray-700 border-gray-200"
}

// Hook utilitaire pour obtenir le libellé des statuts
const useStatusLabel = () => {
  const t = useTranslations("gestionDemande.statuses")
  return (status: RequestStatus): string => {
    const labelMap: Record<RequestStatus, string> = {
      NEW: t("new"),
      IN_REVIEW_DOCS: t("inReviewDocs"),
      PENDING_ADDITIONAL_INFO: t("pendingAdditionalInfo"),
      APPROVED_BY_AGENT: t("approvedByAgent"),
      APPROVED_BY_CHEF: t("approvedByChef"),
      APPROVED_BY_CONSUL: t("approvedByConsul"),
      REJECTED: t("rejected"),
      READY_FOR_PICKUP: t("readyForPickup"),
      DELIVERED: t("delivered"),
      ARCHIVED: t("archived"),
    }
    return labelMap[status] || status
  }
}

// Hook utilitaire pour obtenir le libellé des services
const useServiceLabel = () => {
  const t = useTranslations("gestionDemande.services")
  return (serviceType: ServiceType): string => {
    const labelMap: Record<ServiceType, string> = {
      VISA: t("visa"),
      BIRTH_ACT_APPLICATION: t("birthActApplication"),
      CONSULAR_CARD: t("consularCard"),
      LAISSEZ_PASSER: t("laissezPasser"),
      MARRIAGE_CAPACITY_ACT: t("marriageCapacityAct"),
      DEATH_ACT_APPLICATION: t("deathActApplication"),
      POWER_OF_ATTORNEY: t("powerOfAttorney"),
      NATIONALITY_CERTIFICATE: t("nationalityCertificate")
    }
    return labelMap[serviceType] || serviceType
  }
}

// Composant pour les colonnes avec traductions
export const useColumns = (): ColumnDef<DataProps>[] => {
  const t = useTranslations("gestionDemande")
  const getStatusLabel = useStatusLabel()
  const getServiceLabel = useServiceLabel()

  return [
  {
    accessorKey: "id",
    header: t("requestId"),
    cell: ({ row }) => (
      <div className="font-mono text-xs text-blue-600">
        #{row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: t("applicant"),
    cell: ({ row }) => {
      const demande = row.original;
      const user = demande.user;
      
      const firstName = user?.firstName || "Prénom";
      const lastName = user?.lastName || "Nom";
      const email = user?.email || "email@example.com";
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
      
      return (
        <div className="flex gap-3 items-center">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-900">
              {firstName} {lastName}
            </span>
            <span className="text-xs text-blue-600">
              {email}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "serviceType",
    header: t("service"),
    cell: ({ row }) => {
      const serviceType = row.getValue<ServiceType>("serviceType")
      return (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">
            {getServiceLabel(serviceType)}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: t("status"),
    cell: ({ row }) => {
      const status = row.getValue<RequestStatus>("status")
      return (
        <Badge className={cn("rounded-full px-3 py-1 text-xs font-medium border", getStatusColor(status))}>
          {getStatusLabel(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "submissionDate",
    header: t("createdAt"),
    cell: ({ row }) => {
      const dateValue = row.getValue("submissionDate");
      return (
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Calendar className="w-4 h-4" />
          <span>{formatSafeDate(dateValue)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: t("updatedAt"),
    cell: ({ row }) => {
      const dateValue = row.getValue("updatedAt");
      return (
        <div className="text-xs text-gray-600">
          {formatSafeDate(dateValue, "dd/MM/yyyy HH:mm")}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: t("actions"),
    cell: ({ row, table }) => {
      const demande = row.original
      const meta = table.options.meta as {
        onView?: (demande: Demande) => void
        onEdit?: (demande: Demande) => void
        onDelete?: (demande: Demande) => void
      }
      
      return (
        <TooltipProvider>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-transparent hover:border-blue-200"
                  onClick={() => meta?.onView?.(demande)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voir les détails</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 border border-transparent hover:border-yellow-200"
                  onClick={() => meta?.onEdit?.(demande)}
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modifier le statut</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200"
                  onClick={() => meta?.onDelete?.(demande)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Supprimer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )
    },
  },
  ]
}
