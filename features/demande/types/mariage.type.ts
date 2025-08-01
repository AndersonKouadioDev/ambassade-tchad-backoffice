import { IDemande } from "./demande.type";

export interface IMariageDetails {
    id: string;
    requestId: string;
    husbandFirstName: string;
    husbandLastName: string;
    husbandBirthDate: Date;
    husbandBirthPlace: string;
    husbandNationality: string;
    husbandDomicile?: string;
    wifeFirstName: string;
    wifeLastName: string;
    wifeBirthDate: Date;
    wifeBirthPlace: string;
    wifeNationality: string;
    wifeDomicile?: string;
    createdAt: Date;
    updatedAt: Date;

    request?: IDemande;
}