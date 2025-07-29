import { IDemande } from "./demande.type";

export enum PaysParentType {
    FATHER = 'FATHER',
    MOTHER = 'MOTHER'
}

export interface ICertificatNationaliteDetails {
    id: string;
    requestId: string;
    applicantFirstName: string;
    applicantLastName: string;
    applicantBirthDate: Date;
    applicantBirthPlace: string;
    applicantNationality: string;
    originCountryParentFirstName: string;
    originCountryParentLastName: string;
    originCountryParentRelationship: PaysParentType;
    createdAt: Date;
    updatedAt: Date;
    request?: IDemande;
}
