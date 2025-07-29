import { IDemande } from "./demande.type";

export enum ActeNaissanceType {
    NEWBORN = 'NEWBORN',
    RENEWAL = 'RENEWAL'
}
export interface IActeNaissanceDetails {
    id: string;
    requestId: string;
    personFirstName: string;
    personLastName: string;
    personBirthDate: Date;
    personBirthPlace: string;
    personNationality: string;
    personDomicile?: string;
    fatherFullName: string;
    motherFullName: string;
    requestType: ActeNaissanceType;
    createdAt: Date;
    updatedAt: Date;
    request?: IDemande;
}
