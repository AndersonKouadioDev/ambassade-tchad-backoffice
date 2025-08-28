import {useQuery} from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import {IVideoRechercheParams} from "../types/video.type";
import {getVideoTousAction} from "../actions/video.action";
import {videoKeyQuery} from "./index.query";
import React from "react";
import { toast } from "sonner";

const queryClient = getQueryClient();

// Option de requête
export const videoListQueryOption = (videoSearchParams: IVideoRechercheParams) => {
    return {
        queryKey: videoKeyQuery('list', videoSearchParams),
        queryFn: async () => {
            const result = await getVideoTousAction(videoSearchParams);
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des videos");
            }
            return result.data!;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
}

// Hook pour récupérer les videos
export const useVideosList = (videoSearchParams: IVideoRechercheParams) => {
    const query = useQuery(videoListQueryOption(videoSearchParams));
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error(query.error?.message);
        }
    }, [query]);
    return query;
};

// Hook pour précharger les videos
export const prefetchVideosList = (videoSearchParams: IVideoRechercheParams) => {
    return queryClient.prefetchQuery(videoListQueryOption(videoSearchParams));
}



