import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export interface IActualite {
    id: string;
    title: string;
    content: string;
    imageUrls?: string[];
    published: boolean;
    authorId: string;
    createdAt?: string;
    updatedAt?: string;

    author?: IUtilisateur;
}

export interface IActualiteRechercheParams {
    title?: string;
    content?: string;
    published?: boolean;
    authorId?: string;
    page?: number;
    limit?: number;
    toDate?: string;
    fromDate?: string;
}

export interface IActualiteStatsResponse {
    total: number;
    published: number;
    unpublished: number;
    byAuthor: {
        authorId: string;
        _count: {
            id: number;
        };
    }[];
}
