"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle } from "lucide-react"
import { useDeleteDemande } from "@/hooks/use-demandes"

interface DeleteDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  demandeId: number | null
  onSuccess?: () => void
}

export function DeleteDemandeModal({ isOpen, setIsOpen, demandeId, onSuccess }: DeleteDemandeModalProps) {
  const deleteDemandeMutation = useDeleteDemande()

  const handleConfirm = async () => {
    if (!demandeId) return

    try {
      await deleteDemandeMutation.mutateAsync(demandeId)
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!demandeId) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                
                <Dialog.Title className="text-lg font-medium text-gray-900 mb-2">
                  Confirmer la suppression
                </Dialog.Title>
                
                <p className="text-sm text-gray-600 mb-4">
                  Êtes-vous sûr de vouloir supprimer la demande #{demandeId} ?
                  Cette action est irréversible et supprimera définitivement toutes les données associées.
                </p>

                {deleteDemandeMutation.error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>
                      Erreur: {deleteDemandeMutation.error.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-center gap-3">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleClose}
                    disabled={deleteDemandeMutation.isPending}
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleConfirm}
                    disabled={deleteDemandeMutation.isPending}
                  >
                    {deleteDemandeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Supprimer
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
