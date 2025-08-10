import React from 'react';

import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirCategoriesDepensesAction } from '../../actions/depense.action';
import { categorieDepenseKeyQuery } from './index.query';
import { toast } from 'sonner';

const queryClient = getQueryClient();

//1- Option de requête optimisée
export const categorieDepenseListQueryOption = () => {
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
export const useCategorieDepensesListQuery = () => {
    const query = useQuery(categorieDepenseListQueryOption());

    // Gestion des erreurs dans le hook
    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error("Erreur lors de la récupération des dépenses:", {
                description: query.error.message,
            });
        }
    }, [query]);

    return query;
};

//3- Fonction pour précharger les dépenses appelée dans les pages
export const prefetchCategoriesDepensesListQuery = () => {
    return queryClient.prefetchQuery(categorieDepenseListQueryOption());
}