import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IPhotoRechercheParams } from "../types/photo.type";
import { getPhotoTousAction } from "../actions/photo.action";
import { photoKeyQuery } from "./index.query";
import React from "react";
import { toast } from "sonner";


const queryClient = getQueryClient();


// Option de requête
export const photoListQueryOption = (photoSearchParams: IPhotoRechercheParams) => {
    return {
        queryKey: photoKeyQuery('list', photoSearchParams),    
        queryFn: async () => {
            const result = await getPhotoTousAction(photoSearchParams);
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des photos");
            }
            return result.data!;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
}

// Hook pour récupérer les photos
export const usePhotosList = (photoSearchParams: IPhotoRechercheParams) => {
    const query = useQuery(photoListQueryOption(photoSearchParams));
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error(query.error?.message);
        }
    }, [query]);
    return query;
};

// Hook pour précharger les photos
export const prefetchPhotosList = (photoSearchParams: IPhotoRechercheParams) => {
    return queryClient.prefetchQuery(photoListQueryOption(photoSearchParams));
}


   
