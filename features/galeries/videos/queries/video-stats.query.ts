import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getVideoStatsAction } from "../actions/video.action";

const queryClient = getQueryClient();

export const videoQueryKey = ['video', 'stats'] as const;

// Option de requête
export const videoStatsQueryOption = () => {
    return {
        queryKey: videoQueryKey,
        queryFn: async () => {
            const data = await getVideoStatsAction();
            return data;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };
}
// Hook pour récupérer les stats des vidéos
export const useVideoStats = () => {
    return useQuery(videoStatsQueryOption());
};

// Hook pour précharger les stats des vidéos
export const prefetchVideoStats = () => {
    return queryClient.prefetchQuery(videoStatsQueryOption());
}

// Fonction pour invalider le cache
export const invalidateVideoStats = () => {
    return queryClient.invalidateQueries({
        queryKey: videoQueryKey,
    });
}   
