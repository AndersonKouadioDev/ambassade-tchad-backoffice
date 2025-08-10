import { z } from "zod";

// Schéma pour la création d'une dépense
export const DepenseCreateSchema = z.object({
    amount: z.number().positive("Le montant doit être positif"),
    description: z.string().optional(),
    categoryName: z.string().min(1, "Le nom de la catégorie est requis"),
    expenseDate: z.date().refine((date) => date <= new Date(), {
        message: "La date de dépense doit être inférieure ou égale à la date actuelle",
    }),
});
export type DepenseCreateDTO = z.infer<typeof DepenseCreateSchema>;

// Schéma pour la mise à jour d'une dépense
export const DepenseUpdateSchema = DepenseCreateSchema.partial();
export type DepenseUpdateDTO = z.infer<typeof DepenseUpdateSchema>;