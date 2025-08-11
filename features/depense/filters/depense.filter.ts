import { parseAsString, parseAsInteger } from "nuqs";

export const depenseFiltersClient = {
    filter: {
        category: parseAsString.withDefault(''),
        description: parseAsString.withDefault(''),
        amount: parseAsInteger.withDefault(0),
        expenseDate: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(10),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500,
    }
}
