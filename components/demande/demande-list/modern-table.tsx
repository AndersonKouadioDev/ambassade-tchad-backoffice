"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  FileText,
  User,
  Calendar,
  Clock,
  Settings,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Building,
  Mail,
  Phone,
} from "lucide-react";

import { ViewDemandModal } from "../modals/view-demand-modal";
import { EditDemandModal } from "../modals/edit-demand-modal";
import { DeleteDemandeModal } from "../demande-modal/delete-demand";
import type {
  ServiceType,
  RequestStatus,
  Demande,
} from "@/types/demande.types";
import {
  useDemandesList,
  useUpdateDemandeStatus,
  useDeleteDemande,
} from "@/hooks/queries/demande-queries";
import { useTokenRefresh } from "@/hooks/use-token-refresh";
import { toast } from "sonner";
import Loader from "@/components/loader";
import { useTranslations } from "next-intl";
import { formatSafeDate } from "@/lib/date-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mapping des statuts avec icônes et couleurs
const getStatusInfo = (status: RequestStatus) => {
  const statusMap = {
    NEW: {
      icon: AlertCircle,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    IN_REVIEW_DOCS: {
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    PENDING_ADDITIONAL_INFO: {
      icon: AlertCircle,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    APPROVED_BY_AGENT: {
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    APPROVED_BY_CHEF: {
      icon: CheckCircle,
      color: "bg-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    APPROVED_BY_CONSUL: {
      icon: CheckCircle,
      color: "bg-green-700",
      textColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    REJECTED: {
      icon: XCircle,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    READY_FOR_PICKUP: {
      icon: CheckCircle,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    DELIVERED: {
      icon: CheckCircle,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    ARCHIVED: {
      icon: Building,
      color: "bg-gray-500",
      textColor: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      borderColor: "border-gray-200 dark:border-gray-800",
    },
  };
  return statusMap[status] || statusMap.NEW;
};

// Mapping des services avec icônes
const getServiceInfo = (service: ServiceType) => {
  const serviceMap = {
    VISA: { icon: FileText, name: "Visa" },
    BIRTH_ACT_APPLICATION: { icon: User, name: "Acte de Naissance" },
    CONSULAR_CARD: { icon: Users, name: "Carte Consulaire" },
    LAISSEZ_PASSER: { icon: FileText, name: "Laissez-Passer" },
    MARRIAGE_CAPACITY_ACT: { icon: User, name: "Acte de Capacité de Mariage" },
    DEATH_ACT_APPLICATION: { icon: User, name: "Acte de Décès" },
    POWER_OF_ATTORNEY: { icon: FileText, name: "Procuration" },
    NATIONALITY_CERTIFICATE: {
      icon: FileText,
      name: "Certificat de Nationalité",
    },
  };
  return serviceMap[service] || { icon: FileText, name: service };
};

const ModernDemandeTable = () => {
  const t = useTranslations("gestionDemande");

  // Gestion automatique du refresh token
  useTokenRefresh();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>();
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // TanStack Query hooks
  const {
    data: demandesData,
    isLoading,
    error,
    refetch,
  } = useDemandesList({
    page,
    limit,
    status: statusFilter,
    serviceType: serviceFilter as ServiceType,
    search: searchTerm,
  });

  const updateStatusMutation = useUpdateDemandeStatus();
  const deleteMutation = useDeleteDemande();

  const data = demandesData?.data || [];

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentDemande, setCurrentDemande] = useState<Demande | null>(null);

  // Définition des colonnes modernes
  const columns: ColumnDef<Demande>[] = [
    {
      id: "ticket",
      header: "Ticket",
      cell: ({ row }) => {
        const demande = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-embassy-blue-500 to-embassy-yellow-500"></div>
            <div>
              <div className="font-mono text-sm font-semibold text-embassy-blue-600 dark:text-embassy-blue-400">
                #{demande.ticketNumber}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatSafeDate(demande.submissionDate)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "applicant",
      header: "Demandeur",
      cell: ({ row }) => {
        const demande = row.original;
        const user = demande.user;
        const initials = `${user.firstName?.charAt(0) || ""}${
          user.lastName?.charAt(0) || ""
        }`;

        return (
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-embassy-blue-200 dark:border-embassy-blue-700">
              <AvatarFallback className="bg-embassy-blue-100 dark:bg-embassy-blue-800 text-embassy-blue-700 dark:text-embassy-blue-300 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {user.firstName} {user.lastName}
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Mail className="w-3 h-3 mr-1" />
                {user.email}
              </div>
              {demande.contactPhoneNumber && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Phone className="w-3 h-3 mr-1" />
                  {demande.contactPhoneNumber}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "service",
      header: "Service",
      cell: ({ row }) => {
        const demande = row.original;
        const serviceInfo = getServiceInfo(demande.serviceType);
        const ServiceIcon = serviceInfo.icon;

        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-embassy-yellow-100 dark:bg-embassy-yellow-900/30">
              <ServiceIcon className="w-4 h-4 text-embassy-yellow-700 dark:text-embassy-yellow-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {serviceInfo.name}
              </div>
              <div className="text-xs text-embassy-yellow-600 dark:text-embassy-yellow-400 font-semibold">
                {demande.amount.toLocaleString()} FCFA
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }) => {
        const demande = row.original;
        const statusInfo = getStatusInfo(demande.status);
        const StatusIcon = statusInfo.icon;

        return (
          <div
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
          >
            <StatusIcon className={`w-4 h-4 ${statusInfo.textColor}`} />
            <span className={`text-sm font-medium ${statusInfo.textColor}`}>
              {getStatusLabel(demande.status)}
            </span>
          </div>
        );
      },
    },
    {
      id: "dates",
      header: "Dates",
      cell: ({ row }) => {
        const demande = row.original;

        return (
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Créé: {formatSafeDate(demande.submissionDate)}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              <span>MAJ: {formatSafeDate(demande.updatedAt)}</span>
            </div>
            {demande.completionDate && (
              <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>Fini: {formatSafeDate(demande.completionDate)}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const demande = row.original;

        return (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentDemande(demande);
                setViewOpen(true);
              }}
              className="h-8 w-8 p-0 text-embassy-blue-600 dark:text-embassy-blue-400 hover:bg-embassy-blue-100 dark:hover:bg-embassy-blue-900/30"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentDemande(demande);
                setEditOpen(true);
              }}
              className="h-8 w-8 p-0 text-embassy-yellow-600 dark:text-embassy-yellow-400 hover:bg-embassy-yellow-100 dark:hover:bg-embassy-yellow-900/30"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentDemande(demande);
                setDeleteOpen(true);
              }}
              className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleSubmitEdit = async (updatedData: Partial<Demande>) => {
    if (!currentDemande) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: currentDemande.id,
        status: updatedData.status || currentDemande.status,
      });
      toast.success("Demande mise à jour avec succès");
      setEditOpen(false);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error("Erreur lors de la modification:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentDemande) return;

    try {
      await deleteMutation.mutateAsync(currentDemande.id);
      toast.success("Demande supprimée avec succès");
      setDeleteOpen(false);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Données actualisées");
  };

  const handleExport = () => {
    toast.info("Fonctionnalité d'export en développement");
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status === "" ? undefined : (status as RequestStatus));
    setPage(1);
  };

  const handleServiceFilterChange = (service: string) => {
    setServiceFilter(service);
    setPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setPage(1);
  };

  // Fonction utilitaire pour les libellés de statut
  const getStatusLabel = (status: RequestStatus): string => {
    const labelMap: Record<RequestStatus, string> = {
      NEW: "Nouveau",
      IN_REVIEW_DOCS: "Révision docs",
      PENDING_ADDITIONAL_INFO: "Info requise",
      APPROVED_BY_AGENT: "Approuvé agent",
      APPROVED_BY_CHEF: "Approuvé chef",
      APPROVED_BY_CONSUL: "Approuvé consul",
      REJECTED: "Rejeté",
      READY_FOR_PICKUP: "Prêt",
      DELIVERED: "Livré",
      ARCHIVED: "Archivé",
    };
    return labelMap[status] || status;
  };

  // Show loading state
  if (isLoading && !data.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-600 dark:text-red-400">
          Erreur lors du chargement des données
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-yellow-50/20 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 min-h-screen">
      {/* En-tête moderne avec statistiques */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Gestion des Demandes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {demandesData?.total || 0} demandes au total
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-embassy-blue-300 dark:border-embassy-blue-600 text-embassy-blue-700 dark:text-embassy-blue-400 hover:bg-embassy-blue-50 dark:hover:bg-embassy-blue-900/30"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="border-embassy-yellow-300 dark:border-embassy-yellow-600 text-embassy-yellow-700 dark:text-embassy-yellow-400 hover:bg-embassy-yellow-50 dark:hover:bg-embassy-yellow-900/30"
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres modernes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email, ticket..."
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="pl-10 border-gray-300 dark:border-gray-600 focus:border-embassy-blue-500 dark:focus:border-embassy-blue-400 focus:ring-embassy-blue-500 dark:focus:ring-embassy-blue-400"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            {/* Filtre par statut */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-embassy-yellow-50 dark:bg-embassy-yellow-900/20 border-embassy-yellow-300 dark:border-embassy-yellow-600 text-embassy-yellow-700 dark:text-embassy-yellow-400 hover:bg-embassy-yellow-100 dark:hover:bg-embassy-yellow-900/30"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Statut
                  {statusFilter && (
                    <Badge className="ml-2 bg-embassy-yellow-200 dark:bg-embassy-yellow-800 text-embassy-yellow-800 dark:text-embassy-yellow-200">
                      1
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-embassy-yellow-50 dark:bg-embassy-yellow-900/20 border-embassy-yellow-200 dark:border-embassy-yellow-700"
              >
                <DropdownMenuLabel className="text-embassy-yellow-800 dark:text-embassy-yellow-200">
                  Filtrer par statut
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-embassy-yellow-200 dark:bg-embassy-yellow-700" />
                <DropdownMenuCheckboxItem
                  checked={!statusFilter}
                  onCheckedChange={() => handleStatusFilterChange("")}
                  className="text-embassy-yellow-700 dark:text-embassy-yellow-300"
                >
                  Tous les statuts
                </DropdownMenuCheckboxItem>
                {Object.values([
                  "NEW",
                  "IN_REVIEW_DOCS",
                  "APPROVED_BY_AGENT",
                  "REJECTED",
                  "DELIVERED",
                  "ARCHIVED",
                ] as RequestStatus[]).map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onCheckedChange={() =>
                      handleStatusFilterChange(
                        statusFilter === status ? "" : status
                      )
                    }
                    className="text-embassy-yellow-700 dark:text-embassy-yellow-300"
                  >
                    {getStatusLabel(status)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filtre par service */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-embassy-yellow-50 dark:bg-embassy-yellow-900/20 border-embassy-yellow-300 dark:border-embassy-yellow-600 text-embassy-yellow-700 dark:text-embassy-yellow-400 hover:bg-embassy-yellow-100 dark:hover:bg-embassy-yellow-900/30"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Service
                  {serviceFilter && (
                    <Badge className="ml-2 bg-embassy-yellow-200 dark:bg-embassy-yellow-800 text-embassy-yellow-800 dark:text-embassy-yellow-200">
                      1
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-embassy-yellow-50 dark:bg-embassy-yellow-900/20 border-embassy-yellow-200 dark:border-embassy-yellow-700"
              >
                <DropdownMenuLabel className="text-embassy-yellow-800 dark:text-embassy-yellow-200">
                  Filtrer par service
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-embassy-yellow-200 dark:bg-embassy-yellow-700" />
                <DropdownMenuCheckboxItem
                  checked={serviceFilter === ""}
                  onCheckedChange={() => handleServiceFilterChange("")}
                  className="text-embassy-yellow-700 dark:text-embassy-yellow-300"
                >
                  Tous les services
                </DropdownMenuCheckboxItem>
                {Object.values([
                  "VISA",
                  "BIRTH_ACT_APPLICATION",
                  "CONSULAR_CARD",
                  "LAISSEZ_PASSER",
                ] as ServiceType[]).map((service) => (
                  <DropdownMenuCheckboxItem
                    key={service}
                    checked={serviceFilter === service}
                    onCheckedChange={() =>
                      handleServiceFilterChange(
                        serviceFilter === service ? "" : service
                      )
                    }
                    className="text-embassy-yellow-700 dark:text-embassy-yellow-300"
                  >
                    {getServiceInfo(service).name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filtres actifs */}
        {(statusFilter || serviceFilter || searchTerm) && (
          <div className="flex gap-2 flex-wrap mt-4">
            {statusFilter && (
              <Badge className="bg-embassy-blue-100 dark:bg-embassy-blue-900/30 text-embassy-blue-800 dark:text-embassy-blue-200 border-embassy-blue-300 dark:border-embassy-blue-600">
                Statut: {getStatusLabel(statusFilter)}
                <button
                  onClick={() => handleStatusFilterChange("")}
                  className="ml-2 hover:bg-embassy-blue-200 dark:hover:bg-embassy-blue-800 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {serviceFilter && (
              <Badge className="bg-embassy-yellow-100 dark:bg-embassy-yellow-900/30 text-embassy-yellow-800 dark:text-embassy-yellow-200 border-embassy-yellow-300 dark:border-embassy-yellow-600">
                Service: {getServiceInfo(serviceFilter as ServiceType).name}
                <button
                  onClick={() => handleServiceFilterChange("")}
                  className="ml-2 hover:bg-embassy-yellow-200 dark:hover:bg-embassy-yellow-800 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600">
                Recherche: {searchTerm}
                <button
                  onClick={() => handleSearchChange("")}
                  className="ml-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Table moderne */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gradient-to-r from-embassy-blue-50 via-embassy-blue-100/50 to-embassy-yellow-50 dark:from-embassy-blue-900/30 dark:via-embassy-blue-800/20 dark:to-embassy-yellow-900/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-embassy-blue-200 dark:border-embassy-blue-700"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-embassy-blue-800 dark:text-embassy-blue-200 font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-embassy-blue-50/50 dark:hover:bg-embassy-blue-900/20 border-gray-200 dark:border-gray-700 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-gray-900 dark:text-gray-100"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-600 dark:text-gray-400"
                >
                  Aucune demande trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination moderne */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              {table.getFilteredSelectedRowModel().rows.length} sur{" "}
              {demandesData?.total || 0} sélectionnés
            </span>
            <Badge className="border-embassy-blue-300 dark:border-embassy-blue-600 text-embassy-blue-700 dark:text-embassy-blue-400">
              Page {page} sur {Math.ceil((demandesData?.total || 0) / limit)}
            </Badge>
            {demandesData?.total && (
              <span className="text-xs">
                Affichage {(page - 1) * limit + 1} à{" "}
                {Math.min(page * limit, demandesData.total)} sur{" "}
                {demandesData.total} résultats
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1 || isLoading}
              className="border-embassy-blue-300 dark:border-embassy-blue-600 text-embassy-blue-700 dark:text-embassy-blue-400 hover:bg-embassy-blue-50 dark:hover:bg-embassy-blue-900/30 disabled:opacity-50"
            >
              Premier
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || isLoading}
              className="border-embassy-blue-300 dark:border-embassy-blue-600 text-embassy-blue-700 dark:text-embassy-blue-400 hover:bg-embassy-blue-50 dark:hover:bg-embassy-blue-900/30 disabled:opacity-50"
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!demandesData?.hasNextPage || isLoading}
              className="border-embassy-blue-300 dark:border-embassy-blue-600 text-embassy-blue-700 dark:text-embassy-blue-400 hover:bg-embassy-blue-50 dark:hover:bg-embassy-blue-900/30 disabled:opacity-50"
            >
              Suivant
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage(Math.ceil((demandesData?.total || 0) / limit))
              }
              disabled={!demandesData?.hasNextPage || isLoading}
              className="border-embassy-blue-300 dark:border-embassy-blue-600 text-embassy-blue-700 dark:text-embassy-blue-400 hover:bg-embassy-blue-50 dark:hover:bg-embassy-blue-900/30 disabled:opacity-50"
            >
              Dernier
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {currentDemande && (
        <ViewDemandModal
          isOpen={viewOpen}
          onClose={() => setViewOpen(false)}
          demande={currentDemande}
        />
      )}
      {currentDemande && (
        <EditDemandModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          demande={currentDemande}
          onSubmit={handleSubmitEdit}
        />
      )}
      <DeleteDemandeModal
        isOpen={deleteOpen}
        setIsOpen={setDeleteOpen}
        demande={currentDemande}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export { ModernDemandeTable };
export default ModernDemandeTable;
