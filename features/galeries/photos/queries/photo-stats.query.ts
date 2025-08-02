import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getPhotoStatsAction } from "../actions/photo.action";
import { photoKeyQuery } from "./index.query";

const queryClient = getQueryClient();

// Option de requête
export const photoStatsQueryOption = () => {
    return {        
        queryKey: photoKeyQuery(),
        queryFn: async () => {
            const data = await getPhotoStatsAction();
            return data;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };
}
// Hook pour récupérer les stats des photos
export const usePhotoStats = () => {
    return useQuery(photoStatsQueryOption());
};

// Hook pour précharger les stats des photos
export const prefetchPhotoStats = () => {
    return queryClient.prefetchQuery(photoStatsQueryOption());
}


