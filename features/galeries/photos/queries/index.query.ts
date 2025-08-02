import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const photoKeyQuery = (...params: any[]) => {
    if (params.length === 0) {
        return ['photo'];
    }
    return ['photo', ...params];
};

// 2. Créez un hook personnalisé pour l'invalidation
export const useInvalidatePhotoQuery = () => {
    const queryClient = useQueryClient();

    return async (...params: any[]) => {
        await queryClient.invalidateQueries({
            queryKey: photoKeyQuery(...params),
            exact: false
        });

        await queryClient.refetchQueries({
            queryKey:photoKeyQuery(),
            type: 'active'
        });
    };
};