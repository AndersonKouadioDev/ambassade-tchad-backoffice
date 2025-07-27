"use client";

// Client Component qui gère toute l'interactivité des demandes
// Sépare proprement la logique client de la logique serveur

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { 
  DemandFormModal, 
  DemandViewModal, 
  DemandedList,
  ServiceType,
  ServiceTypeEnum,
  SERVICE_LABELS,
  Request
} from '../index';

interface DemandListWrapperProps {
  initialDemands?: Request[];
}

export const DemandListWrapper: React.FC<DemandListWrapperProps> = ({ 
  initialDemands = [] 
}) => {
  // État pour les modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(ServiceType.VISA);
  const [selectedDemand, setSelectedDemand] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Gestion de la création d'une nouvelle demande
  const handleCreateDemand = async (data: any, files: File[]) => {
    setIsLoading(true);
    try {
      // Ici vous feriez l'appel API pour créer la demande
      console.log('Création de demande:', { serviceType: selectedServiceType, data, files });
      
      // Simulation d'un appel API
      const response = await fetch('/api/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: selectedServiceType,
          details: data,
          amount: data.amount || 0,
          contactPhoneNumber: data.contactPhoneNumber
        })
      });
      
      if (response.ok) {
        // Rafraîchir la liste des demandes
        // router.refresh() ou revalidate selon votre stratégie
        setIsCreateModalOpen(false);
        // Afficher une notification de succès
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      // Afficher une notification d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de l'ouverture du modal de création
  const handleOpenCreateModal = (serviceType: ServiceType) => {
    setSelectedServiceType(serviceType);
    setIsCreateModalOpen(true);
  };

  // Gestion de la visualisation d'une demande
  const handleViewDemand = (demand: Request) => {
    setSelectedDemand(demand);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Barre d'actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Liste des Demandes
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sélecteur de service */}
          <Select value={selectedServiceType} onValueChange={(value: ServiceType) => setSelectedServiceType(value)}>
            <SelectTrigger className="w-[200px] border-blue-300 focus:border-blue-500">
              <SelectValue placeholder="Type de service" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ServiceType).map((service) => (
                <SelectItem key={service} value={service}>
                  {SERVICE_LABELS[service]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Bouton de création */}
          <Button 
            onClick={() => handleOpenCreateModal(selectedServiceType)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Demande
          </Button>
        </div>
      </div>

      {/* Liste des demandes - composant existant réutilisé */}
      <DemandedList />

      {/* Modal de création/modification */}
      <DemandFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        serviceType={selectedServiceType}
        mode="create"
        onSubmit={handleCreateDemand}
        isLoading={isLoading}
      />

      {/* Modal de visualisation */}
      {selectedDemand && (
        <DemandViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          demand={selectedDemand}
          canEdit={true}
          onEdit={() => {
            // Logique pour éditer
            setIsViewModalOpen(false);
            // Ouvrir le modal d'édition
          }}
        />
      )}
    </div>
  );
};

// NOTES POUR L'INTÉGRATION :
//
// 1. GESTION D'ÉTAT :
//    - Utilisez un state manager (Zustand, Jotai) pour l'état global des demandes
//    - Ou utilisez React Query/SWR pour la synchronisation serveur
//
// 2. AUTHENTIFICATION :
//    - Récupérez le token d'auth depuis le contexte ou les cookies
//    - Gérez les erreurs 401/403 avec redirections
//
// 3. NOTIFICATIONS :
//    - Intégrez react-hot-toast ou sonner pour les notifications
//    - Affichez les succès/erreurs des actions
//
// 4. GESTION DES ERREURS :
//    - Implémentez un boundary d'erreur
//    - Loggez les erreurs pour le monitoring
//
// 5. OPTIMISATIONS :
//    - Implémentez la pagination côté serveur
//    - Ajoutez le debouncing pour la recherche
//    - Utilisez React.memo pour les composants lourds