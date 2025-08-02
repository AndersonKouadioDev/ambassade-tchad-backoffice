import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getPhotoDetailAction } from "../actions/photo.action";
import { photoKeyQuery } from "./index.query";
const queryClient = getQueryClient();

// Option de requête
export const photoQueryOption = (id: string) => {
    return {
        queryKey: photoKeyQuery(id),
        queryFn: async () => {    
            const data = await getPhotoDetailAction(id);
            return data;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer une photo
export const usePhoto = (id: string) => {
    return useQuery(photoQueryOption(id));
};
// Hook pour précharger une photo
export const prefetchPhoto = (id: string) => {
    return queryClient.prefetchQuery(photoQueryOption(id));
}