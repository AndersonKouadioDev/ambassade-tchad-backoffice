import { useState, useMemo } from "react";
import { useQueryStates } from 'nuqs';
import { IPhotoRechercheParams } from "../types/photo.type";
import { usePhotosList } from "../queries/photo-list.query";
import { createPhoto, updatePhoto, deletePhoto } from "../actions/photo.action";
import { PhotoDTO } from "../schemas/photo.schema";
import { toast } from "sonner";
import { invalidateAllPhotos } from "../queries/photo-details.query";
import { photoFiltersClient } from "../filters/photo.filters";

export const usePhotoCardList = () => {
  // Gestion des paramètres d'URL via Nuqs
  const [filters, setFilters] = useQueryStates(photoFiltersClient, {
    clearOnDefault: true
  });

  // Construction des paramètres de recherche par défaut pour React Query
  const currentSearchParams: IPhotoRechercheParams = useMemo(() => {
    const params: IPhotoRechercheParams = {
      page: Number(filters.page) || 1,
      limit: Number(filters.limit) || 12,
    };
  
    if (filters.title?.trim()) {
      params.title = filters.title.trim();
    }
  
    if (filters.description?.trim()) {
      params.description = filters.description.trim();
    }
  
    return params;
  }, [filters]);

  const { data, isLoading, error } = usePhotosList(currentSearchParams);

  console.log('usePhotoCardList - React Query result:', { data, isLoading, error });

  const handleTextFilterChange =(filterName: 'title' | 'description', value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterName]: value,
      page: 1, // Réinitialise à la première page
    }));
  };


  const handleCreate = async (formData: PhotoDTO, formDataToSend?: FormData) => {
    try {
      const result = await createPhoto(formData as any);

      if (result.success) {
        toast.success(result.message);
        await invalidateAllPhotos();
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la création de la photo");
      throw error;
    }
  };

  const handleUpdate = async (id: string, formData: PhotoDTO) => {
    try {
      const result = await updatePhoto(id, formData as any);

      if (result.success) {
        toast.success(result.message);
        await invalidateAllPhotos();
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la photo");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deletePhoto(id);

      if (result.success) {
        toast.success(result.message);
        await invalidateAllPhotos();
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la suppression de la photo");
      throw error;
    }
  };

  // Extraction des données de pagination
  const paginationData = {
    data: Array.isArray((data as any)?.data) ? (data as any).data : [],
    meta: (data as any)?.meta || {
      page: 1,
      limit: 12,
      totalItems: 0,
      totalPages: 1,
    },
  };

  console.log('usePhotoCardList - paginationData:', paginationData);

  const handlePageChange = (page: number) => {
    setFilters((prev: any) => ({
      ...prev,
      page,
    }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters((prev: any) => ({
      ...prev,
      limit,
      page: 1, // Retour à la première page lors du changement de limite
    }));
  };

  return {
    data: paginationData.data,
    isLoading,
    error,
    filters,
    pagination: {
      currentPage: paginationData.meta.page,
      totalPages: paginationData.meta.totalPages,
      totalItems: paginationData.meta.totalItems,
      itemsPerPage: paginationData.meta.limit,
    },
    handleTextFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

