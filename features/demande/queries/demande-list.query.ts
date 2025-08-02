import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { getAllFilteredDemandRequestsAction, getMyRequestsAction } from '../actions/demande.action'; // Import relevant actions
import { IDemandeRechercheParams } from '../types/demande.type';
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête optimisée pour toutes les demandes filtrées
export const demandesFilteredListQueryOption = (params: IDemandeRechercheParams) => {
    return {
        queryKey: demandeKeyQuery("list-filtered", params),
        queryFn: async () => {
            return getAllFilteredDemandRequestsAction(params);
        },
        keepPreviousData: true,
        placeholderData: (previousData: any) => previousData,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des demandes filtrées:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer toutes les demandes filtrées
export const useDemandesFilteredListQuery = (
    params: IDemandeRechercheParams
) => {
    return useQuery(demandesFilteredListQueryOption(params));
};

//3- Fonction pour précharger toutes les demandes filtrées
export const prefetchDemandesFilteredListQuery = (
    params: IDemandeRechercheParams
) => {
    return queryClient.prefetchQuery(demandesFilteredListQueryOption(params));
};

// ============================================================== 

//1- Option de requête optimisée pour mes demandes
export const myDemandesListQueryOption = (params: Omit<IDemandeRechercheParams, 'userId'>) => {
    return {
        queryKey: demandeKeyQuery("my-list", params),
        queryFn: async () => {
            return getMyRequestsAction(params);
        },
        keepPreviousData: true,
        placeholderData: (previousData: any) => previousData,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération de mes demandes:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer mes demandes
export const useMyDemandesListQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    return useQuery(myDemandesListQueryOption(params));
};

//3- Fonction pour précharger mes demandes
export const prefetchMyDemandesListQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    return queryClient.prefetchQuery(myDemandesListQueryOption(params));
};