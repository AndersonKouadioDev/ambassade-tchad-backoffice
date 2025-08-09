import React from 'react';

import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirTousDepensesAction, obtenirCategoriesDepensesAction } from '../../actions/depense.action';
import { categorieDepenseKeyQuery } from './index.query';
import { toast } from 'sonner';
import { IDepensesParams } from '../../types/depense.type';

const queryClient = getQueryClient();

//1- Option de requête optimisée
export const categorieDepenseListQueryOption = (depensesParamsDTO: IDepensesParams) => {
    return {
        queryKey: categorieDepenseKeyQuery("list"),
        queryFn: async () => {
            const result = await obtenirCategoriesDepensesAction();
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la récupération des dépenses");
            }
            return result.data!;
        },
        placeholderData: (previousData: any) => previousData,
        staleTime: 30 * 1000,//30 secondes
        refetchOnWindowFocus: false,//Ne pas refetch lors du focus de la fenetre
        refetchOnMount: true,//Refetch lors du mount
    };
};

//2- Hook pour récupérer les dépenses
export const useCategorieDepensesListQuery = (depensesParamsDTO: IDepensesParams) => {
    const query = useQuery(categorieDepenseListQueryOption(depensesParamsDTO));

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

//3- Fonction pour précharger les dépenses appelée dans les pages
export const prefetchDepensesListQuery = (
    depensesParamsDTO: IDepensesParams
) => {
    return queryClient.prefetchQuery(categorieDepenseListQueryOption(depensesParamsDTO));
}

//4- Option de requête pour les catégories actives
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

//5- Hook pour récupérer les catégories actives
export const useCategoriesActivesQuery = () => {
    const query = useQuery(categoriesActivesQueryOption());

    // Gestion des erreurs dans le hook
    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error("Erreur lors de la récupération des catégories:", {
                description: query.error instanceof Error ? query.error.message : "Erreur inconnue",
            });
        }
    }, [query.isError, query.error]);

    return query;
};

//6- Fonction pour précharger les catégories
export const prefetchCategoriesActivesQuery = () => {
    return queryClient.prefetchQuery(categoriesActivesQueryOption());
}