import React from 'react';

import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirCategoriesDepensesAction } from '../../actions/depense.action';
import { categorieDepenseKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête pour les catégories actives
export const categoriesActivesQueryOption = () => {
    return {
        queryKey: categorieDepenseKeyQuery("categories-actives"),
        queryFn: async () => {
            const result = await obtenirCategoriesDepensesAction();
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des catégories");
            }
            return result.data!;
        },
        placeholderData: (previousData: any) => previousData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    };
};

//2- Hook pour récupérer les catégories actives
export const useCategoriesActivesQuery = () => {
    const query = useQuery(categoriesActivesQueryOption());

    // Gestion des erreurs dans le hook
    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error("Erreur lors de la récupération des catégories:", {
                description: query.error.message,
            });
        }
    }, [query.isError, query.error]);

    return query;
};

//3- Fonction pour précharger les catégories
export const prefetchCategoriesActivesQuery = () => {
    return queryClient.prefetchQuery(categoriesActivesQueryOption());
}