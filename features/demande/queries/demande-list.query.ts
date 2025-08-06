import React from 'react';
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
            const result = await getAllFilteredDemandRequestsAction(params);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data!;
        },
        keepPreviousData: true,
        placeholderData: (previousData: any) => previousData,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      
    };
};

//2- Hook pour récupérer toutes les demandes filtrées
export const useDemandesFilteredListQuery = (
    params: IDemandeRechercheParams
) => {
    const query = useQuery(demandesFilteredListQueryOption(params));
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error("Erreur de récupération des demandes filtrées:", {
                description: query.error?.message,
            });
        }
    }, [query]);
    return query;
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
            const result = await getMyRequestsAction(params);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data!;
        },
        keepPreviousData: true,
        placeholderData: (previousData: any) => previousData,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    };
};

//2- Hook pour récupérer mes demandes
export const useMyDemandesListQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    const query = useQuery(myDemandesListQueryOption(params));
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error("Erreur de récupération des demandes:", {
                description: query.error?.message,
            });
        }
    }, [query]);
    return query;
};

//3- Fonction pour précharger mes demandes
export const prefetchMyDemandesListQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    return queryClient.prefetchQuery(myDemandesListQueryOption(params));
};