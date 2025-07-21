import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api as apiClient } from '@/lib/api-http';

// Types pour les vidéos selon l'API backend
export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoData {
  title: string;
  description: string;
  videoUrl: string;
  published: boolean;
}

export interface UpdateVideoData {
  title?: string;
  description?: string;
  videoUrl?: string;
  published?: boolean;
}

export interface VideoFilters {
  title?: string;
  published?: boolean;
  authorId?: string;
}

export interface VideoFiltersWithPagination extends VideoFilters {
  page?: number;
  limit?: number;
}

export interface VideoStats {
  total: number;
  published: number;
  unpublished: number;
  thisMonth: number;
}

export interface PaginatedVideosResponse {
  data: Video[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Services API selon les endpoints du guide
class VideosService {
  // Obtenir toutes les vidéos (publique)
  async getVideos(): Promise<Video[]> {
    const response = await apiClient.get('/videos');
    return response.data;
  }

  // Filtrer les vidéos
  async filterVideos(filters: VideoFilters = {}): Promise<Video[]> {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.authorId) params.append('authorId', filters.authorId);

    const response = await apiClient.get(`/videos/filter?${params.toString()}`);
    return response.data;
  }

  // Statistiques des vidéos
  async getVideoStats(): Promise<VideoStats> {
    const response = await apiClient.get('/videos/stats');
    return response.data;
  }

  // Obtenir une vidéo par ID
  async getVideoById(id: string): Promise<Video> {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  }

  // Créer une vidéo
  async createVideo(videoData: CreateVideoData): Promise<Video> {
    const response = await apiClient.post('/videos', videoData);
    return response.data;
  }

  // Mettre à jour une vidéo
  async updateVideo(id: string, videoData: UpdateVideoData): Promise<Video> {
    const response = await apiClient.put(`/videos/${id}`, videoData);
    return response.data;
  }

  // Supprimer une vidéo
  async deleteVideo(id: string): Promise<void> {
    await apiClient.delete(`/videos/${id}`);
  }

  // Obtenir les vidéos avec pagination
  async getVideosPaginated(filters: VideoFiltersWithPagination = {}): Promise<PaginatedVideosResponse> {
    const params = new URLSearchParams();
    
    // Pagination
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    // Filtres
    if (filters.title) params.append('title', filters.title);
    if (filters.published !== undefined) params.append('published', filters.published.toString());
    if (filters.authorId) params.append('authorId', filters.authorId);

    const response = await apiClient.get(`/api/v1/videos?${params.toString()}`);
    return response.data;
  }
}

export const videosService = new VideosService();

// Hooks TanStack Query
export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: () => videosService.getVideos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFilteredVideos = (filters: VideoFilters) => {
  return useQuery({
    queryKey: ['videos', 'filtered', filters],
    queryFn: () => videosService.filterVideos(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useVideoStats = () => {
  return useQuery({
    queryKey: ['videos', 'stats'],
    queryFn: () => videosService.getVideoStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videosService.getVideoById(id),
    enabled: !!id,
  });
};

export const useCreateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: videosService.createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, videoData }: { id: string; videoData: UpdateVideoData }) => 
      videosService.updateVideo(id, videoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: videosService.deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};