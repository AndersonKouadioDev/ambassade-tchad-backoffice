import { parseAsString, parseAsInteger } from "nuqs";

export const financialReportFiltersClient = {
    filter: {
        period: parseAsString.withDefault('year'),
        year: parseAsInteger.withDefault(new Date().getFullYear()),
        month: parseAsInteger.withDefault(1),
        quarter: parseAsInteger.withDefault(1),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500,
    }
}