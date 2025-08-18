import React from 'react';
import { useQuery } from '@tanstack/react-query';
import getQueryClient from '@/lib/get-query-client';
import { toast } from 'sonner';

import { getFinancialReportAction } from '../actions/rapport-financier.action';
import { financialReportKeyQuery } from './index.query';
import { FilterOptions } from '../types/rapport-financier.type';

const queryClient = getQueryClient();

export const financialReportQueryOption = (params: FilterOptions) => {
    return {
        queryKey: financialReportKeyQuery('full', params),
        queryFn: async () => {
            const result = await getFinancialReportAction(params);
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

// 2. Hook pour récupérer le rapport financier complet
export const useFinancialReportQuery = (params: FilterOptions) => {
    const query = useQuery(financialReportQueryOption(params));

    // Gestion des erreurs
    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error('Erreur lors de la récupération du rapport financier', {
                description: query.error.message,
            });
        }
    }, [query.isError, query.error]);

    return query;
};

// 3. Fonction pour précharger le rapport
export const prefetchFinancialReportQuery = (params: FilterOptions) => {
    return queryClient.prefetchQuery(financialReportQueryOption(params));
};