import getQueryClient from "@/lib/get-query-client";
import {useQuery} from "@tanstack/react-query";
import {getPhotoStatsAction} from "../actions/photo.action";
import {photoKeyQuery} from "./index.query";
import React from "react";
import { toast } from "sonner";

const queryClient = getQueryClient();

// Option de requête
export const photoStatsQueryOption = () => {
    return {
        queryKey: photoKeyQuery(),
        queryFn: async () => {
            const result = await getPhotoStatsAction();
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des stats des photos");
            }
            return result.data!;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    };
}
// Hook pour récupérer les stats des photos
export const usePhotoStats = () => {
    const query = useQuery(photoStatsQueryOption());
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error(query.error?.message);
        }
    }, [query]);
    return query;
};

// Hook pour précharger les stats des photos
export const prefetchPhotoStats = () => {
    return queryClient.prefetchQuery(photoStatsQueryOption());
}


