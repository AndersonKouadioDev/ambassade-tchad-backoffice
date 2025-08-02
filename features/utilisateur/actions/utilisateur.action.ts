"use server"
import { utilisateurAPI } from "../apis/utilisateur.api";
import { UtilisateurAddDTO, UtilisateurRoleDTO, UtilisateurUpdateDTO } from "../schema/utilisateur.schema";
import { IUtilisateursParams } from "../types/utilisateur.type";

export const obtenirTousUtilisateursAction = (params: IUtilisateursParams) => {
    return utilisateurAPI.obtenirTousUtilisateurs(params);
}

export const obtenirUnUtilisateurAction = (id: string) => {
    return utilisateurAPI.obtenirUtilisateur(id);
}

export const obtenirStatsUtilisateursAction = (type: "personnel" | "demandeur") => {
    return utilisateurAPI.obtenirStatsUtilisateurs(type);
}

export const ajouterUtilisateurAction = async (data: UtilisateurAddDTO) => {
    return await utilisateurAPI.ajouterUtilisateur(data);
}

export const modifierProfilAction = async (data: UtilisateurUpdateDTO) => {
    return await utilisateurAPI.modifierProfil(data);
}

export const modifierRoleAction = async (id: string, data: UtilisateurRoleDTO) => {
    return await utilisateurAPI.modifierRole(id, data);
}

export const activerUtilisateurAction = async (id: string) => {
    return await utilisateurAPI.activerUtilisateur(id);
}

export const desactiverUtilisateurAction = async (id: string) => {
    return await utilisateurAPI.desactiverUtilisateur(id);
}

export const supprimerUtilisateurAction = async (id: string) => {
    return await utilisateurAPI.supprimerUtilisateur(id);
}
