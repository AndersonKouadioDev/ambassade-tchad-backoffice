import { DemandeStatus } from "@/features/demande/types/demande.type";
import { ServiceType } from "@/features/service/types/service.type";
import { UtilisateurRole, UtilisateurStatus } from "@/features/utilisateur/types/utilisateur.type";

export interface IStatistiqueResponse {
    totalRequests: number;
    totalExpenses: number;
    personnelCount: number;
    demandeurCount: number;
    recentStatusHistory: IRecentStatusHistory[];
    recentPersonnel: IRecentPersonnel[];
    recentDemandeurs: IRecentDemandeurs[];
    contentStats: IContentStats;
}

export interface IRecentStatusHistory {
    date: Date;
    personName: string;
    serviceType: ServiceType;
    ticketNumber: string;
    status: DemandeStatus;
    amount: number;
}

export interface IRecentPersonnel {
    firstName: string | null;
    lastName: string | null;
    role: UtilisateurRole | null;
    status: UtilisateurStatus;
    createdAt: Date;
}

export interface IRecentDemandeurs {
    firstName: string | null;
    lastName: string | null;
    createdAt: Date;
}

export interface IContentStats {
    news: number;
    events: number;
    photos: number;
    videos: number;
}

export interface IStatistiqueOptions {
    fromDate?: string;
    toDate?: string;
}