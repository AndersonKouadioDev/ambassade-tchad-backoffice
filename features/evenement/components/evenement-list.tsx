"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEvenementListTable } from "../hooks/useEvenementListTable";
import { IEvenement } from "../types/evenement.type";
import { EvenementImageGalleryModal } from "./evenement-modal/evenement-image-gallery-modal";
import { EvenementViewModal } from "./evenement-modal/evenement-view-modal";
import { EvenementCard } from "./evenement-list/evenement-card";
import { EvenementFilters } from "./evenement-list/evenement-filters";
import { EvenementPagination } from "./evenement-pagination/evenement-pagination";




export const EvenementList: React.FC = () => {
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
    filters,
    pagination,
    handleTextFilterChange,
    handlePublishedFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useEvenementListTable();

  const [selectedEvenement, setSelectedEvenement] = useState<IEvenement | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);

  const handleView = (evenement: IEvenement) => {
    setSelectedEvenement(evenement);
    setIsViewModalOpen(true);
  };

  const handleEdit = (evenement: IEvenement) => {
    // Navigation vers la page d'édition
    router.push(`/contenu/evenement/edit/${evenement.id}`);
  };

  const handleDeleteEvenement = async (evenement: IEvenement) => {
    await handleDelete(evenement.id);
  };

  const handleCreateEvenement = () => {
    // Navigation vers la page de création
    router.push(`/contenu/evenement/create`);
  };

  const handleOpenImageGallery = () => {
    setIsViewModalOpen(false);
    setIsImageGalleryOpen(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erreur lors du chargement</h3>
          <p className="text-muted-foreground">
            Une erreur s'est produite lors du chargement des evenements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EvenementFilters
        filters={filters}
        onTextFilterChange={handleTextFilterChange}
        onPublishedFilterChange={handlePublishedFilterChange}
        onCreate={handleCreateEvenement}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-48 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <div className="flex items-center gap-2 w-full">
                  <div className="w-7 h-7 bg-muted rounded-full" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucune actualité trouvée</h3>
          <p className="text-muted-foreground">
            Aucune actualité ne correspond à vos critères de recherche.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {data.map((evenement: IEvenement) => (
              <EvenementCard
                key={evenement.id}
                evenement={evenement}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteEvenement}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <EvenementPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      )}

      <EvenementViewModal
        evenement={selectedEvenement}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onOpenImageGallery={handleOpenImageGallery}
      />

      {selectedEvenement && selectedEvenement.imageUrl && selectedEvenement.imageUrl.length > 0 && (
        <EvenementImageGalleryModal
          isOpen={isImageGalleryOpen}
          onClose={() => setIsImageGalleryOpen(false)}
          images={selectedEvenement.imageUrl}
          title={selectedEvenement.title}
        />
      )}
    </div>
  );
}; 