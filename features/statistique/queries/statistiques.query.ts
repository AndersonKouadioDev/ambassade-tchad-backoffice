import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { toast } from 'sonner';

import { getStatistiquesAction } from '../actions/statistique.action';
import { statistiqueKeyQuery } from './index.query';
import { IStatistiqueOptions } from '../types/statistique.type';

const queryClient = getQueryClient();

export const getStatistiqueQueryOption = (params: IStatistiqueOptions) => {
    return {
        queryKey: statistiqueKeyQuery(params),
        queryFn: async () => {
            const result = await getStatistiquesAction(params);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data!;
        },
        placeholderData: (previousData: any) => previousData,
        staleTime: 5 * 60 * 1000, // 5 minutes de validité
        refetchOnWindowFocus: false,
    };
};

// 2. Hook pour récupérer les statistiques
export const useStatistiqueQuery = (params: IStatistiqueOptions) => {
    const query = useQuery(getStatistiqueQueryOption(params));

    // Gestion des erreurs
    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error('Erreur lors de la récupération des statistiques', {
                description: query.error.message,
            });
        }
    }, [query.isError, query.error]);

    return query;
};

// 3. Fonction pour précharger les statistiques
export const prefetchStatistiqueQuery = (params: IStatistiqueOptions) => {
    return queryClient.prefetchQuery(getStatistiqueQueryOption(params));
};