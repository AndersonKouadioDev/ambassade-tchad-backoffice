import getQueryClient from "@/lib/get-query-client";
import { evenementAPI } from "../apis/evenement.api";
import { useQuery } from "@tanstack/react-query";

const queryClient = getQueryClient();

export const evenementQueryKey = ['evenement', 'stats'] as const;

// Option de requête
export const evenementStatsQueryOption = () => {
    return {
        queryKey: evenementQueryKey,
        queryFn: async () => {
            console.log('🔍 Début de la récupération des stats...');
            try {
                // Essayer d'abord l'API getStats
                try {
                    console.log('🔍 Appel de evenementAPI.getStats()...');
                    const data = await evenementAPI.getStats();
                    console.log('📊 Données reçues de l\'API getStats:', data);

                    // Si l'API retourne des données valides, les mapper au format attendu
                    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                        console.log('✅ Utilisation des données de l\'API getStats');
                        // Mapper les propriétés de l'API au format attendu
                        const apiData = data as any;
                        return {
                            totalEvents: apiData.total || 0,
                            publishedEvents: apiData.published || 0,
                            unpublishedEvents: apiData.unpublished || 0,
                            upcomingEvents: apiData.upcoming || 0,
                            eventsByAuthor: apiData.byAuthor || []
                        };
                    }
                } catch (apiError) {
                    console.log('Erreur avec getStats(), utilisation du fallback:', apiError);
                }

                // Fallback: calculer les stats côté client
                const allEvenements = await evenementAPI.getAll({});
                const evenements = allEvenements.data || [];
                console.log('Événements récupérés:', evenements.length);

                const stats = {
                    totalEvents: evenements.length,
                    publishedEvents: evenements.filter(e => e.published).length,
                    unpublishedEvents: evenements.filter(e => !e.published).length,
                    upcomingEvents: evenements.filter(e => {
                        const eventDate = new Date(e.eventDate);
                        return eventDate > new Date();
                    }).length
                };

                console.log('📊 Stats calculées côté client:', stats);
                return stats;
            } catch (apiError) {
                console.error('Erreur lors de la récupération des stats:', apiError);
                // Retourner des données par défaut au lieu de throw
                return {
                    totalEvents: 0,
                    publishedEvents: 0,
                    unpublishedEvents: 0,
                    upcomingEvents: 0
                };
            }
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1, // Réessayer seulement 1 fois
        retryDelay: 1000, // Attendre 1 seconde avant de réessayer
    };
}
// Hook pour récupérer les stats des événements
export const useEvenementStats = () => {
    return useQuery(evenementStatsQueryOption());
};

// Hook pour précharger les stats des événements
export const prefetchEvenementStats = () => {
    return queryClient.prefetchQuery(evenementStatsQueryOption());
}

// Fonction pour invalider le cache
export const invalidateEvenementStats = () => {
    return queryClient.invalidateQueries({
        queryKey: evenementQueryKey,
    });
}   
