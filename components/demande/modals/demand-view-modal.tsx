"use client";

import React from 'react';
import Image from 'next/image';
import { X, Download, Eye, Calendar, User, Phone, Mail, FileText, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { 
  Request, 
  ServiceType, 
  RequestStatus,
  SERVICE_LABELS, 
  STATUS_LABELS, 
  STATUS_COLORS,
  VisaRequestDetails,
  BirthActRequestDetails,
  ConsularCardRequestDetails
} from '@/types/demande.types';

// Fonction utilitaire pour formater les dates
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

interface DemandViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  demand: Request;
  onEdit?: () => void;
  onStatusChange?: (newStatus: RequestStatus) => void;
  canEdit?: boolean;
  canChangeStatus?: boolean;
}

export const DemandViewModal: React.FC<DemandViewModalProps> = ({
  isOpen,
  onClose,
  demand,
  onEdit,
  onStatusChange,
  canEdit = false,
  canChangeStatus = false
}) => {
  const serviceLabel = SERVICE_LABELS[demand.serviceType];
  const statusLabel = STATUS_LABELS[demand.status];
  const statusColors = STATUS_COLORS[demand.status];

  // Fonction pour afficher les détails spécifiques selon le type de service
  const renderServiceDetails = () => {
    switch (demand.serviceType) {
      case ServiceType.VISA:
        const visaDetails = demand.details as VisaRequestDetails;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 bg-white dark:bg-gray-800">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nom complet:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {visaDetails.personFirstName} {visaDetails.personLastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Genre:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {visaDetails.personGender === 'MALE' ? 'Masculin' : 'Féminin'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nationalité:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {visaDetails.personNationality}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date de naissance:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(visaDetails.personBirthDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lieu de naissance:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {visaDetails.personBirthPlace}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Statut matrimonial:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {visaDetails.personMaritalStatus}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Informations passeport */}
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Informations passeport
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 bg-white dark:bg-gray-800">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {visaDetails.passportType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Numéro:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                    {visaDetails.passportNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Délivré par:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {visaDetails.passportIssuedBy}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date de délivrance:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(visaDetails.passportIssueDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date d&apos;expiration:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(visaDetails.passportExpirationDate)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Détails du visa */}
            <Card className="border-blue-200 md:col-span-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Détails du visa
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type de visa:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {visaDetails.visaType === 'SHORT_STAY' ? 'Court séjour' : 'Long séjour'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Durée:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {visaDetails.durationMonths} mois
                    </span>
                  </div>
                  {visaDetails.destinationState && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Destination:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {visaDetails.destinationState}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case ServiceType.BIRTH_ACT_APPLICATION:
        const birthDetails = demand.details as BirthActRequestDetails;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de la personne */}
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personne concernée
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 bg-white dark:bg-gray-800">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nom complet:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {birthDetails.personFirstName} {birthDetails.personLastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date de naissance:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(birthDetails.personBirthDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lieu de naissance:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {birthDetails.personBirthPlace}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Informations des parents */}
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                <CardTitle className="text-sm font-semibold text-blue-800">
                  Parents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 bg-white dark:bg-gray-800">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Père:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {birthDetails.fatherFirstName} {birthDetails.fatherLastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Mère:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {birthDetails.motherFirstName} {birthDetails.motherLastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Déclarant:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {birthDetails.declarantFirstName} {birthDetails.declarantLastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Relation:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {birthDetails.declarantRelation}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Détails spécifiques non disponibles pour ce type de service</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        {/* Header avec logo */}
        <div className="bg-gradient-to-r from-blue-500 to-yellow-500 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/images/logo/logo.png"
                  alt="Logo Ambassade du Tchad"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              
              {/* Titre et statut */}
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {serviceLabel}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={`${statusColors} text-xs px-2 py-1`}>
                    {statusLabel}
                  </Badge>
                  {demand.ticket && (
                    <span className="text-blue-100 text-sm font-mono">
                      Ticket: {demand.ticket}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {canEdit && onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="text-white hover:bg-white/20"
                >
                  Modifier
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Corps du modal */}
        <div className="bg-white dark:bg-gray-900 p-6 max-h-[70vh] overflow-y-auto">
                  {/* Informations générales */}
                  <Card className="border-blue-200 mb-6">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                      <CardTitle className="text-lg font-semibold text-blue-800">
                        Informations générales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 bg-white dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Date de création</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(demand.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        {demand.user && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Demandeur</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {demand.user.firstName} {demand.user.lastName}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Montant</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {demand.amount.toLocaleString()} FCFA
                            </p>
                          </div>
                        </div>

                        {demand.contactPhoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Contact</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {demand.contactPhoneNumber}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Détails spécifiques au service */}
                  {renderServiceDetails()}

                  {/* Documents */}
                  {demand.documents && demand.documents.length > 0 && (
                    <Card className="border-blue-200 mt-6">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                        <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Documents joints ({demand.documents.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 bg-white dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {demand.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-blue-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {doc.originalName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(doc.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Historique des statuts */}
                  {demand.statusHistory && demand.statusHistory.length > 0 && (
                    <Card className="border-blue-200 mt-6">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-yellow-50 border-b border-blue-200">
                        <CardTitle className="text-lg font-semibold text-blue-800">
                          Historique des statuts
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 bg-white dark:bg-gray-800">
                        <div className="space-y-3">
                          {demand.statusHistory.map((history, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 border border-blue-100 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={`${STATUS_COLORS[history.newStatus]} text-xs`}>
                                    {STATUS_LABELS[history.newStatus]}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {formatDateTime(history.changedAt)}
                                  </span>
                                </div>
                                {history.reason && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {history.reason}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
      </DialogContent>
    </Dialog>
  );
};