import { api } from "@/lib/api";
import { EvenementDTO, evenementSchema } from "../schemas/evenement.schema";
import { IEvenement } from "@/types/evenement.types";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { evenementAPI } from "../apis/evenement.api";

/**
 * Fonction pour créer un nouvel événement
 * @param formdata - Les données du formulaire à valider et envoyer
 * @returns Un objet indiquant le succès de l'opération et un message
 */
export async function createEvenement(
    formdata: EvenementDTO,
    formData?: FormData
): Promise<{ success: boolean; message: string }> {
    console.log('createEvenement - Données reçues:', formdata);
    console.log('createEvenement - FormData reçu:', formData);
    
    // Vérification des données du formulaire
    const result = processAndValidateFormData(evenementSchema, formdata, {
        outputFormat: "object",
    });

    console.log('createEvenement - Résultat validation:', result);

    if (!result.success) {
        console.error('createEvenement - Erreurs de validation:', result.errorsInString);
        return {
            success: false,
            message: result.errorsInString || "Des erreurs de validation sont survenues.",
        };
    }

    try {
        console.log('createEvenement - Appel API avec données:', result.data);
        console.log('createEvenement - Appel API avec FormData:', formData);
        
        // Création de l'événement
        const createdEvent = await evenementAPI.create(result.data as EvenementDTO, formData);
        
        console.log('createEvenement - Événement créé:', createdEvent);
        
        return {
            success: true,
            message: "Événement créé avec succès.",
        };
    } catch (apiError: any) {
        console.error('createEvenement - Erreur API:', apiError);
        console.error('createEvenement - Détails erreur:', {
            message: apiError.message,
            status: apiError.status,
            data: apiError.data,
        });
        
        return {
            success: false,
            message: apiError.message || "Erreur lors de la création de l'événement.",
        };
    }
}


// Mise à jour d'un événement existant
export async function updateEvenement(
    id: string,
    formdata: EvenementDTO
): Promise<{ success: boolean; message: string }> {
    // Vérification des données du formulaire
    const result = processAndValidateFormData(evenementSchema, formdata, {
        outputFormat: "object",
    });

    if (!result.success) {
        return {
            success: false,
            message: result.errorsInString || "Des erreurs de validation sont survenues.",
        };
    }

    // mise à jour de l'événement
    try {
        const updated = await evenementAPI.update(id, result.data as EvenementDTO);
        console.log("Événement mis à jour :", updated);
        return {
            success: true,
            message: "Événement mis à jour avec succès.",
        };
    } catch (apiError: any) {
        return {
            success: false,
            message: apiError.message || "Erreur lors de la mise à jour de l'événement.",
        };
    }
}
// Suppression d'un événement
export async function deleteEvenement(
    id: string
): Promise<{ success: boolean; message: string }> {
    // Vérification de l'ID de l'événement et verification de espace dans id
    if (!id || id.trim() === "") {
        return {
            success: false,
            message: "ID de l'événement requis.",
        };
    }
    // Vérification de l'existence de l'événement
    try {
        // Appel à l'API pour supprimer l'événement
        await evenementAPI.delete(id);
        return {
            success: true,
            message: "Événement supprimé avec succès.",
        };
    } catch (apiError: any) {
        return {
            success: false,
            message: apiError.message || "Erreur lors de la suppression de l'événement.",
        };
    }
}

