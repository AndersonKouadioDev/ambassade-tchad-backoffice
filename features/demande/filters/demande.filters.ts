import { parseAsString, parseAsInteger, parseAsStringEnum } from 'nuqs';
import { DemandeStatus } from '../types/demande.type';
import { ServiceType } from '@/features/service/types/service.type';
import { getEnumValues } from '@/utils/getEnumValues';

export const demandeFiltersClient = {
    filter: {
        status: parseAsStringEnum<DemandeStatus>(getEnumValues(DemandeStatus)),
        serviceType: parseAsStringEnum<ServiceType>(getEnumValues(ServiceType)),
        userId: parseAsString,
        fromDate: parseAsString,
        toDate: parseAsString,
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(10),
        ticketNumber: parseAsString.withDefault(''),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500,
    }
};