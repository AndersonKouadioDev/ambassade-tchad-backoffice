import { z } from "zod";

export const actualiteSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    imageUrl: z.array(z.string()).optional(),
    published: z.boolean(),
});

export type ActualiteDTO = z.infer<typeof actualiteSchema>;