import getQueryClient from "@/lib/get-query-client";
import {useQuery} from "@tanstack/react-query";
import {getVideoDetailAction} from "../actions/video.action";
import {videoKeyQuery} from "./index.query";

const queryClient = getQueryClient();

// Option de requête
export const videoQueryOption = (id: string) => {
    return {
        queryKey: videoKeyQuery(id),
        queryFn: async () => {
            const result = await getVideoDetailAction(id);
            return result.data!;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer une video
export const useVideoDetailQuery = (id: string) => {
    return useQuery(videoQueryOption(id));
};
// Hook pour précharger une video
export const prefetchVideoDetailQuery = (id: string) => {
    return queryClient.prefetchQuery(videoQueryOption(id));
}