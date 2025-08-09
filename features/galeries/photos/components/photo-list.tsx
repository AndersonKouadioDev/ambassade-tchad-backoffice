"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { usePhotoCardList } from "../hooks/usePhotoCardList";
import { IPhoto } from "../types/photo.type";
import { PhotoFilters } from "./photo-list/photo-filters";
import { PhotoCard } from "./photo-list/photo-card";
import { PhotoPagination } from "./photo-pagination/photo-pagination";
import { PhotoViewModal } from "./photo-modal/photo-view-modal";
import { PhotoImageGalleryModal } from "./photo-modal/photo-image-gallery-modal";

export const PhotoList: React.FC = () => {
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
    filters,
    pagination,
    handleTextFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePhotoCardList();

  const [selectedPhoto, setSelectedPhoto] = useState<IPhoto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);

  const handleView = (photo: IPhoto) => {
    setSelectedPhoto(photo);
    setIsViewModalOpen(true);
  };

  const handleEdit = (photo: IPhoto) => {
    // Navigation vers la page d'édition
    router.push(`/contenu/photo/edit/${photo.id}`);
  };


  // En
  const handleCreatePhoto = () => {
    // Navigation vers la page de création
    router.push(`/contenu/photo/create`);
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
            Une erreur s&apos;est produite lors du chargement des evenements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PhotoFilters
        filters={filters}
        onTextFilterChange={handleTextFilterChange}
        onCreate={handleCreatePhoto} // Utiliser la nouvelle fonction
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
            {data.map((photo: IPhoto) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onView={handleView}
                onEdit={handleEdit}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <PhotoPagination
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

      <PhotoViewModal
        photo={selectedPhoto}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onOpenImageGallery={handleOpenImageGallery}
      />

      {selectedPhoto && selectedPhoto.imageUrl && selectedPhoto.imageUrl.length > 0 && (
        <PhotoImageGalleryModal
          isOpen={isImageGalleryOpen}
          onClose={() => setIsImageGalleryOpen(false)}
          images={selectedPhoto.imageUrl}
          title={selectedPhoto.title}
        />
      )}
    </div>
  );
};