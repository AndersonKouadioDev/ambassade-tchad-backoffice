import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IEvenementRechercheParams } from "../types/evenement.type";import { evenementAPI } from "../apis/evenement.api";



const queryClient = getQueryClient();

// la clé de cache
const evenementQueryKey = ['evenement'] as const;

// Option de requête
export const evenementListQueryOption = (evenementSearchParams: IEvenementRechercheParams) => {
    return {
        queryKey: [...evenementQueryKey, 'list', evenementSearchParams],    
        queryFn: async () => {
            console.log('🔍 evenementListQueryOption - params envoyés à l\'API:', evenementSearchParams);
            console.log('🔍 evenementListQueryOption - published type:', typeof evenementSearchParams.published, 'value:', evenementSearchParams.published);
            const data = await evenementAPI.getAll(evenementSearchParams);
            return data;
        }
        ,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    };
}

// Hook pour récupérer les événements
export const useEvenementsList = (evenementSearchParams: IEvenementRechercheParams) => {
    return useQuery(evenementListQueryOption(evenementSearchParams));
};

// Hook pour précharger les événements
export const prefetchEvenementsList = (evenementSearchParams: IEvenementRechercheParams) => {
    return queryClient.prefetchQuery(evenementListQueryOption(evenementSearchParams));
}

// Fonction pour invalider le cache
export const invalidateEvenementsList = (evenementSearchParams: IEvenementRechercheParams) => {
    return queryClient.invalidateQueries({
        queryKey: [...evenementQueryKey, 'list', evenementSearchParams],
    });
}

// Fonction pour invalider tous les événements
export const invalidateAllEvenements = () => {
    return queryClient.invalidateQueries({  
        queryKey: evenementQueryKey,
    });
}   
