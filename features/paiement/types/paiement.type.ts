import { IDemande } from "@/features/demande/types/demande.type";
import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export enum MethodePaiement {
    CASH = 'CASH',
    MOBILE_MONEY = 'MOBILE_MONEY',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CREDIT_CARD = 'CREDIT_CARD',
    OTHER = 'OTHER'
}

export interface IPaiement {
    id: string;
    requestId: string;
    amount: number;
    paymentDate: Date;
    method: MethodePaiement;
    transactionRef?: string;
    recordedById: string;
    createdAt: Date;
    updatedAt: Date;

    request?: IDemande;
    recordedBy?: IUtilisateur;
}