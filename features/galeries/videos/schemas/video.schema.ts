import { z } from "zod";

export const videoSchema = z.object({
    title: z.string({ message: "Titre requis" }).min(1, { message: "Le titre ne peut pas être vide" }),
    description: z.string({ message: "Description requise" }).min(1, { message: "La description ne peut pas être vide" }),
    youtubeUrl: z.string({ message: "URL de la vidéo requise" }).min(1, { message: "L'URL de la vidéo ne peut pas être vide" }),
});

export type VideoDTO = z.infer<typeof videoSchema>;
