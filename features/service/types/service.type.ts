import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export enum ServiceType {
    VISA = 'VISA',
    BIRTH_ACT_APPLICATION = 'BIRTH_ACT_APPLICATION',
    CONSULAR_CARD = 'CONSULAR_CARD',
    LAISSEZ_PASSER = 'LAISSEZ_PASSER',
    MARRIAGE_CAPACITY_ACT = 'MARRIAGE_CAPACITY_ACT',
    DEATH_ACT_APPLICATION = 'DEATH_ACT_APPLICATION',
    POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
    NATIONALITY_CERTIFICATE = 'NATIONALITY_CERTIFICATE'
}

export interface IService {
    id: string;
    type: ServiceType;
    name: string;
    description?: string;
    defaultPrice: number;
    isPriceVariable: boolean;
    updatedById?: string;
    createdAt: Date;
    updatedAt: Date;

    updatedBy?: IUtilisateur;
}