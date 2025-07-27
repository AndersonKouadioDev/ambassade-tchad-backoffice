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
import { ChevronDown, Search, Filter, Download, RefreshCw } from "lucide-react";
import { useColumns } from "./column";

import { ViewDemandModal } from "../modals/view-demand-modal";
import { EditDemandModal } from "../modals/edit-demand-modal";
import { DeleteDemandeModal } from "../demande-modal/delete-demand";
import type { ServiceType, RequestStatus, Demande } from "@/types/demande.types";
import { useDemandesList, useUpdateDemandeStatus, useDeleteDemande } from "@/hooks/queries/demande-queries";
import { useTokenRefresh } from "@/hooks/use-token-refresh";
import { toast } from "sonner";
import Loader from "@/components/loader";
import { useTranslations } from "next-intl";

// This component displays a list of demands with functionalities to view, edit, and delete them.

const DemandedList = () => {
  const t = useTranslations("gestionDemande");
  
  // Gestion automatique du refresh token
  useTokenRefresh();
  const columns = useColumns();
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
    refetch 
  } = useDemandesList({
    page,
    limit,
    status: statusFilter,
    serviceType: serviceFilter || undefined,
    search: searchTerm || undefined
  });

  const updateStatusMutation = useUpdateDemandeStatus();
  const deleteMutation = useDeleteDemande();

  const data = demandesData?.data || [];

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentDemande, setCurrentDemande] = useState<Demande | null>(
    null
  );

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
    meta: {
      onView: (demande: Demande) => {
        setCurrentDemande(demande);
        setViewOpen(true);
      },
      onEdit: (demande: Demande) => {
        setCurrentDemande(demande);
        setEditOpen(true);
      },
      onDelete: (demande: Demande) => {
        setCurrentDemande(demande);
        setDeleteOpen(true);
      },
    },
  });



  const handleSubmitEdit = async (updatedData: Partial<Demande>) => {
    if (!currentDemande) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        id: currentDemande.id,
        status: updatedData.status || currentDemande.status
      });
      toast.success(t('modals.editRequest.updated'));
      setEditOpen(false);
      refetch();
    } catch (error) {
      toast.error(t('modals.editRequest.error'));
      console.error('Erreur lors de la modification:', error);
    }
  };

  const handleDelete = async () => {
    if (!currentDemande) return;
    
    try {
      await deleteMutation.mutateAsync(currentDemande.id);
      toast.success(t('modals.deleteRequest.updated'));
      setDeleteOpen(false);
      refetch();
    } catch (error) {
      toast.error(t('modals.deleteRequest.error'));
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success(t('dataRefreshed'));
  };

  const handleExport = () => {
    // Logique d'export - à implémenter selon les besoins
    toast.info(t('exportDevelopment'));
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status === "" ? undefined : status as RequestStatus);
    setPage(1); // Reset to first page when filtering
  };

  const handleServiceFilterChange = (service: string) => {
    setServiceFilter(service);
    setPage(1); // Reset to first page when filtering
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setPage(1); // Reset to first page when searching
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
        <p className="text-red-600">{t('error')}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Barre d'outils améliorée */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg border border-blue-200">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="pl-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Filtres par statut */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                <Filter className="mr-2 h-4 w-4" />
                {t('status')}
                {statusFilter && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t('statusFilter')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={!statusFilter}
                onCheckedChange={() => handleStatusFilterChange("")}
              >
                {t('filters.allStatuses')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "NEW"}
                onCheckedChange={() => handleStatusFilterChange(statusFilter === "NEW" ? "" : "NEW")}
              >
                {t('statuses.new')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "IN_REVIEW_DOCS"}
                onCheckedChange={() => handleStatusFilterChange(statusFilter === "IN_REVIEW_DOCS" ? "" : "IN_REVIEW_DOCS")}
              >
                {t('statuses.inReviewDocs')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "APPROVED_BY_AGENT"}
                onCheckedChange={() => handleStatusFilterChange(statusFilter === "APPROVED_BY_AGENT" ? "" : "APPROVED_BY_AGENT")}
              >
                {t('statuses.approvedByAgent')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "REJECTED"}
                onCheckedChange={() => handleStatusFilterChange(statusFilter === "REJECTED" ? "" : "REJECTED")}
              >
                {t('statuses.rejected')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "DELIVERED"}
                onCheckedChange={() => handleStatusFilterChange(statusFilter === "DELIVERED" ? "" : "DELIVERED")}
              >
                {t('statuses.delivered')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "ARCHIVED"}
                onCheckedChange={() => handleStatusFilterChange(statusFilter === "ARCHIVED" ? "" : "ARCHIVED")}
              >
                {t('statuses.archived')}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtres par service */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                <Filter className="mr-2 h-4 w-4" />
                {t('service')}
                {serviceFilter && (
                  <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t('service')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={serviceFilter === ""}
                onCheckedChange={() => handleServiceFilterChange("")}
              >
                {t('filters.allServices')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={serviceFilter === "VISA"}
                onCheckedChange={() => handleServiceFilterChange(serviceFilter === "VISA" ? "" : "VISA")}
              >
                {t('services.visa')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={serviceFilter === "BIRTH_ACT_APPLICATION"}
                onCheckedChange={() => handleServiceFilterChange(serviceFilter === "BIRTH_ACT_APPLICATION" ? "" : "BIRTH_ACT_APPLICATION")}
              >
                {t('services.birthActApplication')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={serviceFilter === "CONSULAR_CARD"}
                onCheckedChange={() => handleServiceFilterChange(serviceFilter === "CONSULAR_CARD" ? "" : "CONSULAR_CARD")}
              >
                {t('services.consularCard')}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          {/* Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('export')}
          </Button>

          {/* Colonnes */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                {t('columns')} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t('showHide')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === 'id' ? t('requestId') :
                       column.id === 'personalInfo' ? t('applicant') :
                       column.id === 'serviceType' ? t('service') :
                       column.id === 'status' ? t('status') :
                       column.id === 'createdAt' ? t('createdAt') :
                       column.id === 'updatedAt' ? t('updatedAt') :
                       column.id === 'actions' ? t('actions') :
                       column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Indicateurs de filtres actifs */}
      {(statusFilter || serviceFilter || searchTerm) && (
        <div className="flex gap-2 flex-wrap">
          {statusFilter && (
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-800 border-blue-300"
            >
              Statut: {statusFilter}
              <button 
                onClick={() => handleStatusFilterChange("")}
                className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {serviceFilter && (
            <Badge 
              variant="secondary" 
              className="bg-yellow-100 text-yellow-800 border-yellow-300"
            >
              Service: {serviceFilter}
              <button 
                onClick={() => handleServiceFilterChange("")}
                className="ml-2 hover:bg-yellow-200 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {searchTerm && (
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800 border-green-300"
            >
              Recherche: {searchTerm}
              <button 
                onClick={() => handleSearchChange("")}
                className="ml-2 hover:bg-green-200 rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-blue-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gradient-to-r from-blue-50 to-yellow-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-blue-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-blue-800 font-semibold">
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
                  className="hover:bg-blue-50/50 border-blue-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-blue-900">
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
                  className="h-24 text-center text-blue-600"
                >
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination améliorée avec données serveur */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-4 text-sm text-blue-700">
          <span>
            {table.getFilteredSelectedRowModel().rows.length} {t('on')}{" "}
            {demandesData?.total || 0} {t('selected')}
          </span>
          <Badge variant="outline" className="border-blue-300 text-blue-700">
            {t('page')} {page} {t('of')} {Math.ceil((demandesData?.total || 0) / limit)}
          </Badge>
          {demandesData?.total && (
            <span className="text-xs text-blue-600">
              {t('showing')} {((page - 1) * limit) + 1} {t('to')} {Math.min(page * limit, demandesData.total)} {t('of')} {demandesData.total} {t('results')}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1 || isLoading}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
          >
            {t('first')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1 || isLoading}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
          >
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => prev + 1)}
            disabled={!demandesData?.hasNextPage || isLoading}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
          >
            {t('next')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.ceil((demandesData?.total || 0) / limit))}
            disabled={!demandesData?.hasNextPage || isLoading}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
          >
            {t('last')}
          </Button>
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

export { DemandedList };
export default DemandedList;
