"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditUserModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: {
    user: { name: string; image: string }; // 👈 Correction ici
    service: string;
    post: string;
    role: string;
    [key: string]: any;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function EditUserModal({ isOpen, setIsOpen, user, onChange, onSubmit }: EditUserModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Modifier l&apos;utilisateur
                </Dialog.Title>
                <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                  <Input
                    placeholder="Nom"
                    value={user.name}
                    onChange={(e) => onChange("name", e.target.value)}
                  />
                  <Input
                    placeholder="Service"
                    value={user.service}
                    onChange={(e) => onChange("service", e.target.value)}
                  />
                  <Input
                    placeholder="Poste"
                    value={user.post}
                    onChange={(e) => onChange("post", e.target.value)}
                  />
                  <Input
                    placeholder="Rôle"
                    value={user.role}
                    onChange={(e) => onChange("role", e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
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
