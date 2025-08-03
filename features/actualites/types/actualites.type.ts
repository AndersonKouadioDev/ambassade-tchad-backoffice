import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export interface IActualite {
    id: string;
    title: string;
    content: string;
    imageUrls?: string[]; // Images uploadées via fichiers
    published: boolean;
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;

    author?: IUtilisateur;
}

export interface IActualiteRechercheParams {
    title?: string;
    content?: string;
    published?: boolean;
    authorId?: string;
    page?: number;
    limit?: number;
}

export interface IActualiteStats {
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
