import { parseAsString, parseAsInteger } from "nuqs";

export const depenseFiltersClient = {
    filter: {
        // Filtrer par titre (chaîne de caractères)
        title: parseAsString.withDefault(''),
        // Filtrer par nom de catégorie (chaîne de caractères)
        category: parseAsString.withDefault(''),
        // Filtrer par description de la dépense
        description: parseAsString.withDefault(''),
        // Filtrer par montant minimum
        amount: parseAsInteger.withDefault(0),
        // Date de dépense (format string pour la recherche)
        expenseDate: parseAsString.withDefault(''),
        // Pagination
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(10),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500, // 500ms de délai pour les filtres textuels
    }
}
