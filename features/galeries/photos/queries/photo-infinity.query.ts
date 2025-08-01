import getQueryClient from "@/lib/get-query-client";
import { IEvenement, PaginatedResponse } from "@/types";

import { useInfiniteQuery } from "@tanstack/react-query";
import { IPhoto, IPhotoRechercheParams } from "../types/photo.type";
import { photoAPI } from "../actions/photo.action";

const queryClient = getQueryClient();

// la clé de cache
export const photoQueryKey = ['photo'] as const;
// Option de requête
export const photoInfintyQueryOption = (photoSearchParams: IPhotoRechercheParams) => {
    return {
        queryKey: [...photoQueryKey, 'list', photoSearchParams],
        queryFn: async ({ pageParam = 1 }) => {
            const data = await photoAPI.getAll({
                ...photoSearchParams,
                page: pageParam,
                limit: 10,
            });
            return data;
        }
        ,
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResponse<IPhoto>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        }
    };
}

// Hook pour récupérer les photos
export const usePhotosInfinity = (photoSearchParams: IPhotoRechercheParams) => {
    return useInfiniteQuery(photoInfintyQueryOption(photoSearchParams));
}


// Hook pour précharger les photos
export const prefetchPhotosInfinity = (photoSearchParams: IPhotoRechercheParams) => {
    return queryClient.prefetchInfiniteQuery(photoInfintyQueryOption(photoSearchParams));
}


// Fonction pour invalider le cache
export const invalidatePhotosInfinity = (photoSearchParams: IPhotoRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...photoQueryKey, 'list', photoSearchParams],
    });
}