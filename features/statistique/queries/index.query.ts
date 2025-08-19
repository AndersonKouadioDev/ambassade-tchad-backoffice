import { useQueryClient } from '@tanstack/react-query';
import { IStatistiqueOptions } from '../types/statistique.type';

// 1. Clé de cache
export const statistiqueKeyQuery = (
    ...params: (string | IStatistiqueOptions)[]
) => {
    if (params.length === 0) {
        return ['statistique'];
    }
    return ['statistique', ...params];
};

// 2. Hook pour l'invalidation
export const useInvalidateStatistique = () => {
    const queryClient = useQueryClient();

    return async (...params: (string | IStatistiqueOptions)[]) => {
        await queryClient.invalidateQueries({
            queryKey: statistiqueKeyQuery(...params),
            exact: false,
        });
        await queryClient.refetchQueries({
            queryKey: statistiqueKeyQuery(),
            type: 'active',
        });
    };
};