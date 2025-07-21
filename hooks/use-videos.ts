import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  videosService,
  Video,
  VideoFiltersWithPagination,
  VideoStats,
  CreateVideoData,
  UpdateVideoData,
} from '@/lib/api/videos.service';

// Hook pour récupérer les vidéos avec pagination
export const useVideos = (filters: VideoFiltersWithPagination = {}) => {
  return useQuery({
    queryKey: ['videos', 'paginated', filters],
    queryFn: () => videosService.getVideosPaginated(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
};

// Hook pour récupérer les statistiques des vidéos
export const useVideoStats = () => {
  return useQuery({
    queryKey: ['videos', 'stats'],
    queryFn: () => videosService.getVideoStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer une vidéo par ID
export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videosService.getVideoById(id),
    enabled: !!id,
  });
};

// Hook pour créer une vidéo
export const useCreateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (videoData: CreateVideoData) => videosService.createVideo(videoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Vidéo créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la création de la vidéo');
    },
  });
};

// Hook pour mettre à jour une vidéo
export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, videoData }: { id: string; videoData: UpdateVideoData }) => 
      videosService.updateVideo(id, videoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['video'] });
      toast.success('Vidéo mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la mise à jour de la vidéo');
    },
  });
};

// Hook pour supprimer une vidéo
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => videosService.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Vidéo supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression de la vidéo');
    },
  });
};

// Hook pour publier/dépublier une vidéo
export const useToggleVideoPublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => 
      videosService.updateVideo(id, { published }),
    onSuccess: (_, { published }) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['video'] });
      toast.success(published ? 'Vidéo publiée avec succès' : 'Vidéo dépubliée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la modification du statut de publication');
    },
  });
};