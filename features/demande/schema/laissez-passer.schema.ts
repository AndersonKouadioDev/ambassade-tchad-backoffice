import { z } from 'zod';
import { ServiceType } from '@/features/service/types/service.type';
import { DocumentJustificationType } from '@/features/demande/types/carte-consulaire.type';

export const AccompagnateurSchema = z.object({
  firstName: z.string().max(255, "Le prénom ne doit pas dépasser 255 caractères.").min(1, "Le prénom est obligatoire."),
  lastName: z.string().max(255, "Le nom ne doit pas dépasser 255 caractères.").min(1, "Le nom est obligatoire."),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La date de naissance doit être au format YYYY-MM-DD.").min(1, "La date de naissance est obligatoire."),
  birthPlace: z.string().max(255, "Le lieu de naissance ne doit pas dépasser 255 caractères.").min(1, "Le lieu de naissance est obligatoire."),
  nationality: z.string().max(255, "La nationalité ne doit pas dépasser 255 caractères.").min(1, "La nationalité est obligatoire."),
  domicile: z.string().max(255, "Le domicile ne doit pas dépasser 255 caractères.").optional(),
});

export type AccompagnateurDTO = z.infer<typeof AccompagnateurSchema>;


export const LaissezPasserDetailsSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).default(ServiceType.LAISSEZ_PASSER).optional(),
  personFirstName: z.string({ message: "Le prénom du demandeur est obligatoire." })
    .min(1, "Le prénom du demandeur est obligatoire.")
    .max(255, "Le prénom du demandeur ne doit pas dépasser 255 caractères."),
  personLastName: z.string({ message: "Le nom du demandeur est obligatoire." })
    .min(1, "Le nom du demandeur est obligatoire.")
    .max(255, "Le nom du demandeur ne doit pas dépasser 255 caractères."),
  personBirthDate: z.string({ message: "La date de naissance est obligatoire." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date de naissance doit être au format YYYY-MM-DD.")
    .min(1, "La date de naissance est obligatoire."),
  personBirthPlace: z.string({ message: "Le lieu de naissance est obligatoire." })
    .min(1, "Le lieu de naissance est obligatoire.")
    .max(255, "Le lieu de naissance ne doit pas dépasser 255 caractères."),
  personProfession: z.string({ message: "La profession ne doit pas dépasser 255 caractères." })
    .max(255, "La profession ne doit pas dépasser 255 caractères.")
    .optional(),
  personNationality: z.string({ message: "La nationalité est obligatoire." })
    .min(1, "La nationalité est obligatoire.")
    .max(255, "La nationalité ne doit pas dépasser 255 caractères."),
  personDomicile: z.string({ message: "Le domicile est obligatoire." })
    .min(1, "Le domicile est obligatoire.")
    .max(255, "Le domicile ne doit pas dépasser 255 caractères."),
  fatherFullName: z.string({ message: "Le nom complet du père est obligatoire." })
    .min(1, "Le nom complet du père est obligatoire.")
    .max(255, "Le nom complet du père ne doit pas dépasser 255 caractères."),
  motherFullName: z.string({ message: "Le nom complet de la mère est obligatoire." })
    .min(1, "Le nom complet de la mère est obligatoire.")
    .max(255, "Le nom complet de la mère ne doit pas dépasser 255 caractères."),
  destination: z.string({ message: "La destination ne doit pas dépasser 255 caractères." })
    .max(255, "La destination ne doit pas dépasser 255 caractères.")
    .optional(),
  travelReason: z.string({ message: "Le motif du voyage ne doit pas dépasser 255 caractères." })
    .max(255, "Le motif du voyage ne doit pas dépasser 255 caractères.")
    .optional(),
  accompanied: z.boolean(),
  accompaniers: z.array(AccompagnateurSchema).optional(),
  justificationDocumentType: z.nativeEnum(DocumentJustificationType, { message: "Type de document justificatif invalide." }),
  justificationDocumentNumber: z.string({ message: "Le numéro du document justificatif est obligatoire." })
    .min(1, "Le numéro du document justificatif est obligatoire.")
    .max(255, "Le numéro du document justificatif ne doit pas dépasser 255 caractères."),
});

export type LaissezPasserDetailsDTO = z.infer<typeof LaissezPasserDetailsSchema>;