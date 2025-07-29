
/**
 * @function getEnumValues
 * @description Fonction utilitaire pour extraire les valeurs de chaîne d'un enum TypeScript.
 * Elle est nécessaire pour `parseAsStringEnum` de Nuqs, qui a besoin d'un tableau
 * de toutes les valeurs de chaîne possibles de l'enum pour valider le paramètre d'URL.
 * @param {T} enumObject L'objet enum (ex: UtilisateurRole, UtilisateurStatus).
 * @returns {Array<T[keyof T]>} Un tableau des valeurs de chaîne de l'enum.
 */
export function getEnumValues<T extends Record<string, any>>(enumObject: T): Array<T[keyof T]> {
    // Pour les enums de chaînes, Object.values() retourne directement les valeurs des chaînes.
    // Pour les enums numériques, Object.values() retournerait à la fois les clés et les valeurs numériques,
    // d'où la nécessité de filtrer pour obtenir seulement les valeurs numériques.
    // Dans votre cas, comme ce sont des enums de chaînes, un simple Object.values() suffit,
    // mais un filtre peut aider à assurer la robustesse si l'enum changeait de type.
    // Cependant, pour la clarté et la compatibilité avec parseAsStringEnum,
    // nous voulons un tableau de strings.
    return Object.values(enumObject).filter(value => typeof value === 'string') as Array<T[keyof T]>;
}
