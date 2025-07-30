
import { parseAsString, parseAsInteger, parseAsStringEnum } from 'nuqs';
import { UtilisateurRole, UtilisateurStatus, UtilisateurType } from '@/features/utilisateur/types/utilisateur.type';
import { getEnumValues } from '@/utils/getEnumValues';

/**
 * @constant utilisateurFiltersClient
 * @description Définit les schémas de parsing pour les paramètres de requête d'URL
 * utilisés pour filtrer et paginer la liste des utilisateurs.
 * Chaque propriété correspond à un paramètre d'URL et spécifie son type
 * et sa valeur par défaut.
 */
export const utilisateurFiltersClient = {

    type: parseAsStringEnum<UtilisateurType>(getEnumValues(UtilisateurType)).withDefault(UtilisateurType.PERSONNEL),
    status: parseAsStringEnum<UtilisateurStatus>(getEnumValues(UtilisateurStatus)).withDefault(UtilisateurStatus.ACTIVE),
    role: parseAsStringEnum<UtilisateurRole>(getEnumValues(UtilisateurRole)),
    firstName: parseAsString.withDefault(''),
    lastName: parseAsString.withDefault(''),
    email: parseAsString.withDefault(''),
    phoneNumber: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
};