import { 
  ServiceType, 
  ServiceFormConfig, 
  FormField, 
  Gender, 
  MaritalStatus, 
  PassportType,
  VisaType 
} from '@/types/demande.types';

// Configuration des champs communs
const personalInfoFields: FormField[] = [
  {
    name: 'personFirstName',
    label: 'Prénom',
    type: 'text',
    required: true,
    placeholder: 'Entrez le prénom',
    colSpan: 1
  },
  {
    name: 'personLastName',
    label: 'Nom de famille',
    type: 'text',
    required: true,
    placeholder: 'Entrez le nom de famille',
    colSpan: 1
  },
  {
    name: 'personGender',
    label: 'Genre',
    type: 'select',
    required: true,
    options: [
      { value: 'MALE', label: 'Masculin' },
      { value: 'FEMALE', label: 'Féminin' }
    ],
    colSpan: 1
  },
  {
    name: 'personNationality',
    label: 'Nationalité',
    type: 'text',
    required: true,
    placeholder: 'Nationalité',
    colSpan: 1
  },
  {
    name: 'personBirthDate',
    label: 'Date de naissance',
    type: 'date',
    required: true,
    colSpan: 1
  },
  {
    name: 'personBirthPlace',
    label: 'Lieu de naissance',
    type: 'text',
    required: true,
    placeholder: 'Lieu de naissance',
    colSpan: 1
  }
];

// Configuration pour les demandes de VISA
const visaFormConfig: ServiceFormConfig = {
  serviceType: ServiceType.VISA,
  title: 'Demande de Visa',
  description: 'Formulaire de demande de visa pour le Tchad',
  sections: [
    {
      title: 'Informations personnelles',
      description: 'Informations de base du demandeur',
      fields: [
        ...personalInfoFields,
        {
          name: 'personMaritalStatus',
          label: 'Statut matrimonial',
          type: 'select',
          required: true,
          options: [
            { value: 'SINGLE', label: 'Célibataire' },
            { value: 'MARRIED', label: 'Marié(e)' },
            { value: 'DIVORCED', label: 'Divorcé(e)' },
            { value: 'WIDOWED', label: 'Veuf/Veuve' }
          ],
          colSpan: 1
        }
      ]
    },
    {
      title: 'Informations de passeport',
      description: 'Détails du passeport du demandeur',
      fields: [
        {
          name: 'passportType',
          label: 'Type de passeport',
          type: 'select',
          required: true,
          options: [
            { value: 'ORDINARY', label: 'Ordinaire' },
            { value: 'SERVICE', label: 'Service' },
            { value: 'DIPLOMATIC', label: 'Diplomatique' }
          ],
          colSpan: 1
        },
        {
          name: 'passportNumber',
          label: 'Numéro de passeport',
          type: 'text',
          required: true,
          placeholder: 'Numéro de passeport',
          colSpan: 1
        },
        {
          name: 'passportIssuedBy',
          label: 'Délivré par',
          type: 'text',
          required: true,
          placeholder: 'Autorité de délivrance',
          colSpan: 2
        },
        {
          name: 'passportIssueDate',
          label: 'Date de délivrance',
          type: 'date',
          required: true,
          colSpan: 1
        },
        {
          name: 'passportExpirationDate',
          label: 'Date d\'expiration',
          type: 'date',
          required: true,
          colSpan: 1
        }
      ]
    },
    {
      title: 'Informations professionnelles',
      description: 'Détails sur l\'emploi (optionnel)',
      fields: [
        {
          name: 'profession',
          label: 'Profession',
          type: 'text',
          placeholder: 'Votre profession',
          colSpan: 2
        },
        {
          name: 'employerAddress',
          label: 'Adresse de l\'employeur',
          type: 'textarea',
          placeholder: 'Adresse complète de l\'employeur',
          colSpan: 2
        },
        {
          name: 'employerPhoneNumber',
          label: 'Téléphone de l\'employeur',
          type: 'tel',
          placeholder: 'Numéro de téléphone',
          colSpan: 1
        }
      ]
    },
    {
      title: 'Détails du visa',
      description: 'Informations spécifiques au visa demandé',
      fields: [
        {
          name: 'visaType',
          label: 'Type de visa',
          type: 'select',
          required: true,
          options: [
            { value: 'SHORT_STAY', label: 'Court séjour' },
            { value: 'LONG_STAY', label: 'Long séjour' }
          ],
          colSpan: 1
        },
        {
          name: 'durationMonths',
          label: 'Durée (mois)',
          type: 'number',
          required: true,
          validation: { min: 1, max: 60 },
          colSpan: 1
        },
        {
          name: 'destinationState',
          label: 'État de destination',
          type: 'text',
          placeholder: 'État ou région de destination',
          colSpan: 2
        }
      ]
    },
    {
      title: 'Informations de contact',
      fields: [
        {
          name: 'amount',
          label: 'Montant (FCFA)',
          type: 'number',
          required: true,
          validation: { min: 0 },
          colSpan: 1
        },
        {
          name: 'contactPhoneNumber',
          label: 'Numéro de contact',
          type: 'tel',
          placeholder: 'Votre numéro de téléphone',
          colSpan: 1
        }
      ]
    }
  ],
  requiredDocuments: [
    'Copie du passeport',
    'Photos d\'identité',
    'Justificatif de revenus',
    'Lettre de motivation',
    'Réservation d\'hôtel ou invitation'
  ]
};

// Configuration pour les actes de naissance
const birthActFormConfig: ServiceFormConfig = {
  serviceType: ServiceType.BIRTH_ACT_APPLICATION,
  title: 'Demande d\'Acte de Naissance',
  description: 'Formulaire de demande d\'acte de naissance',
  sections: [
    {
      title: 'Informations de la personne concernée',
      fields: [
        ...personalInfoFields
      ]
    },
    {
      title: 'Informations des parents',
      fields: [
        {
          name: 'fatherFirstName',
          label: 'Prénom du père',
          type: 'text',
          required: true,
          placeholder: 'Prénom du père',
          colSpan: 1
        },
        {
          name: 'fatherLastName',
          label: 'Nom du père',
          type: 'text',
          required: true,
          placeholder: 'Nom du père',
          colSpan: 1
        },
        {
          name: 'motherFirstName',
          label: 'Prénom de la mère',
          type: 'text',
          required: true,
          placeholder: 'Prénom de la mère',
          colSpan: 1
        },
        {
          name: 'motherLastName',
          label: 'Nom de la mère',
          type: 'text',
          required: true,
          placeholder: 'Nom de la mère',
          colSpan: 1
        }
      ]
    },
    {
      title: 'Informations du déclarant',
      fields: [
        {
          name: 'declarantFirstName',
          label: 'Prénom du déclarant',
          type: 'text',
          required: true,
          placeholder: 'Prénom du déclarant',
          colSpan: 1
        },
        {
          name: 'declarantLastName',
          label: 'Nom du déclarant',
          type: 'text',
          required: true,
          placeholder: 'Nom du déclarant',
          colSpan: 1
        },
        {
          name: 'declarantRelation',
          label: 'Relation avec la personne',
          type: 'text',
          required: true,
          placeholder: 'Ex: Père, Mère, Tuteur',
          colSpan: 2
        }
      ]
    },
    {
      title: 'Informations de contact',
      fields: [
        {
          name: 'amount',
          label: 'Montant (FCFA)',
          type: 'number',
          required: true,
          validation: { min: 0 },
          colSpan: 1
        },
        {
          name: 'contactPhoneNumber',
          label: 'Numéro de contact',
          type: 'tel',
          placeholder: 'Votre numéro de téléphone',
          colSpan: 1
        }
      ]
    }
  ],
  requiredDocuments: [
    'Pièce d\'identité du demandeur',
    'Certificat de naissance (si disponible)',
    'Témoignages de naissance'
  ]
};

// Configuration pour les cartes consulaires
const consularCardFormConfig: ServiceFormConfig = {
  serviceType: ServiceType.CONSULAR_CARD,
  title: 'Demande de Carte Consulaire',
  description: 'Formulaire de demande de carte consulaire',
  sections: [
    {
      title: 'Informations personnelles',
      fields: [
        ...personalInfoFields,
        {
          name: 'personMaritalStatus',
          label: 'Statut matrimonial',
          type: 'select',
          required: true,
          options: [
            { value: 'SINGLE', label: 'Célibataire' },
            { value: 'MARRIED', label: 'Marié(e)' },
            { value: 'DIVORCED', label: 'Divorcé(e)' },
            { value: 'WIDOWED', label: 'Veuf/Veuve' }
          ],
          colSpan: 1
        }
      ]
    },
    {
      title: 'Adresse de résidence',
      fields: [
        {
          name: 'personAddress',
          label: 'Adresse complète',
          type: 'textarea',
          required: true,
          placeholder: 'Adresse de résidence complète',
          colSpan: 2
        },
        {
          name: 'personCity',
          label: 'Ville',
          type: 'text',
          required: true,
          placeholder: 'Ville de résidence',
          colSpan: 1
        },
        {
          name: 'personCountry',
          label: 'Pays de résidence',
          type: 'text',
          required: true,
          placeholder: 'Pays de résidence',
          colSpan: 1
        }
      ]
    },
    {
      title: 'Contact et profession',
      fields: [
        {
          name: 'personPhoneNumber',
          label: 'Numéro de téléphone',
          type: 'tel',
          required: true,
          placeholder: 'Votre numéro de téléphone',
          colSpan: 1
        },
        {
          name: 'personEmail',
          label: 'Adresse email',
          type: 'email',
          placeholder: 'Votre adresse email',
          colSpan: 1
        },
        {
          name: 'profession',
          label: 'Profession',
          type: 'text',
          placeholder: 'Votre profession',
          colSpan: 2
        }
      ]
    },
    {
      title: 'Contact d\'urgence',
      fields: [
        {
          name: 'emergencyContactName',
          label: 'Nom du contact d\'urgence',
          type: 'text',
          required: true,
          placeholder: 'Nom complet',
          colSpan: 1
        },
        {
          name: 'emergencyContactPhone',
          label: 'Téléphone du contact',
          type: 'tel',
          required: true,
          placeholder: 'Numéro de téléphone',
          colSpan: 1
        },
        {
          name: 'emergencyContactRelation',
          label: 'Relation',
          type: 'text',
          required: true,
          placeholder: 'Relation avec vous',
          colSpan: 2
        }
      ]
    },
    {
      title: 'Informations de contact',
      fields: [
        {
          name: 'amount',
          label: 'Montant (FCFA)',
          type: 'number',
          required: true,
          validation: { min: 0 },
          colSpan: 1
        },
        {
          name: 'contactPhoneNumber',
          label: 'Numéro de contact principal',
          type: 'tel',
          placeholder: 'Numéro de contact pour cette demande',
          colSpan: 1
        }
      ]
    }
  ],
  requiredDocuments: [
    'Copie de passeport ou pièce d\'identité',
    'Photos d\'identité récentes',
    'Justificatif de résidence',
    'Acte de naissance'
  ]
};

// Export de toutes les configurations
export const SERVICE_FORM_CONFIGS: Record<ServiceType, ServiceFormConfig> = {
  [ServiceType.VISA]: visaFormConfig,
  [ServiceType.BIRTH_ACT_APPLICATION]: birthActFormConfig,
  [ServiceType.CONSULAR_CARD]: consularCardFormConfig,
  // Configuration par défaut pour les autres services
  [ServiceType.LAISSEZ_PASSER]: {
    serviceType: ServiceType.LAISSEZ_PASSER,
    title: 'Demande de Laissez-Passer',
    description: 'Formulaire de demande de laissez-passer',
    sections: [
      {
        title: 'Informations personnelles',
        fields: personalInfoFields
      },
      {
        title: 'Informations de contact',
        fields: [
          {
            name: 'amount',
            label: 'Montant (FCFA)',
            type: 'number',
            required: true,
            validation: { min: 0 },
            colSpan: 1
          },
          {
            name: 'contactPhoneNumber',
            label: 'Numéro de contact',
            type: 'tel',
            placeholder: 'Votre numéro de téléphone',
            colSpan: 1
          }
        ]
      }
    ],
    requiredDocuments: ['Justificatif d\'identité', 'Photo d\'identité']
  },
  [ServiceType.MARRIAGE_CAPACITY_ACT]: {
    serviceType: ServiceType.MARRIAGE_CAPACITY_ACT,
    title: 'Demande d\'Acte de Capacité de Mariage',
    description: 'Formulaire de demande d\'acte de capacité de mariage',
    sections: [
      {
        title: 'Informations personnelles',
        fields: personalInfoFields
      },
      {
        title: 'Informations de contact',
        fields: [
          {
            name: 'amount',
            label: 'Montant (FCFA)',
            type: 'number',
            required: true,
            validation: { min: 0 },
            colSpan: 1
          },
          {
            name: 'contactPhoneNumber',
            label: 'Numéro de contact',
            type: 'tel',
            placeholder: 'Votre numéro de téléphone',
            colSpan: 1
          }
        ]
      }
    ],
    requiredDocuments: ['Acte de naissance', 'Certificat de célibat', 'Pièce d\'identité']
  },
  [ServiceType.DEATH_ACT_APPLICATION]: {
    serviceType: ServiceType.DEATH_ACT_APPLICATION,
    title: 'Demande d\'Acte de Décès',
    description: 'Formulaire de demande d\'acte de décès',
    sections: [
      {
        title: 'Informations du défunt',
        fields: personalInfoFields
      },
      {
        title: 'Informations de contact',
        fields: [
          {
            name: 'amount',
            label: 'Montant (FCFA)',
            type: 'number',
            required: true,
            validation: { min: 0 },
            colSpan: 1
          },
          {
            name: 'contactPhoneNumber',
            label: 'Numéro de contact',
            type: 'tel',
            placeholder: 'Votre numéro de téléphone',
            colSpan: 1
          }
        ]
      }
    ],
    requiredDocuments: ['Certificat médical de décès', 'Pièce d\'identité du déclarant']
  },
  [ServiceType.POWER_OF_ATTORNEY]: {
    serviceType: ServiceType.POWER_OF_ATTORNEY,
    title: 'Demande de Procuration',
    description: 'Formulaire de demande de procuration',
    sections: [
      {
        title: 'Informations personnelles',
        fields: personalInfoFields
      },
      {
        title: 'Informations de contact',
        fields: [
          {
            name: 'amount',
            label: 'Montant (FCFA)',
            type: 'number',
            required: true,
            validation: { min: 0 },
            colSpan: 1
          },
          {
            name: 'contactPhoneNumber',
            label: 'Numéro de contact',
            type: 'tel',
            placeholder: 'Votre numéro de téléphone',
            colSpan: 1
          }
        ]
      }
    ],
    requiredDocuments: ['Pièce d\'identité', 'Justificatif du mandataire']
  },
  [ServiceType.NATIONALITY_CERTIFICATE]: {
    serviceType: ServiceType.NATIONALITY_CERTIFICATE,
    title: 'Demande de Certificat de Nationalité',
    description: 'Formulaire de demande de certificat de nationalité',
    sections: [
      {
        title: 'Informations personnelles',
        fields: personalInfoFields
      },
      {
        title: 'Informations de contact',
        fields: [
          {
            name: 'amount',
            label: 'Montant (FCFA)',
            type: 'number',
            required: true,
            validation: { min: 0 },
            colSpan: 1
          },
          {
            name: 'contactPhoneNumber',
            label: 'Numéro de contact',
            type: 'tel',
            placeholder: 'Votre numéro de téléphone',
            colSpan: 1
          }
        ]
      }
    ],
    requiredDocuments: ['Acte de naissance', 'Pièce d\'identité', 'Justificatif de nationalité des parents']
  }
};