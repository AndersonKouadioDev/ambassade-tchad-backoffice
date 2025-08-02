import {
    useInfiniteQuery,
} from '@tanstack/react-query';
import { IDemande } from '../types/demande.type';
import { PaginatedResponse } from '@/types';
import getQueryClient from '@/lib/get-query-client';
import { getAllFilteredDemandRequestsAction, getMyRequestsAction } from '../actions/demande.action'; // Import relevant actions
import { IDemandeRechercheParams } from '../types/demande.type';
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête pour toutes les demandes filtrées
export const demandesFilteredInfinityQueryOption = (params: IDemandeRechercheParams) => {
    return {
        queryKey: demandeKeyQuery("list-filtered", params),
        queryFn: async ({ pageParam = 1 }) => {
            const data = await getAllFilteredDemandRequestsAction({
                ...params,
                page: pageParam,
            });
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResponse<IDemande>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des demandes filtrées:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer toutes les demandes filtrées
export const useDemandesFilteredInfinityQuery = (
    params: IDemandeRechercheParams
) => {
    return useInfiniteQuery(demandesFilteredInfinityQueryOption(params));
};

//3- Fonction pour précharger toutes les demandes filtrées
export const prefetchDemandesFilteredInfinityQuery = (
    params: IDemandeRechercheParams
) => {
    return queryClient.prefetchInfiniteQuery(demandesFilteredInfinityQueryOption(params));
};

// ============================================================== 

//1- Option de requête pour mes demandes (infinity scroll)
export const myDemandesInfinityQueryOption = (params: Omit<IDemandeRechercheParams, 'userId'>) => {
    return {
        queryKey: demandeKeyQuery("my-list", params),
        queryFn: async ({ pageParam = 1 }) => {
            const data = await getMyRequestsAction({
                ...params,
                page: pageParam,
            });
            return data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResponse<IDemande>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération de mes demandes:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer mes demandes (infinity scroll)
export const useMyDemandesInfinityQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    return useInfiniteQuery(myDemandesInfinityQueryOption(params));
};

//3- Fonction pour précharger mes demandes (infinity scroll)
export const prefetchMyDemandesInfinityQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    return queryClient.prefetchInfiniteQuery(myDemandesInfinityQueryOption(params));
};