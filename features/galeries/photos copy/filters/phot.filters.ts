import { parseAsBoolean, parseAsInteger, parseAsString } from "nuqs";



export const photoFiltersClient = {
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    title: parseAsString,
    description: parseAsString,
};