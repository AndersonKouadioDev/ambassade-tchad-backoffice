"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface EditDemandeModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  demande: {
    document: string
    demandeStatus: string
    demandeTraitée: string
  }
  onChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function EditDemandeModal({ isOpen, setIsOpen, demande, onChange, onSubmit }: EditDemandeModalProps) {
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
                  Modifier la Demande
                </Dialog.Title>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <Input
                    value={demande.document}
                    onChange={(e) => onChange("document", e.target.value)}
                    placeholder="Type de document"
                  />
                  <Input
                    value={demande.demandeStatus}
                    onChange={(e) => onChange("demandeStatus", e.target.value)}
                    placeholder="Statut de la demande"
                  />
                  <Input
                    value={demande.demandeTraitée}
                    onChange={(e) => onChange("demandeTraitée", e.target.value)}
                    placeholder="Traitement"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
