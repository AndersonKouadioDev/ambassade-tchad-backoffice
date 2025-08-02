import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const evenementKeyQuery = (...params: any[]) => {
    if (params.length === 0) {
        return ['evenement'];
    }
    return ['evenement', ...params];
};

// 2. Créez un hook personnalisé pour l'invalidation
export const useInvalidateEvenementQuery = () => {
    const queryClient = useQueryClient();

    return async (...params: any[]) => {
        await queryClient.invalidateQueries({
            queryKey: evenementKeyQuery(...params),
            exact: false
        });

        await queryClient.refetchQueries({
            queryKey:evenementKeyQuery(),
            type: 'active'
        });
    };
};