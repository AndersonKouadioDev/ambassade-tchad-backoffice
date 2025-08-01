import { useState, useMemo } from "react";
import { useQueryStates } from 'nuqs';

import { toast } from "sonner";
import { IVideoRechercheParams } from "../types/video.type";
import { videoFiltersClient } from "../filters/video.filters";
import { invalidateAllVideos } from "../queries/video-list.query";
import { videoAPI } from "../actions/video.action";
import { useVideosList } from "../queries/video-list.query";
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
    
    console.log('useEvenementListTable - currentSearchParams:', params);
    return params;
  }, [filters]);

  const { data, isLoading, error } = useVideosList(currentSearchParams);

  console.log('useEvenementListTable - React Query result:', { data, isLoading, error });

  const handleTextFilterChange = (filterName: 'title' | 'description' | 'authorId', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1, // Réinitialise à la première page
    }));
  };

  const handlePublishedFilterChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      published: value === "all" ? undefined : value === "true",
      page: 1, // Réinitialise à la première page
    }));
  };


  const handleCreate = async (formData: VideoDTO, formDataToSend?: FormData) => {
    try {
      await videoAPI.create(formData, formDataToSend);
      toast.success("Video créée avec succès");
      await invalidateAllVideos();
    } catch (error) {
      toast.error("Erreur lors de la création de la video");
      throw error;
    }
  };

  const handleUpdate = async (id: string, formData: VideoDTO) => {
    try {
      await videoAPI.update(id, formData);
      toast.success("Video mise à jour avec succès");
      await invalidateAllVideos();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la video");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
        await videoAPI.delete(id);
      toast.success("Video supprimée avec succès");
      await invalidateAllVideos();
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

  console.log('useEvenementListTable - paginationData:', paginationData);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters(prev => ({
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
    handlePublishedFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

