import { IDemande } from "./demande.type";

export interface IDecesDetails {
    id: string;
    requestId: string;
    deceasedFirstName: string;
    deceasedLastName: string;
    deceasedBirthDate: Date;
    deceasedDeathDate: Date;
    deceasedNationality: string;
    createdAt: Date;
    updatedAt: Date;

    request?: IDemande;
}