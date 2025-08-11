import React from 'react';

import {
    useQuery,
} from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { obtenirCategoriesDepensesActiveAction } from '../../actions/categorie-depense.action';
import { categorieDepenseKeyQuery } from './index.query';
import { toast } from 'sonner';
import { ICategorieDepenseParams } from '../../types/categorie-depense.type';

const queryClient = getQueryClient();

//1- Option de requête pour les catégories actives
export const categoriesDepensesActivesListQueryOption = ({ params }: { params: ICategorieDepenseParams }) => {
    return {
        queryKey: categorieDepenseKeyQuery("categories-actives"),
        queryFn: async () => {
            const result = await obtenirCategoriesDepensesActiveAction(params);
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
export const useCategoriesDepensesActivesListQuery = ({ params }: { params: ICategorieDepenseParams }) => {
    const query = useQuery(categoriesDepensesActivesListQueryOption({ params }));

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
export const prefetchCategoriesDepensesActivesListQuery = ({ params }: { params: ICategorieDepenseParams }) => {
    return queryClient.prefetchQuery(categoriesDepensesActivesListQueryOption({ params }));
}