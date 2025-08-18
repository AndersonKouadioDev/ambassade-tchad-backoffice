import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getTotalDepensesAction } from '../actions/rapport-financier.action';
import { financialReportKeyQuery } from './index.query';
import { FilterOptions } from '../types/rapport-financier.type';

export const totalDepensesQueryOption = (params: FilterOptions) => {
    return {
        queryKey: financialReportKeyQuery('total-depenses', params),
        queryFn: async () => {
            const result = await getTotalDepensesAction(params);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data!;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    };
};

export const useTotalDepensesQuery = (params: FilterOptions) => {
    const query = useQuery(totalDepensesQueryOption(params));

    React.useEffect(() => {
        if (query.isError && query.error) {
            toast.error('Erreur lors de la récupération du total des revenus', {
                description: query.error.message,
            });
        }
    }, [query.isError, query.error]);

    return query;
};