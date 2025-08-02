"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle, User, FileText } from "lucide-react"
import { IDemande, DemandeStatus } from "@/features/demande/types/demande.type"
import { ServiceType } from "@/features/service/types/service.type"

interface DeleteDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  demande: IDemande | null
  onConfirm: () => void
}

// Fonctions utilitaires pour les libellés
function getStatusLabel(status: DemandeStatus): string {
  const labels: Record<DemandeStatus, string> = {
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
    EXPIRED: "Expiré",
    RENEWAL_REQUESTED: "Renouvellement demandé"
  }
  return labels[status] || status
}

function getServiceLabel(service: ServiceType): string {
  const labels: Record<ServiceType, string> = {
    VISA: "Visa",
    BIRTH_ACT_APPLICATION: "Acte de naissance",
    CONSULAR_CARD: "Carte consulaire",
    LAISSEZ_PASSER: "Laissez-passer",
    MARRIAGE_CAPACITY_ACT: "Acte de capacité de mariage",
    DEATH_ACT_APPLICATION: "Acte de décès",
    POWER_OF_ATTORNEY: "Procuration",
    NATIONALITY_CERTIFICATE: "Certificat de nationalité"
  }
  return labels[service] || service
}

export function DeleteDemandeModal({ isOpen, setIsOpen, demande, onConfirm }: DeleteDemandeModalProps) {
  if (!demande) return null

  const user = demande.user;
  const initials = `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`

  const handleConfirm = () => {
    onConfirm()
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  
                  <Dialog.Title className="text-lg font-semibold text-gray-900 text-center mb-4">
                    Confirmer la suppression
                  </Dialog.Title>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Ticket #:</span>
                        <span className="font-medium">{demande.ticketNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Service:</span>
                        <Badge className="text-xs">
                          {getServiceLabel(demande.serviceType)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <Badge className="text-xs">
                          {getStatusLabel(demande.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                    <p className="text-sm text-red-800">
                      <strong>Attention :</strong> Cette action supprimera définitivement cette demande 
                      et toutes les données associées. Cette action est irréversible.
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button 
                      onClick={() => setIsOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={handleConfirm}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Supprimer définitivement
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
