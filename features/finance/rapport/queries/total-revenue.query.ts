import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getTotalRevenueAction } from '../actions/rapport-financier.action';
import { financialReportKeyQuery } from './index.query';
import { FilterOptions } from '../types/rapport-financier.type';

export const totalRevenueQueryOption = (params: FilterOptions) => {
  return {
    queryKey: financialReportKeyQuery('total-revenue', params),
    queryFn: async () => {
      const result = await getTotalRevenueAction(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data!;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  };
};

export const useTotalRevenueQuery = (params: FilterOptions) => {
  const query = useQuery(totalRevenueQueryOption(params));

  React.useEffect(() => {
    if (query.isError && query.error) {
      toast.error('Erreur lors de la récupération du total des revenus', {
        description: query.error.message,
      });
    }
  }, [query.isError, query.error]);

  return query;
};