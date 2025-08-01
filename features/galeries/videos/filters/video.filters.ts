import  {parseAsInteger, parseAsString } from "nuqs";



export const videoFiltersClient = {
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    title: parseAsString,
    description: parseAsString,
};