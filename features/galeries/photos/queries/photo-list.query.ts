import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IPhotoRechercheParams } from "../types/photo.type";
import { getPhotoTousAction } from "../actions/photo.action";



const queryClient = getQueryClient();

// la clé de cache
const photoQueryKey = ['photo'] as const;

// Option de requête
export const photoListQueryOption = (photoSearchParams: IPhotoRechercheParams) => {
    return {
        queryKey: [...photoQueryKey, 'list', photoSearchParams],    
        queryFn: async () => {
            const data = await getPhotoTousAction(photoSearchParams);
            return data;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
}

// Hook pour récupérer les photos
export const usePhotosList = (photoSearchParams: IPhotoRechercheParams) => {
    return useQuery(photoListQueryOption(photoSearchParams));
};

// Hook pour précharger les photos
export const prefetchPhotosList = (photoSearchParams: IPhotoRechercheParams) => {
    return queryClient.prefetchQuery(photoListQueryOption(photoSearchParams));
}

// Fonction pour invalider le cache
export const invalidatePhotosList = (photoSearchParams: IPhotoRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...photoQueryKey, 'list', photoSearchParams],
    });
}

// Fonction pour invalider tous les événements
export const invalidateAllEvenements = () => {
    return queryClient.invalidateQueries({  
        queryKey: photoQueryKey,
    });
}   
