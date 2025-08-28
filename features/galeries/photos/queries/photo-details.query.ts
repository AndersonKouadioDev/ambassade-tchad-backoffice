import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getPhotoDetailAction } from "../actions/photo.action";
import { photoKeyQuery } from "./index.query";
import React from "react";
import { toast } from "sonner";

const queryClient = getQueryClient();

// Option de requête
export const photoQueryOption = (id: string) => {
    return {
        queryKey: photoKeyQuery(id),
        queryFn: async () => {
            const result = await getPhotoDetailAction(id);
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération de la photo");
            }
            return result.data!;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer une photo
export const usePhotoDetailQuery = (id: string) => {
    const query = useQuery(photoQueryOption(id));

    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error(query.error?.message);
        }
    }, [query]);

    return query;
};
// Hook pour précharger une photo
export const prefetchPhotoDetailQuery = (id: string) => {
    return queryClient.prefetchQuery(photoQueryOption(id));
}