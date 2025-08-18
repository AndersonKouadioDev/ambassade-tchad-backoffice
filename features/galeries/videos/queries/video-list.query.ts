import {useQuery} from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import {IVideoRechercheParams} from "../types/video.type";
import {getVideoTousAction} from "../actions/video.action";
import {videoKeyQuery} from "./index.query";

const queryClient = getQueryClient();

// Option de requête
export const videoListQueryOption = (videoSearchParams: IVideoRechercheParams) => {
    return {
        queryKey: videoKeyQuery('list', videoSearchParams),
        queryFn: async () => {
            const result = await getVideoTousAction(videoSearchParams);
            return result.data!;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
}

// Hook pour récupérer les videos
export const useVideosList = (videoSearchParams: IVideoRechercheParams) => {
    return useQuery(videoListQueryOption(videoSearchParams));
};

// Hook pour précharger les videos
export const prefetchVideosList = (videoSearchParams: IVideoRechercheParams) => {
    return queryClient.prefetchQuery(videoListQueryOption(videoSearchParams));
}



