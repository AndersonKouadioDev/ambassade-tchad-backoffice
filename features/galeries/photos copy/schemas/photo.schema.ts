import { z } from "zod";

export const photoSchema = z.object({
    title: z.string({ message: "Titre requis" }).min(1, { message: "Le titre ne peut pas être vide" }),
    description: z.string({ message: "Description requise" }).min(1, { message: "La description ne peut pas être vide" }),
    imageUrl: z.array(z.string()).optional().or(z.undefined()).or(z.null()),
});

export type PhotoDTO = z.infer<typeof photoSchema>;
