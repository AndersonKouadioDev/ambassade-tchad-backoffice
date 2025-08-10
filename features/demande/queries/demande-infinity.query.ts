
import React from 'react';
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
import React from 'react';

const queryClient = getQueryClient();

//1- Option de requête pour toutes les demandes filtrées
export const demandesFilteredInfinityQueryOption = (params: IDemandeRechercheParams) => {
    return {
        queryKey: demandeKeyQuery("list-filtered", params),
        queryFn: async ({ pageParam = 1 }) => {
            const result = await getAllFilteredDemandRequestsAction({
                ...params,
                page: pageParam,
            });
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data!;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResponse<IDemande>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
    };
};

//2- Hook pour récupérer toutes les demandes filtrées
export const useDemandesFilteredInfinityQuery = (
    params: IDemandeRechercheParams
) => {
    const query = useInfiniteQuery(demandesFilteredInfinityQueryOption(params));
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
            const result = await getMyRequestsAction({
                ...params,
                page: pageParam,
            });
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data!;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: PaginatedResponse<IDemande>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
    };
};

//2- Hook pour récupérer mes demandes (infinity scroll)
export const useMyDemandesInfinityQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    const query = useInfiniteQuery(myDemandesInfinityQueryOption(params));
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error("Erreur de récupération des demandes:", {
                description: query.error?.message,
            });
        }
    }, [query]);
    return query;
};

//3- Fonction pour précharger mes demandes (infinity scroll)
export const prefetchMyDemandesInfinityQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    return queryClient.prefetchInfiniteQuery(myDemandesInfinityQueryOption(params));
};