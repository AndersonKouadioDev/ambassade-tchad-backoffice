import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  photosService,
  Photo,
  PhotoFiltersWithPagination,
  PhotoStats,
  CreatePhotoData,
  UpdatePhotoData,
} from '@/lib/api/photos.service';

// Hook pour récupérer les photos avec pagination
export const usePhotos = (filters: PhotoFiltersWithPagination = {}) => {
  return useQuery({
    queryKey: ['photos', 'paginated', filters],
    queryFn: () => photosService.getPhotosPaginated(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
};

// Hook pour récupérer les statistiques des photos
export const usePhotoStats = () => {
  return useQuery({
    queryKey: ['photos', 'stats'],
    queryFn: () => photosService.getPhotoStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer une photo par ID
export const usePhoto = (id: string) => {
  return useQuery({
    queryKey: ['photo', id],
    queryFn: () => photosService.getPhotoById(id),
    enabled: !!id,
  });
};

// Hook pour créer une photo
export const useCreatePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (photoData: CreatePhotoData) => photosService.createPhoto(photoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast.success('Photo créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la création de la photo');
    },
  });
};

// Hook pour mettre à jour une photo
export const useUpdatePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, photoData }: { id: string; photoData: UpdatePhotoData }) => 
      photosService.updatePhoto(id, photoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photo'] });
      toast.success('Photo mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la mise à jour de la photo');
    },
  });
};

// Hook pour supprimer une photo
export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => photosService.deletePhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast.success('Photo supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression de la photo');
    },
  });
};

// Hook pour publier/dépublier une photo
export const useTogglePhotoPublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => 
      photosService.updatePhoto(id, { published }),
    onSuccess: (_, { published }) => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photo'] });
      toast.success(published ? 'Photo publiée avec succès' : 'Photo dépubliée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la modification du statut de publication');
    },
  });
};