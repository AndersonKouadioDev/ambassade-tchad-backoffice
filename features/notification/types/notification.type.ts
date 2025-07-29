import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export enum NotificationType {
    SYSTEM = "SYSTEM",
    PROMOTION = "PROMOTION",
    REQUEST_UPDATE = "REQUEST_UPDATE",
    ACCOUNT_UPDATE = "ACCOUNT_UPDATE",
}

export enum NotificationCible {
    INDIVIDUAL = "INDIVIDUAL",
    ALL_CLIENTS = "ALL_CLIENTS",
    ALL_PERSONNEL = "ALL_PERSONNEL",
    ROLE_ADMIN = "ROLE_ADMIN",
    ROLE_AGENT = "ROLE_AGENT",
    ROLE_CHEF_SERVICE = "ROLE_CHEF_SERVICE",
    ROLE_CONSUL = "ROLE_CONSUL",
}

export interface INotification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    userId: string;
    user?: IUtilisateur;
    target: NotificationCible;
    icon: string;
    iconBgColor: string;
    showChevron: boolean;
    data?: any; // JSON type in Prisma
    createdAt: Date;
    updatedAt: Date;
}

export interface IParametreNotification {
    id: string;
    userId: string;
    user?: IUtilisateur;
    requestUpdate: boolean;
    promotions: boolean;
    system: boolean;
    createdAt: Date;
    updatedAt: Date;
}