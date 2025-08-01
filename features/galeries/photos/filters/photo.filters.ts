import { parseAsString, parseAsInteger } from 'nuqs';

/**
 * @constant photoFiltersClient
 * @description Définit les schémas de parsing pour les paramètres de requête d'URL
 * utilisés pour filtrer et paginer la liste des photos.
 * Chaque propriété correspond à un paramètre d'URL et spécifie son type
 * et sa valeur par défaut.
 */
export const photoFiltersClient = {
    title: parseAsString.withDefault(''),
    description: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(12),
};