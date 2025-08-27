import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";


export interface IEvenement {
    id: string;
    title: string;
    description: string;
    eventDate: Date;
    location?: string;
    imageUrl: string[];
    published: boolean;
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;

    author?: IUtilisateur;
}

export interface IEvenementRechercheParams {
    title?: string;
    authorId?: string;
    published?: boolean;
    location?: String;
    eventDate?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}

export interface IEvenementStats {
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