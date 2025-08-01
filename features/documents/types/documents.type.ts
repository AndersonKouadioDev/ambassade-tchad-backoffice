import { IDemande } from "@/features/demande/types/demande.type";
import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";

export interface IDocument {
    id: string;
    fileName: string;
    mimeType: string;
    filePath: string;
    fileSizeKB: number;
    requestId: string;
    request?: IDemande;
    uploaderId: string;
    uploader?: IUtilisateur;
    createdAt: Date;
    updatedAt: Date;
}