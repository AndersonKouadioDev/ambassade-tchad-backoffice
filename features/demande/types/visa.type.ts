import { Genre, IDemande, SituationMatrimoniale } from "./demande.type";

export enum PassportType {
    ORDINARY = 'ORDINARY',
    SERVICE = 'SERVICE',
    DIPLOMATIC = 'DIPLOMATIC'
}

export enum VisaType {
    SHORT_STAY = 'SHORT_STAY',
    LONG_STAY = 'LONG_STAY',
    TRANSIT = 'TRANSIT',
    OTHER = 'OTHER'
}

export interface IVisaDetails {
    id: string;
    requestId: string;
    personFirstName: string;
    personLastName: string;
    personGender: Genre;
    personNationality: string;
    personBirthDate: Date;
    personBirthPlace: string;
    personMaritalStatus: SituationMatrimoniale;
    passportType: PassportType;
    passportNumber: string;
    passportIssuedBy: string;
    passportIssueDate: Date;
    passportExpirationDate: Date;
    profession?: string;
    employerAddress?: string;
    employerPhoneNumber?: string;
    visaType: VisaType;
    durationMonths: number;
    destinationState?: string;
    visaExpirationDate?: Date;
    createdAt: Date;
    updatedAt: Date;

    request?: IDemande;

}