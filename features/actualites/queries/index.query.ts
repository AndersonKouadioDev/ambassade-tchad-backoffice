import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const actualiteKeyQuery = (...params: any[]) => {
    if (params.length === 0) {
        return ['actualite'];
    }
    return ['actualite', ...params];
};

// 2. Créez un hook personnalisé pour l'invalidation
export const useInvalidateActualiteQuery = () => {
    const queryClient = useQueryClient();

    return async (...params: any[]) => {
        await queryClient.invalidateQueries({
            queryKey: actualiteKeyQuery(...params),
            exact: false
        });

        await queryClient.refetchQueries({
            queryKey: actualiteKeyQuery(),
            type: 'active'
        });
    };
};