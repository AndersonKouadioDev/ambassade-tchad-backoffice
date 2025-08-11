import { useMemo, useState } from "react";
import { useQueryStates } from 'nuqs';
import { photoFiltersClient } from "../filters/photo.filters";
import { IPhoto, IPhotoRechercheParams } from "../types/photo.type";
import { usePhotosList } from "../queries/photo-list.query";

export const usePhotoCardList = () => {
  // Gestion des paramètres d'URL via Nuqs
  const [filters, setFilters] = useQueryStates(photoFiltersClient.filter, photoFiltersClient.option);

  // Construction des paramètres de recherche par défaut pour React Query
  const currentSearchParams: IPhotoRechercheParams = useMemo(() => {
    return {
      page: Number(filters.page) || 1,
      limit: Number(filters.limit) || 10,
      title: filters.title.trim(),
      description: filters.description,
    }
  }, [filters]);

  // Recherche des  photos
  const { data, isLoading, error } = usePhotosList(currentSearchParams);

  const [currentPhoto, setCurrentPhoto] = useState<IPhoto | null>(null);

  const handleView = (photo: IPhoto) => {
    setCurrentPhoto(photo);
  }

  const handleDelete = (photo: IPhoto) => {
    setCurrentPhoto(photo);
  }

  const handleTextFilterChange = (filterName: 'title' | 'description', value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterName]: value,
      page: 1,
    }));
  };


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
      page: 1,
    }));
  };

  return {
    data: data?.data,
    isLoading,
    error,
    filters,
    pagination: {
      currentPage: data?.meta.page,
      totalPages: data?.meta.totalPages,
      totalItems: data?.meta.total,
      itemsPerPage: data?.meta.limit,
    },
    handleTextFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleView,
    handleDelete,
    currentPhoto,
  };
};

