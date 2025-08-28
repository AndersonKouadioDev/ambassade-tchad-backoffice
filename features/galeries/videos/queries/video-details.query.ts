import getQueryClient from "@/lib/get-query-client";
import {useQuery} from "@tanstack/react-query";
import {getVideoDetailAction} from "../actions/video.action";
import {videoKeyQuery} from "./index.query";
import React from "react";
import { toast } from "sonner";

const queryClient = getQueryClient();

// Option de requête
export const videoQueryOption = (id: string) => {
    return {
        queryKey: videoKeyQuery(id),
        queryFn: async () => {
            const result = await getVideoDetailAction(id);
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération de la video");
            }
            return result.data!;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer une video
export const useVideoDetailQuery = (id: string) => {
    const query = useQuery(videoQueryOption(id));
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error(query.error?.message);
        }
    }, [query]);
    return query;
};
// Hook pour précharger une video
export const prefetchVideoDetailQuery = (id: string) => {
    return queryClient.prefetchQuery(videoQueryOption(id));
}