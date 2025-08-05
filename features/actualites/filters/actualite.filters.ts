import { parseAsString, parseAsInteger, parseAsStringEnum } from 'nuqs';

export const actualiteFiltersClient = {
    filter: {
        title: parseAsString.withDefault(''),
        content: parseAsString.withDefault(''),
        published: parseAsStringEnum(['true', 'false', 'all']).withDefault('all'),
        authorId: parseAsString.withDefault(''),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(12),
        dateFrom: parseAsString.withDefault(''),
        dateTo: parseAsString.withDefault(''),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500,
    }
};