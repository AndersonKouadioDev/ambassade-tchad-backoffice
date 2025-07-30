import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export enum EvenementStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
}

export interface IEvenement {
    id: string;
    title: string;
    description: string;
    eventDate: Date;
    location?: string;
    imageUrl?: Array<string>;
    published: boolean;
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;

    author?: IUtilisateur;
}

export interface IEvenementRechercheParams {
    title?: string;
    description?: string;
    eventDate?: Date;
    published?: boolean;
    authorId?: string;
    status?: EvenementStatus;
    page?: number;
    limit?: number;
}

export interface IEvenementStats {
    allEvents: number;
    allEventsSeries: { date: string; value: number }[];
    publishedEvents: number;
    unpublishedEvents: number;
    eventsByAuthor: { authorId: string; count: number }[];
}