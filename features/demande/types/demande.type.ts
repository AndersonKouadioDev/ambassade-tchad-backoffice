import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";
import { ServiceType } from "@/features/service/types/service.type";
import { IVisaDetails } from "./visa.type";
import { IActeNaissanceDetails } from "./acte-naissance.type";
import { ICarteConsulaireDetails } from "./carte-consulaire.type ";
import { ILaissezPasserDetails } from "./laissez-passer.type";
import { IMariageDetails } from "./mariage.type";
import { IDecesDetails } from "./deces.type";
import { IProcurationDetails } from "./procuration.type";
import { ICertificatNationaliteDetails } from "./certificat-nationalite.type";
import { IDocument } from "@/features/documents/types/documents.type";
import { IPaiement } from "@/features/paiement/types/paiement.type";

export enum RequestStatus {
    NEW = 'NEW',
    IN_REVIEW_DOCS = 'IN_REVIEW_DOCS',
    PENDING_ADDITIONAL_INFO = 'PENDING_ADDITIONAL_INFO',
    APPROVED_BY_AGENT = 'APPROVED_BY_AGENT',
    APPROVED_BY_CHEF = 'APPROVED_BY_CHEF',
    APPROVED_BY_CONSUL = 'APPROVED_BY_CONSUL',
    REJECTED = 'REJECTED',
    READY_FOR_PICKUP = 'READY_FOR_PICKUP',
    DELIVERED = 'DELIVERED',
    ARCHIVED = 'ARCHIVED',
    EXPIRED = 'EXPIRED',
    RENEWAL_REQUESTED = 'RENEWAL_REQUESTED'
}

export interface IDemande {
    id: string;
    ticketNumber: string;
    userId: string;
    serviceType: ServiceType;
    status: RequestStatus;
    submissionDate: Date;
    completionDate?: Date;
    issuedDate?: Date;
    contactPhoneNumber?: string;
    observations?: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;

    user?: IUtilisateur;
    documents?: IDocument[];
    statusHistory?: IHistoriqueStatutDemande[];
    visaDetails?: IVisaDetails;
    birthActDetails?: IActeNaissanceDetails;
    consularCardDetails?: ICarteConsulaireDetails;
    laissezPasserDetails?: ILaissezPasserDetails;
    marriageCapacityActDetails?: IMariageDetails;
    deathActDetails?: IDecesDetails
    powerOfAttorneyDetails?: IProcurationDetails;
    nationalityCertificateDetails?: ICertificatNationaliteDetails;
    payment?: IPaiement;
}

export interface IHistoriqueStatutDemande {
    id: string;
    requestId: string;
    oldStatus?: RequestStatus;
    newStatus: RequestStatus;
    changerId: string;
    changedAt: Date;
    reason?: string;

    request?: IDemande;
    changer?: IUtilisateur;
}

