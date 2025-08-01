import {z} from 'zod';

export const evenementSchema = z.object({  
    title: z.string({ message: "Titre requis" }).min(1, { message: "Le titre ne peut pas être vide" }),
    description: z.string({ message: "Description requise" }).min(1, { message: "La description ne peut pas être vide" }),
    eventDate: z.string({ message: "Date de l'événement requise" }).min(1, { message: "La date de l'événement ne peut pas être vide" }),
    location: z.string().optional(),
    published: z.boolean().default(false),
    imageUrl: z.array(z.string()).optional().or(z.undefined()).or(z.null()),
});

export type EvenementDTO = z.infer<typeof evenementSchema>;
