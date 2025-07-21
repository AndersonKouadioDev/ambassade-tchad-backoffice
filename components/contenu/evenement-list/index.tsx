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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Plus, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents, useEventStats, type EventFiltersWithPagination } from "@/hooks/use-events";
import type { Event } from "@/lib/api/events.service";
import { columns } from "./column";
import type { DataProps } from "./column";

// Fonction pour convertir un Event en DataProps
const eventToDataProps = (event: Event): DataProps => ({
  id: event.id,
  titre: event.title,
  description: event.description,
  date: new Date(event.eventDate).toLocaleDateString('fr-FR'),
  user: event.authorId, // Vous pourriez vouloir récupérer le nom de l'auteur
  image: '', // À adapter selon votre structure
  status: event.published ? 'publié' : 'brouillon',
  action: null,
});

const EvenementList = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  // États pour les filtres API
  const [filters, setFilters] = React.useState<EventFiltersWithPagination>({
    page: 1,
    limit: 10,
  });
  
  // États pour les modales
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [currentEvent, setCurrentEvent] = React.useState<DataProps | null>(null);
  
  // Hooks pour récupérer les données
  const { data: eventsData, isLoading, error, refetch } = useEvents(filters);
  const { data: statsData } = useEventStats();
  
  // Conversion des données pour le tableau
  const tableData = React.useMemo(() => {
    if (!eventsData?.data) return [];
    return eventsData.data.map(eventToDataProps);
  }, [eventsData]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: eventsData?.totalPages ?? 0,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onView: (event: DataProps) => {
        setCurrentEvent(event);
        setViewOpen(true);
      },
      onEdit: (event: DataProps) => {
        setCurrentEvent(event);
        setEditOpen(true);
      },
      onDelete: (event: DataProps) => {
        setCurrentEvent(event);
        setDeleteOpen(true);
      },
    },
  });

  // Gestionnaires pour les filtres
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, title: value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    const published = value === 'all' ? undefined : value === 'published';
    setFilters(prev => ({ ...prev, published, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    refetch();
  };

  // Composant de squelette pour le chargement
  const TableSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-100 dark:border-gray-800">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-20" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Liste des événements
          </h2>
          {statsData && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {statsData.total} événements au total • {statsData.published} publiés • {statsData.unpublished} brouillons
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button
            onClick={() => setEditOpen(true)}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel événement
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Rechercher par titre..."
            value={filters.title || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select
            value={filters.published === undefined ? 'all' : filters.published ? 'published' : 'draft'}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {eventsData && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {eventsData.data.length} sur {eventsData.total} événements
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <div className="text-red-600 dark:text-red-400 mb-2">
              Erreur lors du chargement des événements
            </div>
            <Button variant="outline" onClick={handleRefresh}>
              Réessayer
            </Button>
          </div>
        ) : isLoading ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold">
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
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
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                      Aucun événement trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Pagination personnalisée */}
            {eventsData && eventsData.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {eventsData.page} sur {eventsData.totalPages} • {eventsData.total} événements au total
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(eventsData.page - 1)}
                    disabled={eventsData.page <= 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(eventsData.page + 1)}
                    disabled={eventsData.page >= eventsData.totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales pour les événements */}
      {currentEvent && (
        <>
          {/* TODO: Implémenter les modales pour les événements */}
          {/* <ViewEventModal
            isOpen={viewOpen}
            setIsOpen={setViewOpen}
            event={currentEvent}
          />
          <EditEventModal
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            event={currentEvent}
          />
          <DeleteEventModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            event={currentEvent}
          /> */}
        </>
      )}
    </div>
  );
};

export default EvenementList;
