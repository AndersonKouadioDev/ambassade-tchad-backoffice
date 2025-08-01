import getQueryClient from "@/lib/get-query-client";
import { PaginatedResponse } from "@/types";

import { useInfiniteQuery } from "@tanstack/react-query";
import { IVideo, IVideoRechercheParams } from "../types/video.type";
import { videoAPI } from "../actions/video.action";

const queryClient = getQueryClient();

// la clé de cache
export const videoQueryKey = ['video'] as const;
// Option de requête
export const videoInfintyQueryOption = (videoSearchParams: IVideoRechercheParams) => {
    return {
        queryKey: [...videoQueryKey, 'list', videoSearchParams],
        queryFn: async ({ pageParam = 1 }) => {
            const data = await videoAPI.getAll({
                ...videoSearchParams,
                page: pageParam,
                limit: 10,
            });
            return data;
        }
        ,
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResponse<IVideo>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        }
    };
}

// Hook pour récupérer les photos
export const useVideosInfinity = (videoSearchParams: IVideoRechercheParams) => {
    return useInfiniteQuery(videoInfintyQueryOption(videoSearchParams));
}


// Hook pour précharger les photos
export const prefetchVideosInfinity = (videoSearchParams: IVideoRechercheParams) => {
    return queryClient.prefetchInfiniteQuery(videoInfintyQueryOption(videoSearchParams));
}


// Fonction pour invalider le cache
export const invalidateVideosInfinity = (videoSearchParams: IVideoRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...videoQueryKey, 'list', videoSearchParams],
    });
}