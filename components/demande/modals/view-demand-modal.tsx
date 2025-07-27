"use client";

import React from 'react';
import { X, User, Mail, Phone, MapPin, FileText, Calendar, Clock, Download, Eye, Badge, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Badge as StatusBadge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatSafeDate, formatSafeDateWithTime } from '@/lib/date-utils';
import type { 
  Demande, 
  RequestStatus, 
  ServiceType,
  VisaDetails,
  BirthActDetails,
  ConsularCardDetails,
  LaissezPasserDetails
} from '@/types/demande.types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ViewDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  demande: Demande;
}

// Fonction utilitaire pour obtenir le libellé des statuts
const getStatusLabel = (status: RequestStatus): string => {
  const labelMap: Record<RequestStatus, string> = {
    NEW: "Nouveau",
    IN_REVIEW_DOCS: "Révision documents",
    PENDING_ADDITIONAL_INFO: "Info supplémentaire requise",
    APPROVED_BY_AGENT: "Approuvé par agent",
    APPROVED_BY_CHEF: "Approuvé par chef",
    APPROVED_BY_CONSUL: "Approuvé par consul",
    REJECTED: "Rejeté",
    READY_FOR_PICKUP: "Prêt pour retrait",
    DELIVERED: "Livré",
    ARCHIVED: "Archivé",
  };
  return labelMap[status] || status;
};

// Fonction utilitaire pour obtenir le libellé des services
const getServiceLabel = (serviceType: ServiceType): string => {
  const labelMap: Record<ServiceType, string> = {
    VISA: "Demande de Visa",
    BIRTH_ACT_APPLICATION: "Acte de Naissance",
    CONSULAR_CARD: "Carte Consulaire",
    LAISSEZ_PASSER: "Laissez-Passer",
    MARRIAGE_CAPACITY_ACT: "Acte de Capacité de Mariage",
    DEATH_ACT_APPLICATION: "Acte de Décès",
    POWER_OF_ATTORNEY: "Procuration",
    NATIONALITY_CERTIFICATE: "Certificat de Nationalité",
  };
  return labelMap[serviceType] || serviceType;
};

// Fonction utilitaire pour obtenir les couleurs des statuts
const getStatusColor = (status: RequestStatus): string => {
  const colorMap: Record<RequestStatus, string> = {
    NEW: "bg-blue-500 text-white",
    IN_REVIEW_DOCS: "bg-yellow-500 text-white",
    PENDING_ADDITIONAL_INFO: "bg-orange-500 text-white",
    APPROVED_BY_AGENT: "bg-green-500 text-white",
    APPROVED_BY_CHEF: "bg-green-600 text-white",
    APPROVED_BY_CONSUL: "bg-green-700 text-white",
    REJECTED: "bg-red-500 text-white",
    READY_FOR_PICKUP: "bg-purple-500 text-white",
    DELIVERED: "bg-emerald-500 text-white",
    ARCHIVED: "bg-gray-500 text-white",
  };
  return colorMap[status] || "bg-gray-500 text-white";
};

// Composant pour afficher un champ
const FieldDisplay = ({ label, value, icon }: { label: string; value: string | number | null; icon?: React.ReactNode }) => {
  if (!value) return null;
  
  // Vérifier si c'est une date ISO
  const isISODate = typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value));
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <p className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
        {isISODate ? formatSafeDate(value) : String(value)}
      </p>
    </div>
  );
};

// Composant pour afficher les détails spécifiques selon le type de service
const ServiceDetails = ({ demande, t }: { demande: Demande; t: any }) => {
  // LAISSEZ_PASSER - Déjà implémenté
  if (demande.serviceType === 'LAISSEZ_PASSER' && demande.laissezPasserDetails) {
    const details = demande.laissezPasserDetails;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations de la personne */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-purple-50 via-purple-100/80 to-pink-50 dark:from-purple-900/50 dark:via-purple-800/50 dark:to-pink-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-purple-800 dark:text-purple-200 text-lg">
              <User className="w-6 h-6" />
              {t('informations_personne')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Nom complet" 
              value={`${details.personFirstName} ${details.personLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date de naissance" 
              value={details.personBirthDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu de naissance" 
              value={details.personBirthPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité" 
              value={details.personNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Profession" 
              value={details.personProfession}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Domicile" 
              value={details.personDomicile}
              icon={<MapPin className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Informations familiales et voyage */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-indigo-50 via-indigo-100/80 to-cyan-50 dark:from-indigo-900/50 dark:via-indigo-800/50 dark:to-cyan-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-indigo-800 dark:text-indigo-200 text-lg">
              <FileText className="w-6 h-6" />
              {t('details_voyage')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Père" 
              value={details.fatherFullName}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Mère" 
              value={details.motherFullName}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Destination" 
              value={details.destination}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Motif du voyage" 
              value={details.travelReason}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Document justificatif" 
              value={`${details.justificationDocumentType} - ${details.justificationDocumentNumber}`}
              icon={<CreditCard className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date d'expiration" 
              value={details.laissezPasserExpirationDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Accompagné
              </label>
              <div className={`inline-flex px-3 py-2 rounded-full text-sm font-medium ${details.accompanied 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                {details.accompanied ? 'Oui' : 'Non'}
              </div>
            </div>
            {details.accompanied && details.accompaniers && details.accompaniers.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Accompagnateurs
                </label>
                <div className="space-y-2">
                  {details.accompaniers.map((accompanier, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {accompanier.firstName} {accompanier.lastName}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Né(e) le {accompanier.birthDate} à {accompanier.birthPlace}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // VISA - Vue détaillée
  if (demande.serviceType === 'VISA' && demande.visaDetails) {
    const details = demande.visaDetails;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations personnelles */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-100/80 to-cyan-50 dark:from-blue-900/50 dark:via-blue-800/50 dark:to-cyan-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-200 text-lg">
              <User className="w-6 h-6" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Nom complet" 
              value={`${details.personFirstName} ${details.personLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Genre" 
              value={details.personGender === 'MALE' ? 'Masculin' : 'Féminin'}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date de naissance" 
              value={details.personBirthDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu de naissance" 
              value={details.personBirthPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité" 
              value={details.personNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Statut matrimonial" 
              value={details.personMaritalStatus}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Profession" 
              value={details.profession}
              icon={<FileText className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Informations passeport et visa */}
        <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-green-50 via-green-100/80 to-emerald-50 dark:from-green-900/50 dark:via-green-800/50 dark:to-emerald-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-200 text-lg">
              <CreditCard className="w-6 h-6" />
              Passeport &amp; Visa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Type de passeport" 
              value={details.passportType}
              icon={<CreditCard className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Numéro de passeport" 
              value={details.passportNumber}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Émis par" 
              value={details.passportIssuedBy}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date d'émission" 
              value={details.passportIssueDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date d'expiration" 
              value={details.passportExpirationDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Type de visa" 
              value={details.visaType === 'SHORT_STAY' ? 'Court séjour' : 'Long séjour'}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Durée (mois)" 
              value={details.durationMonths}
              icon={<Clock className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="État de destination" 
              value={details.destinationState}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Adresse employeur" 
              value={details.employerAddress}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Téléphone employeur" 
              value={details.employerPhoneNumber}
              icon={<Phone className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date d'expiration du visa" 
              value={details.visaExpirationDate}
              icon={<Calendar className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // BIRTH_ACT_APPLICATION - Vue détaillée
  if (demande.serviceType === 'BIRTH_ACT_APPLICATION' && demande.birthActDetails) {
    const details = demande.birthActDetails;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations de la personne */}
        <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-pink-50 via-pink-100/80 to-rose-50 dark:from-pink-900/50 dark:via-pink-800/50 dark:to-rose-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-pink-800 dark:text-pink-200 text-lg">
              <User className="w-6 h-6" />
              Informations de naissance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Nom complet" 
              value={`${details.personFirstName} ${details.personLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date de naissance" 
              value={details.personBirthDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu de naissance" 
              value={details.personBirthPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité" 
              value={details.personNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Domicile" 
              value={details.personDomicile}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Type de demande" 
              value={details.requestType}
              icon={<FileText className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Informations familiales */}
        <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-orange-50 via-orange-100/80 to-amber-50 dark:from-orange-900/50 dark:via-orange-800/50 dark:to-amber-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-orange-800 dark:text-orange-200 text-lg">
              <User className="w-6 h-6" />
              Informations familiales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Père" 
              value={details.fatherFullName}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Mère" 
              value={details.motherFullName}
              icon={<User className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // CONSULAR_CARD - Vue détaillée
  if (demande.serviceType === 'CONSULAR_CARD' && demande.consularCardDetails) {
    const details = demande.consularCardDetails;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations personnelles */}
        <Card className="border-2 border-teal-200 dark:border-teal-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-teal-50 via-teal-100/80 to-cyan-50 dark:from-teal-900/50 dark:via-teal-800/50 dark:to-cyan-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-teal-800 dark:text-teal-200 text-lg">
              <User className="w-6 h-6" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Nom complet" 
              value={`${details.personFirstName} ${details.personLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date de naissance" 
              value={details.personBirthDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu de naissance" 
              value={details.personBirthPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité" 
              value={details.personNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Profession" 
              value={details.personProfession}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Domicile" 
              value={details.personDomicile}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Adresse dans le pays d'origine" 
              value={details.personAddressInOriginCountry}
              icon={<MapPin className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Informations de justification et carte */}
        <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-emerald-50 via-emerald-100/80 to-green-50 dark:from-emerald-900/50 dark:via-emerald-800/50 dark:to-green-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-lg">
              <FileText className="w-6 h-6" />
              Justification &amp; Carte
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Type de document de justification" 
              value={details.justificationDocumentType}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Numéro de document de justification" 
              value={details.justificationDocumentNumber}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date d'expiration de la carte" 
              value={details.cardExpirationDate}
              icon={<Calendar className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // MARRIAGE_CAPACITY_ACT - Vue détaillée
  if (demande.serviceType === 'MARRIAGE_CAPACITY_ACT' && demande.marriageCapacityActDetails) {
    const details = demande.marriageCapacityActDetails;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations du demandeur */}
        <Card className="border-2 border-rose-200 dark:border-rose-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-rose-50 via-rose-100/80 to-pink-50 dark:from-rose-900/50 dark:via-rose-800/50 dark:to-pink-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-rose-800 dark:text-rose-200 text-lg">
              <User className="w-6 h-6" />
              Informations du demandeur
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Nom complet" 
              value={`${details.personFirstName} ${details.personLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Genre" 
              value={details.personGender === 'MALE' ? 'Masculin' : 'Féminin'}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date de naissance" 
              value={details.personBirthDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu de naissance" 
              value={details.personBirthPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité" 
              value={details.personNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Statut matrimonial" 
              value={details.personMaritalStatus}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Adresse" 
              value={details.personAddress}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Téléphone" 
              value={details.personPhoneNumber}
              icon={<Phone className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Informations du conjoint et mariage */}
        <Card className="border-2 border-red-200 dark:border-red-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-red-50 via-red-100/80 to-rose-50 dark:from-red-900/50 dark:via-red-800/50 dark:to-rose-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-red-800 dark:text-red-200 text-lg">
              <User className="w-6 h-6" />
              Informations du mariage
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Conjoint" 
              value={`${details.spouseFirstName} ${details.spouseLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité du conjoint" 
              value={details.spouseNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date du mariage" 
              value={details.marriageDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu du mariage" 
              value={details.marriagePlace}
              icon={<MapPin className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // DEATH_ACT_APPLICATION - Vue détaillée
  if (demande.serviceType === 'DEATH_ACT_APPLICATION' && demande.deathActDetails) {
    const details = demande.deathActDetails;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations du défunt */}
        <Card className="border-2 border-gray-300 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-gray-50 via-gray-100/80 to-slate-50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-slate-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg">
              <User className="w-6 h-6" />
              Informations du défunt
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Nom complet" 
              value={`${details.deceasedFirstName} ${details.deceasedLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Genre" 
              value={details.deceasedGender === 'MALE' ? 'Masculin' : 'Féminin'}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date de naissance" 
              value={details.deceasedBirthDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu de naissance" 
              value={details.deceasedBirthPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité" 
              value={details.deceasedNationality}
              icon={<Badge className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Informations du décès et déclarant */}
        <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-slate-50 via-slate-100/80 to-gray-50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-gray-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-200 text-lg">
              <FileText className="w-6 h-6" />
              Informations du décès
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Date du décès" 
              value={details.deathDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu du décès" 
              value={details.deathPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Cause du décès" 
              value={details.deathCause}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Déclarant" 
              value={`${details.declarantFirstName} ${details.declarantLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Relation du déclarant" 
              value={details.declarantRelation}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Téléphone du déclarant" 
              value={details.declarantPhoneNumber}
              icon={<Phone className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // POWER_OF_ATTORNEY - Vue détaillée
  if (demande.serviceType === 'POWER_OF_ATTORNEY' && demande.powerOfAttorneyDetails) {
    const details = demande.powerOfAttorneyDetails;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations du mandant */}
        <Card className="border-2 border-amber-200 dark:border-amber-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-amber-50 via-amber-100/80 to-yellow-50 dark:from-amber-900/50 dark:via-amber-800/50 dark:to-yellow-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-amber-800 dark:text-amber-200 text-lg">
              <User className="w-6 h-6" />
              Informations du mandant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Nom complet" 
              value={`${details.grantorFirstName} ${details.grantorLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Genre" 
              value={details.grantorGender === 'MALE' ? 'Masculin' : 'Féminin'}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date de naissance" 
              value={details.grantorBirthDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu de naissance" 
              value={details.grantorBirthPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité" 
              value={details.grantorNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Adresse" 
              value={details.grantorAddress}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Téléphone" 
              value={details.grantorPhoneNumber}
              icon={<Phone className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Informations du mandataire et procuration */}
        <Card className="border-2 border-yellow-200 dark:border-yellow-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-yellow-50 via-yellow-100/80 to-amber-50 dark:from-yellow-900/50 dark:via-yellow-800/50 dark:to-amber-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200 text-lg">
              <FileText className="w-6 h-6" />
              Détails de la procuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Mandataire" 
              value={`${details.attorneyFirstName} ${details.attorneyLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Adresse du mandataire" 
              value={details.attorneyAddress}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Téléphone du mandataire" 
              value={details.attorneyPhoneNumber}
              icon={<Phone className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Objet de la procuration" 
              value={details.powerPurpose}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Étendue des pouvoirs" 
              value={details.powerScope}
              icon={<FileText className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Valide jusqu'au" 
              value={details.validUntil}
              icon={<Calendar className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // NATIONALITY_CERTIFICATE - Vue détaillée
  if (demande.serviceType === 'NATIONALITY_CERTIFICATE' && demande.nationalityCertificateDetails) {
    const details = demande.nationalityCertificateDetails;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations personnelles */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-indigo-50 via-indigo-100/80 to-blue-50 dark:from-indigo-900/50 dark:via-indigo-800/50 dark:to-blue-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-indigo-800 dark:text-indigo-200 text-lg">
              <User className="w-6 h-6" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Nom complet" 
              value={`${details.personFirstName} ${details.personLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Genre" 
              value={details.personGender === 'MALE' ? 'Masculin' : 'Féminin'}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Date de naissance" 
              value={details.personBirthDate}
              icon={<Calendar className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Lieu de naissance" 
              value={details.personBirthPlace}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Adresse actuelle" 
              value={details.personAddress}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Téléphone" 
              value={details.personPhoneNumber}
              icon={<Phone className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        {/* Informations familiales et résidence */}
        <Card className="border-2 border-violet-200 dark:border-violet-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="bg-gradient-to-r from-violet-50 via-violet-100/80 to-purple-50 dark:from-violet-900/50 dark:via-violet-800/50 dark:to-purple-900/30 pb-4">
            <CardTitle className="flex items-center gap-3 text-violet-800 dark:text-violet-200 text-lg">
              <User className="w-6 h-6" />
              Informations familiales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FieldDisplay 
              label="Père" 
              value={`${details.fatherFirstName} ${details.fatherLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité du père" 
              value={details.fatherNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Mère" 
              value={`${details.motherFirstName} ${details.motherLastName}`}
              icon={<User className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Nationalité de la mère" 
              value={details.motherNationality}
              icon={<Badge className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Pays de résidence" 
              value={details.residenceCountry}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FieldDisplay 
              label="Adresse de résidence" 
              value={details.residenceAddress}
              icon={<MapPin className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pour d'autres types de services, afficher un message générique
  return (
    <Card className="border-2 border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 pb-3">
        <CardTitle className="text-gray-800 dark:text-gray-200">Détails du service</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Vue détaillée pour {getServiceLabel(demande.serviceType)} en cours de développement
        </p>
      </CardContent>
    </Card>
  );
};

export function ViewDemandModal({ isOpen, onClose, demande }: ViewDemandModalProps) {
  const t = useTranslations('DemandeModals');
  const user = demande.user;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="lg" hideCloseButton={true} className="w-[70vw] h-[80vh] p-0 bg-white dark:bg-gray-900 overflow-hidden" aria-describedby="view-demand-description">
        <VisuallyHidden>
          <DialogTitle>{t('view_title')} {getServiceLabel(demande.serviceType)}</DialogTitle>
          <div id="view-demand-description">{t('view_title')} #{demande.id}</div>
        </VisuallyHidden>
        
        {/* Header avec logo - dégradé bleu */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            {/* Logo agrandi */}
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              <Image
                src="/images/logo/logo.png"
                alt="Logo Ambassade"
                width={48}
                height={48}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            
            {/* Titre très grand au centre */}
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-white mb-1">
                {getServiceLabel(demande.serviceType)}
              </h1>
              <p className="text-blue-100 dark:text-blue-200 text-base font-medium">
                Ticket #{demande.ticketNumber}
              </p>
              <p className="text-blue-200 dark:text-blue-300 text-sm">
                {formatSafeDate(demande.submissionDate)}
              </p>
            </div>
          </div>
          
          {/* Bouton X unique et plus grand */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 dark:hover:bg-white/10 h-12 w-12 p-0 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Body du modal avec dégradé sexy */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 p-8">
          {/* Informations principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Demandeur */}
            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-200 text-lg">
                  <User className="w-6 h-6" />
                  {t('demandeur')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16 border-2 border-blue-200">
                    <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-xl text-blue-900 dark:text-blue-100 mb-1">
                      {user.firstName} {user.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>
                </div>
                {demande.contactPhoneNumber && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">{demande.contactPhoneNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statut */}
            <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-200 text-lg">
                  <Clock className="w-6 h-6" />
                  Statut actuel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <StatusBadge className={`${getStatusColor(demande.status)} px-6 py-3 text-lg font-bold rounded-full shadow-md`}>
                    {getStatusLabel(demande.status)}
                  </StatusBadge>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Soumise le:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatSafeDate(demande.submissionDate)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Mise à jour:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatSafeDateWithTime(demande.updatedAt)}</span>
                  </div>
                  {demande.completionDate && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Complétée le:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatSafeDate(demande.completionDate)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informations financières */}
            <Card className="border-2 border-yellow-200 dark:border-yellow-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50 pb-4">
                <CardTitle className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200 text-lg">
                  <CreditCard className="w-6 h-6" />
                  Informations financières
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center bg-gradient-to-r from-yellow-100 via-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:via-yellow-800/30 dark:to-orange-900/20 p-6 rounded-lg border border-yellow-200/50 dark:border-yellow-700/30">
                  <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent mb-2">
                    {demande.amount.toLocaleString()} FCFA
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                    {t('montant_a_payer')}
                  </p>
                </div>
                {demande.issuedDate && (
                  <div className="text-center pt-4 border-t-2 border-yellow-200">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Document émis le:
                    </p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{formatSafeDate(demande.issuedDate)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Détails spécifiques au service */}
          <ServiceDetails demande={demande} t={t} />

          {/* Observations */}
          {demande.observations && (
            <Card className="mt-10 border-2 border-orange-200 dark:border-orange-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-r from-orange-50 via-orange-100/80 to-red-50 dark:from-orange-900/50 dark:via-orange-800/50 dark:to-red-900/30 pb-4">
                <CardTitle className="flex items-center gap-3 text-orange-800 dark:text-orange-200 text-lg">
                  <FileText className="w-6 h-6" />
                  {t('observations')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-orange-50 to-red-50/50 dark:from-orange-900/20 dark:to-red-900/10 p-4 rounded-lg border-l-4 border-orange-400 shadow-inner">
                  <p className="text-gray-900 dark:text-white text-base leading-relaxed">
                    {demande.observations}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}