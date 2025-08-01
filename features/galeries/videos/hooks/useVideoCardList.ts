import { useState, useMemo } from "react";
import { useQueryStates } from 'nuqs';
import { useVideosList } from "../queries/video-list.query";
import { toast } from "sonner";
import { invalidateAllVideos } from "../queries/video-list.query";
import { videoFiltersClient } from "../filters/video.filters";
import { IVideoRechercheParams } from "../types/video.type";
import { createVideo, deleteVideo, updateVideo } from "../actions/video.action";
import { VideoDTO } from "../schemas/video.schema";

export const useVideoCardList = () => {
  // Gestion des paramètres d'URL via Nuqs
  const [filters, setFilters] = useQueryStates(videoFiltersClient, {
    clearOnDefault: true
  });

  // Construction des paramètres de recherche par défaut pour React Query
  const currentSearchParams: IVideoRechercheParams = useMemo(() => {
    const params: IVideoRechercheParams = {
      page: Number(filters.page) || 1,
      limit: Number(filters.limit) || 12,
    };

    // Ajouter seulement les paramètres qui ont des valeurs valides
    if (filters.title && filters.title.trim()) {
      params.title = filters.title.trim();
    }

    if (filters.description && filters.description.trim()) {
      params.description = filters.description.trim();
    }

    // Si published est 'all' ou undefined, ne pas l'inclure du tout

    return params;
  }, [filters]);

  const { data, isLoading, error } = useVideosList(currentSearchParams);

  console.log('useVideoCardList - React Query result:', { data, isLoading, error });

  const handleTextFilterChange = (filterName: 'title' | 'description', value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterName]: value,
      page: 1, // Réinitialise à la première page
    }));
  };


  const handleCreate = async (data: VideoDTO) => {
    try {
      const result = await createVideo(data as any);

      if (result.success) {
        toast.success(result.message);
        await invalidateAllVideos();
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la création de la video");
      throw error;
    }
  };

    const handleUpdate = async (id: string, formData: VideoDTO) => {
    try {
      const result = await updateVideo(id, formData as any);

      if (result.success) {
        toast.success(result.message);
        await invalidateAllVideos();
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la video");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteVideo(id);

      if (result.success) {
        toast.success(result.message);
          await invalidateAllVideos();
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Erreur lors de la suppression de la video");
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

  console.log('useVideoCardList - paginationData:', paginationData);

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

