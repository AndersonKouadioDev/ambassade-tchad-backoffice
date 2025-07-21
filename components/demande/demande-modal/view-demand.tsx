"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ViewDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  demande: {
    user: { name: string; image: string }
    document: string
    demandeStatus: string
    demandeTraitée: string
  }
}

export function ViewDemandeModal({ isOpen, setIsOpen, demande }: ViewDemandeModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Détails de la Demande
                </Dialog.Title>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={demande.user.image} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{demande.user.name}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Document :</strong> {demande.document}</p>
                  <p><strong>Statut :</strong> <Badge>{demande.demandeStatus.replace(/_/g, " ")}</Badge></p>
                  <p><strong>Traitement :</strong> <Badge>{demande.demandeTraitée}</Badge></p>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setIsOpen(false)}>Fermer</Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
