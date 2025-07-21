"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Button } from "@/components/ui/button"

interface DeleteDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteDemandeModal({ isOpen, setIsOpen, onConfirm }: DeleteDemandeModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Confirmer la suppression
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-600">
                  Êtes-vous sûr de vouloir supprimer cette demande ?
                  Cette action est irréversible.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
                  <Button variant="outline" onClick={onConfirm}>Supprimer</Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
