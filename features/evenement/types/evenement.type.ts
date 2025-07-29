import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export interface IEvenement {
    id: string;
    title: string;
    description: string;
    eventDate: Date;
    location?: string;
    imageUrl?: string;
    published: boolean;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;

    author?: IUtilisateur;
}
