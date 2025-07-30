"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ViewUserModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: {
    name?: string;
    service?: string;
    post?: string;
    role?: string;
  } | null;
}

export function ViewUserModal({ isOpen, setIsOpen, user }: ViewUserModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Détails de l&apos;utilisateur
                </Dialog.Title>
                <div className="mt-4 space-y-2">
                  <p><strong>Nom:</strong> {user?.name}</p>
                  <p><strong>Service:</strong> {user?.service}</p>
                  <p><strong>Poste:</strong> {user?.post}</p>
                  <p><strong>Rôle:</strong> {user?.role}</p>
                </div>
                <div className="mt-6 text-right">
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