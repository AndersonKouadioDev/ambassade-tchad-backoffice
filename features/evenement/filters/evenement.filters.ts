import { parseAsString, parseAsInteger, parseAsStringEnum } from 'nuqs';

/**
 * @constant evenementFiltersClient
 * @description Définit les schémas de parsing pour les paramètres de requête d'URL
 * utilisés pour filtrer et paginer la liste des événements.
 * Chaque propriété correspond à un paramètre d'URL et spécifie son type
 * et sa valeur par défaut.
 */
export const evenementFiltersClient = {
    title: parseAsString.withDefault(''),
    description: parseAsString.withDefault(''),
    published: parseAsStringEnum(['true', 'false', 'all']).withDefault('all'),
    authorId: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(12),
};