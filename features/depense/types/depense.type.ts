import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export enum CategoryDepense {
    SALARIES = "SALARIES",
    GENERAL_OVERHEAD = "GENERAL_OVERHEAD",
    RENT = "RENT",
    INTERNET_COMM = "INTERNET_COMM",
    UTILITIES = "UTILITIES",
    OTHER = "OTHER",
}

export interface IDepense {
    id: string;
    amount: number;
    description?: string;
    category: CategoryDepense;
    recordedById: string;
    recordedBy?: IUtilisateur;
    expenseDate: Date;
    createdAt: Date;
    updatedAt: Date;
}