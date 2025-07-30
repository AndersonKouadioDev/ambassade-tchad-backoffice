import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";


export enum ActualiteStatus {
    PUBLISHED = "PUBLISHED",
    UNPUBLISHED = "UNPUBLISHED",
    DRAFT = "DRAFT"
}



export interface IActualite {   
    id: string;
    title: string;
    content: string;
    imageUrl?: Array<string>;
    published: boolean;
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;

    author?: IUtilisateur;
}

export interface IActualiteRechercheParams {
    status: any;
    title?: string;
    content?: string;
    published?: boolean;
    authorId?: string;
    page?: number;
    limit?: number;
}

export interface IActualiteStats {
    allActualites: number;
    allActualitesSeries: { date: string; value: number }[];
    publishedActualites: number;
    unpublishedActualites: number;
    actualitesByAuthor: { authorId: string; count: number }[];
}
