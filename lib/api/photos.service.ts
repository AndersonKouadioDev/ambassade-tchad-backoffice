import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api as apiClient } from '@/lib/api-http';

// Types pour les photos selon l'API backend
export interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhotoData {
  title: string;
  description: string;
  imageUrl: string;
  published: boolean;
}

export interface UpdatePhotoData {
  title?: string;
  description?: string;
  imageUrl?: string;
  published?: boolean;
}

export interface PhotoFilters {
  title?: string;
  published?: boolean;
  authorId?: string;
}

export interface PhotoFiltersWithPagination extends PhotoFilters {
  page?: number;
  limit?: number;
}

export interface PhotoStats {
  total: number;
  published: number;
  unpublished: number;
  thisMonth: number;
}

export interface PaginatedPhotosResponse {
  data: Photo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Services API selon les endpoints du guide
class PhotosService {
  // Obtenir toutes les photos (publique)
  async getPhotos(): Promise<Photo[]> {
    const response = await apiClient.get('/photos');
    return response.data;
  }

  // Filtrer les photos
  async filterPhotos(filters: PhotoFilters = {}): Promise<Photo[]> {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.authorId) params.append('authorId', filters.authorId);

    const response = await apiClient.get(`/photos/filter?${params.toString()}`);
    return response.data;
  }

  // Statistiques des photos
  async getPhotoStats(): Promise<PhotoStats> {
    const response = await apiClient.get('/photos/stats');
    return response.data;
  }

  // Obtenir une photo par ID
  async getPhotoById(id: string): Promise<Photo> {
    const response = await apiClient.get(`/photos/${id}`);
    return response.data;
  }

  // Créer une photo
  async createPhoto(photoData: CreatePhotoData): Promise<Photo> {
    const response = await apiClient.post('/photos', photoData);
    return response.data;
  }

  // Mettre à jour une photo
  async updatePhoto(id: string, photoData: UpdatePhotoData): Promise<Photo> {
    const response = await apiClient.put(`/photos/${id}`, photoData);
    return response.data;
  }

  // Supprimer une photo
  async deletePhoto(id: string): Promise<void> {
    await apiClient.delete(`/photos/${id}`);
  }

  // Obtenir les photos avec pagination
  async getPhotosPaginated(filters: PhotoFiltersWithPagination = {}): Promise<PaginatedPhotosResponse> {
    const params = new URLSearchParams();
    
    // Pagination
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    // Filtres
    if (filters.title) params.append('title', filters.title);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.authorId) params.append('authorId', filters.authorId);

    const response = await apiClient.get(`/api/v1/photos?${params.toString()}`);
    return response.data;
  }
}

export const photosService = new PhotosService();

// Hooks TanStack Query
export const usePhotos = () => {
  return useQuery({
    queryKey: ['photos'],
    queryFn: () => photosService.getPhotos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFilteredPhotos = (filters: PhotoFilters) => {
  return useQuery({
    queryKey: ['photos', 'filtered', filters],
    queryFn: () => photosService.filterPhotos(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePhotoStats = () => {
  return useQuery({
    queryKey: ['photos', 'stats'],
    queryFn: () => photosService.getPhotoStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePhoto = (id: string) => {
  return useQuery({
    queryKey: ['photo', id],
    queryFn: () => photosService.getPhotoById(id),
    enabled: !!id,
  });
};

export const useCreatePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: photosService.createPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};

export const useUpdatePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, photoData }: { id: string; photoData: UpdatePhotoData }) => 
      photosService.updatePhoto(id, photoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: photosService.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
};