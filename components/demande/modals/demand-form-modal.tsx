"use client";

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GenericDemandForm } from '../forms/generic-demand-form';
import { ServiceType, SERVICE_LABELS } from '@/types/demande.types';

interface DemandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  mode: 'create' | 'edit';
  initialData?: any;
  onSubmit: (data: any, files: File[]) => Promise<void>;
  isLoading?: boolean;
}

export const DemandFormModal: React.FC<DemandFormModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  mode,
  initialData,
  onSubmit,
  isLoading = false
}) => {
  const title = mode === 'create' ? 'Nouvelle demande' : 'Modifier la demande';
  const serviceLabel = SERVICE_LABELS[serviceType];

  const handleSubmit = async (data: any, files: File[]) => {
    try {
      await onSubmit(data, files);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // Ici vous pourriez ajouter une notification d'erreur
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
              
              {/* Titre */}
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {title}
                </DialogTitle>
                <p className="text-blue-100 text-sm mt-1">
                  {serviceLabel}
                </p>
              </div>
            </div>

            {/* Bouton de fermeture */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Corps du modal - respect du thème light/dark */}
        <div className="bg-white dark:bg-gray-900 p-6 max-h-[70vh] overflow-y-auto">
          <GenericDemandForm
            serviceType={serviceType}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialData={initialData}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};