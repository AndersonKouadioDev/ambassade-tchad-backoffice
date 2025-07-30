import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IVideoRechercheParams } from "../types/video.type";
import {videoAPI } from "../actions/video.action";



const queryClient = getQueryClient();

// la clé de cache
const videoQueryKey = ['video'] as const;

// Option de requête
export const videoListQueryOption = (videoSearchParams: IVideoRechercheParams) => {
    return {
        queryKey: [...videoQueryKey, 'list', videoSearchParams],    
        queryFn: async () => {
            const data = await videoAPI.getAll(videoSearchParams);
            return data;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
}

// Hook pour récupérer les vidéos
export const useVideosList = (videoSearchParams: IVideoRechercheParams) => {
    return useQuery(videoListQueryOption(videoSearchParams));
};

// Hook pour précharger les vidéos
export const prefetchVideosList = (videoSearchParams: IVideoRechercheParams) => {
    return queryClient.prefetchQuery(videoListQueryOption(videoSearchParams));
}

// Fonction pour invalider le cache
export const invalidateVideosList = (videoSearchParams: IVideoRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...videoQueryKey, 'list', videoSearchParams],
    });
}

// Fonction pour invalider tous les vidéos
export const invalidateAllVideos = () => {
    return queryClient.invalidateQueries({  
        queryKey: videoQueryKey,
    });
}   
