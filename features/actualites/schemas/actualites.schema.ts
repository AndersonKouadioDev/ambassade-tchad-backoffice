import { z } from "zod";

export const actualiteCreateSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    content: z.string().min(1, "Le contenu est requis"),
    published: z.boolean(),
    images: z
        .array(
            z
                .instanceof(File)
                .refine((file) => file.type.startsWith('image/'), {
                    message: "Seuls les fichiers image sont autorisés",
                })
                .refine((file) => file.size <= 10 * 1024 * 1024, {
                    message: "La taille de chaque image ne doit pas dépasser 10 Mo",
                })
        )
        .optional(),
});

export type ActualiteCreateDTO = z.infer<typeof actualiteCreateSchema>;
export const actualiteUpdateSchema = actualiteCreateSchema.partial();
export type ActualiteUpdateDTO = z.infer<typeof actualiteUpdateSchema>;