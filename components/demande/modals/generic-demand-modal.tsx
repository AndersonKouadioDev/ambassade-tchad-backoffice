"use client";

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GenericForm from '../forms/generic-form';
import Image from 'next/image';
import type { ServiceType } from '@/types/demande.types';
import * as z from 'zod';

// Schémas de validation pour différents types de demandes
const visaSchema = z.object({
  // Informations personnelles
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Veuillez sélectionner le genre' }),
  nationality: z.string().min(2, 'La nationalité est requise'),
  birthDate: z.date({ required_error: 'La date de naissance est requise' }),
  birthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'], {
    required_error: 'Veuillez sélectionner le statut matrimonial'
  }),
  
  // Informations de passeport
  passportType: z.enum(['ORDINARY', 'DIPLOMATIC', 'SERVICE'], {
    required_error: 'Veuillez sélectionner le type de passeport'
  }),
  passportNumber: z.string().min(6, 'Le numéro de passeport doit contenir au moins 6 caractères'),
  passportIssueAuthority: z.string().min(2, 'L\'autorité de délivrance est requise'),
  passportIssueDate: z.date({ required_error: 'La date de délivrance est requise' }),
  passportExpirationDate: z.date({ required_error: 'La date d\'expiration est requise' }),
  
  // Informations professionnelles (optionnelles)
  profession: z.string().optional(),
  employer: z.string().optional(),
  
  // Détails du visa
  visaType: z.enum(['TOURIST', 'BUSINESS', 'TRANSIT', 'STUDENT', 'WORK'], {
    required_error: 'Veuillez sélectionner le type de visa'
  }),
  visaDuration: z.string().min(1, 'La durée du visa est requise'),
  destination: z.string().min(2, 'La destination est requise'),
  amount: z.number().min(0, 'Le montant doit être positif'),
  
  // Informations de contact
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  address: z.string().min(5, 'L\'adresse complète est requise'),
});

const passportSchema = z.object({
  // Informations personnelles
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Veuillez sélectionner le genre' }),
  nationality: z.string().min(2, 'La nationalité est requise'),
  birthDate: z.date({ required_error: 'La date de naissance est requise' }),
  birthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'], {
    required_error: 'Veuillez sélectionner le statut matrimonial'
  }),
  height: z.number().min(100).max(250, 'La taille doit être entre 100 et 250 cm'),
  eyeColor: z.string().min(2, 'La couleur des yeux est requise'),
  
  // Informations d'adresse
  address: z.string().min(5, 'L\'adresse complète est requise'),
  city: z.string().min(2, 'La ville est requise'),
  postalCode: z.string().min(3, 'Le code postal est requis'),
  country: z.string().min(2, 'Le pays est requis'),
  
  // Informations de contact
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  
  // Informations professionnelles (optionnelles)
  profession: z.string().optional(),
  employer: z.string().optional(),
  
  // Détails du passeport
  passportType: z.enum(['ORDINARY', 'DIPLOMATIC', 'SERVICE'], {
    required_error: 'Veuillez sélectionner le type de passeport'
  }),
  isRenewal: z.boolean(),
  oldPassportNumber: z.string().optional(),
  amount: z.number().min(0, 'Le montant doit être positif'),
  
  // Contact d'urgence
  emergencyContactName: z.string().min(2, 'Le nom du contact d\'urgence est requis'),
  emergencyContactPhone: z.string().min(8, 'Le téléphone du contact d\'urgence est requis'),
  emergencyContactRelation: z.string().min(2, 'La relation avec le contact d\'urgence est requise'),
});

// Configuration des sections pour chaque type de demande
const getFormSections = (serviceType: ServiceType) => {
  const commonPersonalFields = [
    {
      name: 'firstName',
      label: 'Prénom',
      type: 'text' as const,
      required: true,
      placeholder: 'Votre prénom',
      gridCols: 1 as const
    },
    {
      name: 'lastName',
      label: 'Nom',
      type: 'text' as const,
      required: true,
      placeholder: 'Votre nom de famille',
      gridCols: 1 as const
    },
    {
      name: 'gender',
      label: 'Genre',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'MALE', label: 'Masculin' },
        { value: 'FEMALE', label: 'Féminin' }
      ],
      gridCols: 1 as const
    },
    {
      name: 'nationality',
      label: 'Nationalité',
      type: 'text' as const,
      required: true,
      placeholder: 'Votre nationalité',
      gridCols: 1 as const
    },
    {
      name: 'birthDate',
      label: 'Date de naissance',
      type: 'date' as const,
      required: true,
      gridCols: 1 as const
    },
    {
      name: 'birthPlace',
      label: 'Lieu de naissance',
      type: 'text' as const,
      required: true,
      placeholder: 'Ville, Pays',
      gridCols: 1 as const
    },
    {
      name: 'maritalStatus',
      label: 'Statut matrimonial',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'SINGLE', label: 'Célibataire' },
        { value: 'MARRIED', label: 'Marié(e)' },
        { value: 'DIVORCED', label: 'Divorcé(e)' },
        { value: 'WIDOWED', label: 'Veuf/Veuve' }
      ],
      gridCols: 1 as const
    }
  ];

  const contactFields = [
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      placeholder: 'votre.email@exemple.com',
      gridCols: 1 as const
    },
    {
      name: 'phone',
      label: 'Téléphone',
      type: 'tel' as const,
      required: true,
      placeholder: '+235 XX XX XX XX',
      gridCols: 1 as const
    }
  ];

  if (serviceType === 'VISA') {
    return [
      {
        title: 'Informations personnelles',
        description: 'Veuillez fournir vos informations personnelles exactement comme elles apparaissent sur votre passeport.',
        fields: commonPersonalFields
      },
      {
        title: 'Informations de passeport',
        description: 'Détails de votre passeport actuel et valide.',
        fields: [
          {
            name: 'passportType',
            label: 'Type de passeport',
            type: 'select' as const,
            required: true,
            options: [
              { value: 'ORDINARY', label: 'Ordinaire' },
              { value: 'DIPLOMATIC', label: 'Diplomatique' },
              { value: 'SERVICE', label: 'Service' }
            ],
            gridCols: 1 as const
          },
          {
            name: 'passportNumber',
            label: 'Numéro de passeport',
            type: 'text' as const,
            required: true,
            placeholder: 'Numéro de passeport',
            gridCols: 1 as const
          },
          {
            name: 'passportIssueAuthority',
            label: 'Autorité de délivrance',
            type: 'text' as const,
            required: true,
            placeholder: 'Autorité qui a délivré le passeport',
            gridCols: 1 as const
          },
          {
            name: 'passportIssueDate',
            label: 'Date de délivrance',
            type: 'date' as const,
            required: true,
            gridCols: 1 as const
          },
          {
            name: 'passportExpirationDate',
            label: 'Date d\'expiration',
            type: 'date' as const,
            required: true,
            gridCols: 1 as const
          }
        ]
      },
      {
        title: 'Informations de contact',
        description: 'Coordonnées pour vous contacter concernant votre demande.',
        fields: [
          ...contactFields,
          {
            name: 'address',
            label: 'Adresse complète',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Votre adresse complète',
            gridCols: 3 as const,
            rows: 3
          }
        ]
      },
      {
        title: 'Informations professionnelles',
        description: 'Informations sur votre activité professionnelle (optionnel).',
        fields: [
          {
            name: 'profession',
            label: 'Profession',
            type: 'text' as const,
            placeholder: 'Votre profession',
            gridCols: 1 as const
          },
          {
            name: 'employer',
            label: 'Employeur',
            type: 'text' as const,
            placeholder: 'Nom de votre employeur',
            gridCols: 1 as const
          }
        ]
      },
      {
        title: 'Détails du visa',
        description: 'Informations spécifiques à votre demande de visa.',
        fields: [
          {
            name: 'visaType',
            label: 'Type de visa',
            type: 'select' as const,
            required: true,
            options: [
              { value: 'TOURIST', label: 'Touristique' },
              { value: 'BUSINESS', label: 'Affaires' },
              { value: 'TRANSIT', label: 'Transit' },
              { value: 'STUDENT', label: 'Étudiant' },
              { value: 'WORK', label: 'Travail' }
            ],
            gridCols: 1 as const
          },
          {
            name: 'visaDuration',
            label: 'Durée du séjour',
            type: 'text' as const,
            required: true,
            placeholder: 'Ex: 30 jours, 3 mois',
            gridCols: 1 as const
          },
          {
            name: 'destination',
            label: 'Destination au Tchad',
            type: 'text' as const,
            required: true,
            placeholder: 'Ville de destination',
            gridCols: 1 as const
          },
          {
            name: 'amount',
            label: 'Montant des frais (FCFA)',
            type: 'number' as const,
            required: true,
            min: 0,
            gridCols: 1 as const
          }
        ]
      }
    ];
  }

  if (serviceType === 'PASSPORT') {
    return [
      {
        title: 'Informations personnelles',
        description: 'Veuillez fournir vos informations personnelles complètes.',
        fields: [
          ...commonPersonalFields,
          {
            name: 'height',
            label: 'Taille (cm)',
            type: 'number' as const,
            required: true,
            min: 100,
            max: 250,
            gridCols: 1 as const
          },
          {
            name: 'eyeColor',
            label: 'Couleur des yeux',
            type: 'text' as const,
            required: true,
            placeholder: 'Ex: Marron, Noir, Bleu',
            gridCols: 1 as const
          }
        ]
      },
      {
        title: 'Adresse de résidence',
        description: 'Votre adresse de résidence actuelle.',
        fields: [
          {
            name: 'address',
            label: 'Adresse',
            type: 'text' as const,
            required: true,
            placeholder: 'Numéro et nom de rue',
            gridCols: 2 as const
          },
          {
            name: 'city',
            label: 'Ville',
            type: 'text' as const,
            required: true,
            placeholder: 'Ville',
            gridCols: 1 as const
          },
          {
            name: 'postalCode',
            label: 'Code postal',
            type: 'text' as const,
            required: true,
            placeholder: 'Code postal',
            gridCols: 1 as const
          },
          {
            name: 'country',
            label: 'Pays',
            type: 'text' as const,
            required: true,
            placeholder: 'Pays de résidence',
            gridCols: 1 as const
          }
        ]
      },
      {
        title: 'Informations de contact',
        description: 'Coordonnées pour vous contacter concernant votre demande.',
        fields: contactFields
      },
      {
        title: 'Informations professionnelles',
        description: 'Informations sur votre activité professionnelle (optionnel).',
        fields: [
          {
            name: 'profession',
            label: 'Profession',
            type: 'text' as const,
            placeholder: 'Votre profession',
            gridCols: 1 as const
          },
          {
            name: 'employer',
            label: 'Employeur',
            type: 'text' as const,
            placeholder: 'Nom de votre employeur',
            gridCols: 1 as const
          }
        ]
      },
      {
        title: 'Détails du passeport',
        description: 'Informations spécifiques à votre demande de passeport.',
        fields: [
          {
            name: 'passportType',
            label: 'Type de passeport',
            type: 'select' as const,
            required: true,
            options: [
              { value: 'ORDINARY', label: 'Ordinaire' },
              { value: 'DIPLOMATIC', label: 'Diplomatique' },
              { value: 'SERVICE', label: 'Service' }
            ],
            gridCols: 1 as const
          },
          {
            name: 'isRenewal',
            label: 'Renouvellement de passeport',
            type: 'checkbox' as const,
            gridCols: 1 as const
          },
          {
            name: 'oldPassportNumber',
            label: 'Numéro de l\'ancien passeport',
            type: 'text' as const,
            placeholder: 'Si renouvellement',
            gridCols: 1 as const
          },
          {
            name: 'amount',
            label: 'Montant des frais (FCFA)',
            type: 'number' as const,
            required: true,
            min: 0,
            gridCols: 1 as const
          }
        ]
      },
      {
        title: 'Contact d\'urgence',
        description: 'Personne à contacter en cas d\'urgence.',
        fields: [
          {
            name: 'emergencyContactName',
            label: 'Nom complet',
            type: 'text' as const,
            required: true,
            placeholder: 'Nom du contact d\'urgence',
            gridCols: 1 as const
          },
          {
            name: 'emergencyContactPhone',
            label: 'Téléphone',
            type: 'tel' as const,
            required: true,
            placeholder: 'Numéro de téléphone',
            gridCols: 1 as const
          },
          {
            name: 'emergencyContactRelation',
            label: 'Relation',
            type: 'text' as const,
            required: true,
            placeholder: 'Ex: Époux/Épouse, Parent, Ami',
            gridCols: 1 as const
          }
        ]
      }
    ];
  }

  // Configuration par défaut pour autres types
  return [
    {
      title: 'Informations générales',
      description: 'Veuillez fournir les informations requises pour votre demande.',
      fields: [
        ...commonPersonalFields,
        ...contactFields,
        {
          name: 'description',
          label: 'Description de la demande',
          type: 'textarea' as const,
          required: true,
          placeholder: 'Décrivez votre demande en détail',
          gridCols: 3 as const,
          rows: 4
        }
      ]
    }
  ];
};

interface GenericDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  mode?: 'create' | 'edit';
  initialData?: any;
  onSubmit: (data: any, files: File[]) => Promise<void>;
  isLoading?: boolean;
}

const GenericDemandModal: React.FC<GenericDemandModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  mode = 'create',
  initialData,
  onSubmit,
  isLoading = false
}) => {
  const sections = getFormSections(serviceType);
  const validationSchema = serviceType === 'VISA' ? visaSchema : 
                          serviceType === 'PASSPORT' ? passportSchema : 
                          z.object({}); // Schema par défaut

  const handleSubmit = async (data: any, files: File[]) => {
    try {
      await onSubmit(data, files);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* En-tête du modal */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-yellow-500">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 bg-white rounded-full p-2">
                      <Image
                        src="/images/logo/logo.png"
                        alt="Logo Ambassade du Tchad"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {mode === 'create' ? 'Nouvelle demande' : 'Modifier la demande'}
                      </Dialog.Title>
                      <p className="text-blue-100 text-sm">
                        Ambassade de la République du Tchad
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Contenu du formulaire */}
                <div className="max-h-[80vh] overflow-y-auto p-6">
                  <GenericForm
                    serviceType={serviceType}
                    sections={sections}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    initialData={initialData}
                    mode={mode}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GenericDemandModal;