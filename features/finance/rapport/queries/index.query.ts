import { useQueryClient } from '@tanstack/react-query';
import { FilterOptions } from '../types/rapport-financier.type';

// 1. Clé de cache
export const financialReportKeyQuery = (
    ...params: (string | FilterOptions)[]
) => {
    if (params.length === 0) {
        return ['financial-report'];
    }
    return ['financial-report', ...params];
};

// 2. Hook pour l'invalidation
export const useInvalidateFinancialReport = () => {
    const queryClient = useQueryClient();

    return async (...params: (string | FilterOptions)[]) => {
        await queryClient.invalidateQueries({
            queryKey: financialReportKeyQuery(...params),
            exact: false,
        });
        await queryClient.refetchQueries({
            queryKey: financialReportKeyQuery(),
            type: 'active',
        });
    };
};