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
            const result = await getPhotoDetailAction(id);
            return result.data!;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer une photo
export const usePhotoDetailQuery = (id: string) => {
    return useQuery(photoQueryOption(id));
};
// Hook pour précharger une photo
export const prefetchPhotoDetailQuery = (id: string) => {
    return queryClient.prefetchQuery(photoQueryOption(id));
}