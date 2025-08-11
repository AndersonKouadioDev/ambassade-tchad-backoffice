import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IPhotoRechercheParams } from "../types/photo.type";
import { getPhotoTousAction } from "../actions/photo.action";
import { photoKeyQuery } from "./index.query";



const queryClient = getQueryClient();


// Option de requête
export const photoListQueryOption = (photoSearchParams: IPhotoRechercheParams) => {
    return {
        queryKey: photoKeyQuery('list', photoSearchParams),    
        queryFn: async () => {
            const result = await getPhotoTousAction(photoSearchParams);
            return result.data!;
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


   
