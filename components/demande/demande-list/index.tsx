"use client";

import * as React from "react";
import {
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  RefreshCw, 
  Plus, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Package, 
  Archive,
  RotateCcw,
  Calendar
} from "lucide-react";
import TablePagination from "./table-pagination";
import { columns } from "./column";
import type { DataProps } from "./column";
import { ViewDemandeModal } from "../demande-modal/view-demand";
import { EditDemandeModal } from "../demande-modal/edit-demand";
import { DeleteDemandeModal } from "../demande-modal/delete-demand";
import { CreateDemandeModal } from "../demande-modal/create-demand";
import { useDemandes, useDemandeStats } from "@/hooks/use-demandes";
import type { Demande, DemandeFilters } from "@/lib/api";

// This component displays a list of demands with functionalities to view, edit, and delete them.

const DemandedList = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Filtres pour l'API
  const [filters, setFilters] = React.useState<DemandeFilters>({
    page: 1,
    limit: 10,
  });
  
  // Hooks pour les données API
  const { data: demandesData, isLoading, error, refetch } = useDemandes(filters);
  const { data: stats } = useDemandeStats();

  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [currentDemande, setCurrentDemande] = React.useState<Demande | null>(
    null
  );

  // Convertir les données API pour le tableau
  const tableData = React.useMemo(() => {
    return demandesData?.data || [];
  }, [demandesData]);

  const table = useReactTable({
    data: tableData,
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

  // Gestionnaires de filtres
  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1
    }));
  };

  const handleServiceFilter = (service: string) => {
    setFilters(prev => ({
      ...prev,
      service: service === 'all' ? undefined : service,
      page: 1
    }));
  };

  const handleSearchFilter = (search: string) => {
    setFilters(prev => ({
      ...prev,
      search: search || undefined,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="w-full p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement des demandes: {error.message}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* En-tête */}
      <div className="flex items-center justify-between py-4 px-5">
        <div className="text-xl font-medium text-default-900">
          Liste des demandes
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button 
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-yellow-500 hover:from-blue-700 hover:to-yellow-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

 
      {/* Filtres */}
      <div className="flex items-center gap-4 py-4 px-5 bg-muted/50">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filtres:</span>
        </div>
        
        <Input
          placeholder="Rechercher..."
          value={filters.search || ''}
          onChange={(e) => handleSearchFilter(e.target.value)}
          className="max-w-xs"
        />
        
        <Select
          value={filters.status || 'all'}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="APPROVED">Approuvée</SelectItem>
            <SelectItem value="REJECTED">Rejetée</SelectItem>
            <SelectItem value="READY_FOR_PICKUP">Prête</SelectItem>
            <SelectItem value="COMPLETED">Terminée</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.service || 'all'}
          onValueChange={handleServiceFilter}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les services</SelectItem>
            <SelectItem value="VISA">Visa</SelectItem>
            <SelectItem value="PASSPORT">Passeport</SelectItem>
            <SelectItem value="ATTESTATION">Attestation</SelectItem>
            <SelectItem value="LEGALISATION">Légalisation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader className="bg-default-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Skeleton de chargement
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {filters.search || filters.status || filters.service ? 
                  'Aucun résultat pour les filtres appliqués' : 
                  'Aucune demande trouvée'
                }
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination personnalisée avec les données API */}
      {demandesData && (
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {((demandesData.currentPage - 1) * demandesData.limit) + 1} à{' '}
            {Math.min(demandesData.currentPage * demandesData.limit, demandesData.total)} sur{' '}
            {demandesData.total} demandes
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(demandesData.currentPage - 1)}
              disabled={demandesData.currentPage <= 1 || isLoading}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: demandesData.totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === demandesData.totalPages || 
                  Math.abs(page - demandesData.currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <Button
                      variant={page === demandesData.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      disabled={isLoading}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))
              }
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(demandesData.currentPage + 1)}
              disabled={demandesData.currentPage >= demandesData.totalPages || isLoading}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Modales */}
      {currentDemande && (
        <>
          <ViewDemandeModal
            isOpen={viewOpen}
            setIsOpen={setViewOpen}
            demandeId={currentDemande.id}
          />
          <EditDemandeModal
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            demande={currentDemande}
            onSuccess={() => {
              setEditOpen(false);
              refetch();
            }}
          />
          <DeleteDemandeModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            demandeId={currentDemande.id}
            onSuccess={() => {
              setDeleteOpen(false);
              refetch();
            }}
          />
        </>
      )}
      
      {/* Modal de création */}
      <CreateDemandeModal
        isOpen={createOpen}
        setIsOpen={setCreateOpen}
        onSuccess={() => {
          setCreateOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default DemandedList;
