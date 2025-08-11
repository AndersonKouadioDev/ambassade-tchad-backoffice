import { z } from "zod";

export const photoSchema = z.object({
    title: z.string({ message: "Titre requis" }).min(1, { message: "Le titre ne peut pas être vide" }),
    description: z.string({ message: "Description requise" }).min(1, { message: "La description ne peut pas être vide" }),
    images: z
        .array(
            z.instanceof(File)
                .refine((file) => file.type.startsWith('image/'), {
                    message: "Seuls les fichiers image sont autorisés",
                })
                .refine((file) => file.size <= 10 * 1024 * 1024, {
                    message: "La taille de chaque image ne doit pas dépasser 10 Mo",
                })
        )
        .optional(),
});

export type PhotoDTO = z.infer<typeof photoSchema>;