import { parseAsString, parseAsInteger } from 'nuqs';

/**
 * @constant videoFiltersClient
 * @description Définit les schémas de parsing pour les paramètres de requête d'URL
 * utilisés pour filtrer et paginer la liste des videos.
 * Chaque propriété correspond à un paramètre d'URL et spécifie son type
 * et sa valeur par défaut.
 */
export const videoFiltersClient = {
    filter: {
        title: parseAsString.withDefault(''),
        youtubeUrl: parseAsString.withDefault(''),
        description: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(12),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500,
    }
};