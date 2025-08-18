import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const videoKeyQuery = (...params: any[]) => {
    if (params.length === 0) {
        return ['video'];
    }
    return ['video', ...params];
};

// 2. Créez un hook personnalisé pour l'invalidation
export const useInvalidateVideoQuery = () => {
    const queryClient = useQueryClient();

    return async (...params: any[]) => {
        await queryClient.invalidateQueries({
            queryKey: videoKeyQuery(...params),
            exact: false
        });

        await queryClient.refetchQueries({
            queryKey:videoKeyQuery(),
            type: 'active'
        });
    };
};