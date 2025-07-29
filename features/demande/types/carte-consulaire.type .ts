import { IDemande } from "./demande.type";

export enum DocumentJustificationType {
    PASSPORT = 'PASSPORT',
    NATIONAL_ID_CARD = 'NATIONAL_ID_CARD',
    BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
    OTHER = 'OTHER'
}

export interface ICarteConsulaireDetails {
    id: string;
    requestId: string;
    personFirstName: string;
    personLastName: string;
    personBirthDate: Date;
    personBirthPlace: string;
    personProfession?: string;
    personNationality: string;
    personDomicile?: string;
    personAddressInOriginCountry?: string;
    fatherFullName?: string;
    motherFullName?: string;
    justificationDocumentType?: DocumentJustificationType;
    justificationDocumentNumber?: string;
    cardExpirationDate?: Date;
    createdAt: Date;
    updatedAt: Date;

    request?: IDemande;
}