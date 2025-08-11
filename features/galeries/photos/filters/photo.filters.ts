import { parseAsString, parseAsInteger } from 'nuqs';

export const photoFiltersClient = {
    filter: {
        title: parseAsString.withDefault(''),
        description: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(12),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500,
    }
};