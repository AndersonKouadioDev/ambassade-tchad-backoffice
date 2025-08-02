import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const demandeKeyQuery = (...params: any[]) => {
    if (params.length === 0) {
        return ['demande'];
    }
    return ['demande', ...params];
};

// 2. Créez un hook personnalisé pour l'invalidation
export const useInvalidateDemandeQuery = () => {
    const queryClient = useQueryClient();

    return async (...params: any[]) => {
        await queryClient.invalidateQueries({
            queryKey: demandeKeyQuery(...params),
            exact: false
        });

        await queryClient.refetchQueries({
            queryKey: demandeKeyQuery(),
            type: 'active'
        });
    };
};