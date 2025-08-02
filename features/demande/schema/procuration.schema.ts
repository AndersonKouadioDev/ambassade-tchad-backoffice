import { z } from 'zod';
import { ServiceType } from '@/features/service/types/service.type';
import { DocumentJustificationType } from '../types/carte-consulaire.type';

export const ProcurationDetailsSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).default(ServiceType.POWER_OF_ATTORNEY).optional(),
  agentFirstName: z.string({ message: "Le prénom de l'agent est obligatoire." })
    .min(1, { message: "Le prénom de l'agent est obligatoire." })
    .max(255, { message: "Le prénom de l'agent ne doit pas dépasser 255 caractères." }),
  agentLastName: z.string({ message: "Le nom de l'agent est obligatoire." })
    .min(1, { message: "Le nom de l'agent est obligatoire." })
    .max(255, { message: "Le nom de l'agent ne doit pas dépasser 255 caractères." }),
  agentJustificationDocumentType: z.nativeEnum(DocumentJustificationType, { message: "Type de document justificatif de l'agent invalide." }),
  agentIdDocumentNumber: z.string({ message: "Le numéro de pièce d'identité de l'agent est obligatoire." })
    .min(1, { message: "Le numéro de pièce d'identité de l'agent est obligatoire." })
    .max(255, { message: "Le numéro de pièce d'identité de l'agent ne doit pas dépasser 255 caractères." }),
  agentAddress: z.string({ message: "L'adresse de l'agent est obligatoire." })
    .min(1, { message: "L'adresse de l'agent est obligatoire." })
    .max(255, { message: "L'adresse de l'agent ne doit pas dépasser 255 caractères." }),
  principalFirstName: z.string({ message: "Le prénom du mandant est obligatoire." })
    .min(1, { message: "Le prénom du mandant est obligatoire." })
    .max(255, { message: "Le prénom du mandant ne doit pas dépasser 255 caractères." }),
  principalLastName: z.string({ message: "Le nom du mandant est obligatoire." })
    .min(1, { message: "Le nom du mandant est obligatoire." })
    .max(255, { message: "Le nom du mandant ne doit pas dépasser 255 caractères." }),
  principalJustificationDocumentType: z.nativeEnum(DocumentJustificationType, { message: "Type de document justificatif du mandant invalide." }),
  principalIdDocumentNumber: z.string({ message: "Le numéro de pièce d'identité du mandant est obligatoire." })
    .min(1, { message: "Le numéro de pièce d'identité du mandant est obligatoire." })
    .max(255, { message: "Le numéro de pièce d'identité du mandant ne doit pas dépasser 255 caractères." }),
  principalAddress: z.string({ message: "L'adresse du mandant est obligatoire." })
    .min(1, { message: "L'adresse du mandant est obligatoire." })
    .max(255, { message: "L'adresse du mandant ne doit pas dépasser 255 caractères." }),
  powerOfType: z.string({ message: "Le type de procuration ne doit pas dépasser 255 caractères." })
    .max(255, { message: "Le type de procuration ne doit pas dépasser 255 caractères." })
    .optional(),
  reason: z.string({ message: "La raison de la procuration ne doit pas dépasser 255 caractères." })
    .max(255, { message: "La raison de la procuration ne doit pas dépasser 255 caractères." })
    .optional(),
});

export type ProcurationDetailsDTO = z.infer<typeof ProcurationDetailsSchema>;