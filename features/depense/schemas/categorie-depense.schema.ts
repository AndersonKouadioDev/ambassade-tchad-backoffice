import { z } from "zod";

// Création d'une catégorie de dépense
export const CategorieDepenseCreateSchema = z.object({
    name: z.string().min(1, "Le nom de la catégorie est requis"),
    description: z.string().optional(),
    isActive: z.boolean(),
});
export type CategorieDepenseCreateDTO = z.infer<typeof CategorieDepenseCreateSchema>;

// Mise à jour d'une catégorie de dépense
export const CategorieDepenseUpdateSchema = CategorieDepenseCreateSchema.partial();
export type CategorieDepenseUpdateDTO = z.infer<typeof CategorieDepenseUpdateSchema>;