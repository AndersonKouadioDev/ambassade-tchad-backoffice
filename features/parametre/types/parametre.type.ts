import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export interface IParametre {
    id: string;
    key: string;
    value: string;
    description?: string;
    updatedById?: string;
    updatedBy?: IUtilisateur;
    createdAt: Date;
    updatedAt: Date;
}