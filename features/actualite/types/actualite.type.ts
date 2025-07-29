import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";


export interface IActualite {
    id: string;
    title: string;
    content: string;
    imageUrls: string[];
    published: boolean;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;

    author?: IUtilisateur;
}