import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getVideoStatsAction } from "../actions/video.action";
import { videoKeyQuery } from "./index.query";
import React from "react";
import { toast } from "sonner";

const queryClient = getQueryClient();

// Option de requête
export const videoStatsQueryOption = () => {
    return {
        queryKey: videoKeyQuery(),
        queryFn: async () => {
            const result = await getVideoStatsAction();
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des stats des videos");
            }
            return result.data!;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };
}
// Hook pour récupérer les stats des videos
export const useVideoStats = () => {
    const query = useQuery(videoStatsQueryOption());
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error(query.error?.message);
        }
    }, [query]);
    return query;
};

// Hook pour précharger les stats des videos
export const prefetchVideoStats = () => {
    return queryClient.prefetchQuery(videoStatsQueryOption());
}