import React from 'react';

import {
    useInfiniteQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirTousDepensesAction } from '../actions/depense.action';
import { IDepensesParams } from '../types/depense.type';
import { depenseKeyQuery } from './index.query';
import { toast } from 'sonner';
import { IDepense } from '../types/depense.type';
import { PaginatedResponse } from '@/types';

const queryClient = getQueryClient();

//1- Option de requête
export const depensesInfinityQueryOption = (depensesParamsDTO: IDepensesParams) => {
    return {
        queryKey: depenseKeyQuery("list", depensesParamsDTO),
        queryFn: async ({ pageParam = 1 }) => {

            const result = await obtenirTousDepensesAction({
                ...depensesParamsDTO,
                page: pageParam,
            });

            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des dépenses");
            }

            return result.data!;

        },

        initialPageParam: 1,

        getNextPageParam: (lastPage: PaginatedResponse<IDepense>) => {
            const hasNextPage = lastPage.meta.totalPages > lastPage.meta.page;
            return hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
    };
};

//2- Hook pour récupérer les dépenses
export const useDepensesInfinityQuery = (
    depensesParamsDTO: IDepensesParams
) => {
    const query = useInfiniteQuery(depensesInfinityQueryOption(depensesParamsDTO));

    // Gestion des erreurs dans le hook
    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error("Erreur lors de la récupération des dépenses:", {
                description: query.error instanceof Error ? query.error.message : "Erreur inconnue",
            });
        }
    }, [query]);

    return query;
};

//3- Fonction pour précharger les dépenses
export const prefetchDepensesInfinityQuery = (
    depensesParamsDTO: IDepensesParams
) => {
    return queryClient.prefetchInfiniteQuery(depensesInfinityQueryOption(depensesParamsDTO));
}
