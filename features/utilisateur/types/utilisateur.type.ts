import { IDemande, IHistoriqueStatutDemande } from "@/features/demande/types/demande.type";
import { IDocument } from "@/features/documents/types/documents.type";
import { IPaiement } from "@/features/paiement/types/paiement.type";
import { IEvenement } from "@/features/evenement/types/evenement.type";

export enum UtilisateurRole {
  AGENT = "AGENT",
  CHEF_SERVICE = "CHEF_SERVICE",
  CONSUL = "CONSUL",
  ADMIN = "ADMIN",
}

export enum UtilisateurType {
  DEMANDEUR = "DEMANDEUR",
  PERSONNEL = "PERSONNEL",
}

export enum UtilisateurStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUtilisateur {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UtilisateurRole;
  type: UtilisateurType;
  status: UtilisateurStatus;
  isPasswordChangeRequired: boolean;
  createdAt: string;
  updatedAt: string;
  requests?: IDemande[];
  uploadedDocuments?: IDocument[];
  statusChanges?: IHistoriqueStatutDemande[];
  recordedPayments?: IPaiement[];
  // news?: News[];
  events?: IEvenement[];
  // expenses?: Expense[];
  // services?: Service[];
  // settings?: Setting[];
}

export interface IUtilisateursRechercheParams {
  type?: UtilisateurType;
  status?: UtilisateurStatus;
  role?: UtilisateurRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  page?: number;
  limit?: number;
}

export interface IUtilisateurStats {
  allUsers: number;
  allUsersSeries: { date: string; value: number }[]
  activeUsers: number;
  activeUsersSeries: { date: string; value: number }[]
  inactiveUsers: number;
  inactiveUsersSeries: { date: string; value: number }[]
  bannedUsers: number;
  bannedUsersSeries: { date: string; value: number }[]
}