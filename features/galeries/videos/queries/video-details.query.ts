import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getVideoDetailAction } from "../actions/video.action";
const queryClient = getQueryClient();

// la clé de cache
const photoQueryKey = (id: string) => ['photo', 'detail', id];
// Option de requête
export const photoQueryOption = (id: string) => {
    return {
        queryKey: photoQueryKey(id),
        queryFn: async () => {    
            if (!id) throw new Error("L'identifiant de la photo est requis");
            const data = await getVideoDetailAction(id);
            return data;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer une photo
export const usePhoto = (id: string) => {
    return useQuery(photoQueryOption(id));
};
// Hook pour précharger une photo
export const prefetchPhoto = (id: string) => {
    return queryClient.prefetchQuery(photoQueryOption(id));
}
// Fonction pour invalider le cache
export const invalidatePhoto = (id: string) => {
    return queryClient.invalidateQueries({
        queryKey: photoQueryKey(id),
    });
}
// Fonction pour invalider tous les photos
export const invalidateAllPhotos = () => {
    return queryClient.invalidateQueries({  
        queryKey: ['photo'],
    });
}
