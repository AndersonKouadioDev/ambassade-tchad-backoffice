"use client";

import React, { useState } from 'react';
import { X, User, FileText, Save, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatSafeDate } from '@/lib/date-utils';
import type { Demande, RequestStatus, ServiceType } from '@/types/demande.types';
import { toast } from 'sonner';
import Image from 'next/image';

interface EditDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  demande: Demande;
  onSubmit: (updatedData: Partial<Demande>) => Promise<void>;
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
    PENDING_ADDITIONAL_INFO: "bg-yellow-600 text-white",
    APPROVED_BY_AGENT: "bg-blue-600 text-white",
    APPROVED_BY_CHEF: "bg-blue-600 text-white",
    APPROVED_BY_CONSUL: "bg-blue-600 text-white",
    REJECTED: "bg-red-500 text-white",
    READY_FOR_PICKUP: "bg-green-500 text-white",
    DELIVERED: "bg-green-600 text-white",
    ARCHIVED: "bg-gray-500 text-white",
  };
  return colorMap[status] || "bg-gray-500 text-white";
};

// Fonction pour obtenir les statuts suivants possibles
const getNextPossibleStatuses = (currentStatus: RequestStatus): RequestStatus[] => {
  const workflow: Record<RequestStatus, RequestStatus[]> = {
    NEW: ['IN_REVIEW_DOCS', 'PENDING_ADDITIONAL_INFO', 'REJECTED'],
    IN_REVIEW_DOCS: ['APPROVED_BY_AGENT', 'PENDING_ADDITIONAL_INFO', 'REJECTED'],
    PENDING_ADDITIONAL_INFO: ['IN_REVIEW_DOCS', 'REJECTED'],
    APPROVED_BY_AGENT: ['APPROVED_BY_CHEF', 'REJECTED'],
    APPROVED_BY_CHEF: ['APPROVED_BY_CONSUL', 'REJECTED'],
    APPROVED_BY_CONSUL: ['READY_FOR_PICKUP'],
    REJECTED: ['NEW', 'IN_REVIEW_DOCS'],
    READY_FOR_PICKUP: ['DELIVERED'],
    DELIVERED: ['ARCHIVED'],
    ARCHIVED: [],
  };
  return [currentStatus, ...(workflow[currentStatus] || [])];
};

export function EditDemandModal({ isOpen, onClose, demande, onSubmit }: EditDemandModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(demande.status);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = demande.user;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  const possibleStatuses = getNextPossibleStatuses(demande.status);

  const handleSubmit = async () => {
    if (selectedStatus === demande.status && !comment.trim()) {
      toast.warning('Aucune modification détectée');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        status: selectedStatus,
        // Le commentaire sera géré dans l'historique
      });
      toast.success('Demande mise à jour avec succès');
      onClose();
      setComment('');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="lg" hideCloseButton={true} className="w-[70vw] h-[80vh] p-0 bg-white dark:bg-gray-900 overflow-hidden" aria-describedby="edit-demand-description">
        <VisuallyHidden>
          <DialogTitle>Modification de la demande {getServiceLabel(demande.serviceType)}</DialogTitle>
          <div id="edit-demand-description">Modification du statut de la demande #{demande.id}</div>
        </VisuallyHidden>
        {/* Header avec logo - toujours bleu */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/images/logo/logo.png"
                alt="Logo Ambassade"
                width={40}
                height={40}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            
            {/* Titre au milieu */}
            <div className="text-center flex-1">
              <h2 className="text-xl font-bold text-white">
                Modification - {getServiceLabel(demande.serviceType)}
              </h2>
              <p className="text-blue-100 text-sm">
                Ticket #{demande.ticketNumber} • {formatSafeDate(demande.submissionDate)}
              </p>
            </div>
          </div>
          
          {/* Bouton X à droite */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-700 h-10 w-10 p-0 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body du modal */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations de la demande */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/50 pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <FileText className="w-5 h-5" />
                  Informations de la demande
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Demandeur */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Détails de la demande */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Service</Label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {getServiceLabel(demande.serviceType)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Montant</Label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {demande.amount.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Soumise le</Label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {formatSafeDate(demande.submissionDate)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Modifiée le</Label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {formatSafeDate(demande.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket de suivi</Label>
                    <p className="text-gray-900 dark:text-white font-mono font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {demande.ticketNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modification du statut */}
            <Card className="border-2 border-yellow-400 dark:border-yellow-600">
              <CardHeader className="bg-yellow-50 dark:bg-yellow-900/50 pb-3">
                <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <RefreshCw className="w-5 h-5" />
                  Modifier le statut
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Statut actuel */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Statut actuel
                  </Label>
                  <Badge className={`${getStatusColor(demande.status)} px-4 py-2 text-base font-semibold rounded-full`}>
                    {getStatusLabel(demande.status)}
                  </Badge>
                </div>

                {/* Nouveau statut */}
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Nouveau statut
                  </Label>
                  <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as RequestStatus)}>
                    <SelectTrigger className="mt-2 h-12 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-yellow-50 dark:bg-yellow-900">
                      {possibleStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[0]}`} />
                            <span>{getStatusLabel(status)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Commentaire */}
                <div>
                  <Label htmlFor="comment" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Commentaire (optionnel)
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Ajoutez un commentaire sur cette modification..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-2 min-h-[120px] resize-none"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ce commentaire sera ajouté à l'historique de la demande
                  </p>
                </div>

                {/* Aperçu du changement */}
                {selectedStatus !== demande.status && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Aperçu du changement
                      </span>
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">{getStatusLabel(demande.status)}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{getStatusLabel(selectedStatus)}</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      Le demandeur sera automatiquement notifié de ce changement par email.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (selectedStatus === demande.status && !comment.trim())}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}