import getQueryClient from "@/lib/get-query-client";
import {useQuery} from "@tanstack/react-query";
import {getVideoStatsAction} from "../actions/video.action";
import {videoKeyQuery} from "./index.query";

const queryClient = getQueryClient();

// Option de requête
export const videoStatsQueryOption = () => {
    return {
        queryKey: videoKeyQuery(),
        queryFn: async () => {
            const result = await getVideoStatsAction();
            return result.data!;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };
}
// Hook pour récupérer les stats des videos
export const useVideoStats = () => {
    return useQuery(videoStatsQueryOption());
};

// Hook pour précharger les stats des videos
export const prefetchVideoStats = () => {
    return queryClient.prefetchQuery(videoStatsQueryOption());
}