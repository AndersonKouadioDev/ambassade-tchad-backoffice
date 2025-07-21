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
import { columns } from "./column";
import type { DataProps } from "./column";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Plus } from "lucide-react";
import { usePhotos, usePhotoStats } from "@/hooks/use-photos";
import { PhotoFiltersWithPagination, Photo } from "@/lib/api/photos.service";
import { useMemo } from "react";

// Fonction pour convertir les données Photo en DataProps
const photoToDataProps = (photo: Photo): DataProps => ({
  id: photo.id,
  document: photo.title,
  date: new Date(photo.createdAt).toLocaleDateString('fr-FR'),
  statut: photo.isPublished ? 'Publié' : 'Brouillon',
  auteur: photo.author || 'Inconnu'
});

// This component displays a list of photos with functionalities to view, edit, and delete them.

const PhotoList = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // États pour l'API
  const [filters, setFilters] = React.useState<PhotoFiltersWithPagination>({
    page: 1,
    limit: 10
  });

  // États pour les modales
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [currentPhoto, setCurrentPhoto] = React.useState<DataProps | null>(
    null
  );

  // Hooks pour récupérer les données
  const { data: photosData, isLoading, error, refetch } = usePhotos(filters);
  const { data: statsData } = usePhotoStats();

  // Conversion des données pour le tableau
  const tableData = useMemo(() => {
    if (!photosData?.photos) return [];
    return photosData.photos.map(photoToDataProps);
  }, [photosData]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: photosData?.totalPages ?? 0,
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
      onView: (photo: DataProps) => {
        setCurrentPhoto(photo);
        setViewOpen(true);
      },
      onEdit: (photo: DataProps) => {
        setCurrentPhoto(photo);
        setEditOpen(true);
      },
      onDelete: (photo: DataProps) => {
        setCurrentPhoto(photo);
        setDeleteOpen(true);
      },
    },
  });

  // Gestionnaires pour les filtres
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, title: value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    const isPublished = value === 'published' ? true : value === 'draft' ? false : undefined;
    setFilters(prev => ({ ...prev, isPublished, page: 1 }));
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
        <div key={i} className="flex space-x-4 p-4 border rounded">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between py-4 px-5 border-b">
        <div className="flex items-center space-x-6">
          <div className="text-xl font-medium text-default-900">
            Liste des photos
          </div>
          {statsData && (
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Total: {statsData.total}
              </Badge>
              <Badge variant="default" className="text-sm bg-green-100 text-green-800">
                Publiées: {statsData.published}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Brouillons: {statsData.drafts}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={() => setEditOpen(true)}
            size="sm"
            className="bg-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle photo
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center space-x-4 py-4 px-5">
        <Input
          placeholder="Rechercher par titre..."
          value={filters.title || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={filters.isPublished === true ? 'published' : filters.isPublished === false ? 'draft' : 'all'}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="published">Publiées</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contenu du tableau */}
      {error ? (
        <div className="flex items-center justify-center h-32 text-red-500">
          Erreur lors du chargement des photos: {error.message}
        </div>
      ) : isLoading ? (
        <TableSkeleton />
      ) : (
        <>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
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
                    Aucune photo trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination personnalisée */}
          {photosData && photosData.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {filters.page} sur {photosData.totalPages} ({photosData.total} photos au total)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= photosData.totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TODO: Implémenter les modales pour les photos */}
      {/* {currentPhoto && (
        <>
          <ViewPhotoModal
            isOpen={viewOpen}
            setIsOpen={setViewOpen}
            photo={currentPhoto}
          />
          <EditPhotoModal
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            photo={currentPhoto}
          />
          <DeletePhotoModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            photo={currentPhoto}
          />
        </>
      )} */}
          <DeleteDemandeModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            onConfirm={handleDelete}
          />
        </>
      )} */}
    </div>
  );
};

export default PhotoList;
