"use client";

import React from "react";
import { AlertTriangle, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { PhotoFilters } from "./photo-filters";
import { usePhotoCardList } from "../../hooks/usePhotoCardList";
import { IPhoto } from "../../types/photo.type";
import { PhotoListCard } from "./photo-card";

export const PhotoListTable: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    filters,
    handleView,
    handleTextFilterChange,
  } = usePhotoCardList();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Erreur lors du chargement
          </h3>
          <p className="text-muted-foreground">
            Une erreur s&apos;est produite lors du chargement des photos.
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
      ) : data?.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucune photo trouvée</h3>
          <p className="text-muted-foreground">
            Aucune photo ne correspond à vos critères de recherche.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.map((photo: IPhoto) => (
              <PhotoListCard key={photo.id} photo={photo} onView={handleView} />
            ))}
          </div>

          {/* {pagination.totalPages > 1 && (
            <ActualitePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )} */}
        </>
      )}

      {/* <ActualiteViewModal
        actualite={selectedActualite}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onOpenImageGallery={handleOpenImageGallery}
      /> */}

      {/* {selectedActualite &&
        selectedActualite.imageUrls &&
        selectedActualite.imageUrls.length > 0 && (
          <ActualiteImageGalleryModal
            isOpen={isImageGalleryOpen}
            onClose={() => setIsImageGalleryOpen(false)}
            images={selectedActualite.imageUrls}
            title={selectedActualite.title}
          />
        )} */}
    </div>
  );
};
