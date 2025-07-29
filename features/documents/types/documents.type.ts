import { IDemande } from "@/features/demande/types/demande.type";
import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export interface IDocument {
    id: string;
    fileName: string;
    mimeType: string;
    filePath: string;
    fileSizeKB: number;
    requestId: string;
    uploaderId: string;
    createdAt: Date;
    updatedAt: Date;

    request?: IDemande;
    uploader?: IUtilisateur;
}