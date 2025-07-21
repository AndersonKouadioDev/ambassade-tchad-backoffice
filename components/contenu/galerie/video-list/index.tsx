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
import { useVideos, useVideoStats } from "@/hooks/use-videos";
import { VideoFiltersWithPagination, Video } from "@/lib/api/videos.service";
import { useMemo } from "react";

// Fonction pour convertir les données Video en DataProps
const videoToDataProps = (video: Video): DataProps => ({
  id: video.id,
  document: video.title,
  date: new Date(video.createdAt).toLocaleDateString('fr-FR'),
  statut: video.isPublished ? 'Publié' : 'Brouillon',
  auteur: video.author || 'Inconnu'
});

// This component displays a list of videos with functionalities to view, edit, and delete them.

const VideoList = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // États pour l'API
  const [filters, setFilters] = React.useState<VideoFiltersWithPagination>({
    page: 1,
    limit: 10
  });

  // États pour les modales
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [currentVideo, setCurrentVideo] = React.useState<DataProps | null>(
    null
  );

  // Hooks pour récupérer les données
  const { data: videosData, isLoading, error, refetch } = useVideos(filters);
  const { data: statsData } = useVideoStats();

  // Conversion des données pour le tableau
  const tableData = useMemo(() => {
    if (!videosData?.videos) return [];
    return videosData.videos.map(videoToDataProps);
  }, [videosData]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: videosData?.totalPages ?? 0,
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
      onView: (video: DataProps) => {
        setCurrentVideo(video);
        setViewOpen(true);
      },
      onEdit: (video: DataProps) => {
        setCurrentVideo(video);
        setEditOpen(true);
      },
      onDelete: (video: DataProps) => {
        setCurrentVideo(video);
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
            Liste des vidéos
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
            Nouvelle vidéo
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
          Erreur lors du chargement des vidéos: {error.message}
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
                    Aucune vidéo trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination personnalisée */}
          {videosData && videosData.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {filters.page} sur {videosData.totalPages} ({videosData.total} vidéos au total)
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
                  disabled={filters.page >= videosData.totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* TODO: Implémenter les modales pour les vidéos */}
      {/* {currentVideo && (
        <>
          <ViewVideoModal
            isOpen={viewOpen}
            setIsOpen={setViewOpen}
            video={currentVideo}
          />
          <EditVideoModal
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            video={currentVideo}
          />
          <DeleteVideoModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            video={currentVideo}
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

export default VideoList;
