"use client";

import { Fragment, useCallback } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useSupprimerDepenseMutation } from "../../queries/depense.mutation";
import { IDepense } from "../../types/depense.type";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  depense: IDepense | null;
};

export function DepenseDeleteModal({ isOpen, setIsOpen, depense }: Props) {
  const { mutateAsync: supprimerDepenseMutation, isPending } =
    useSupprimerDepenseMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const handleDelete = useCallback(async () => {
    if (depense?.id) {
      await supprimerDepenseMutation(depense.id);
      handleClose();
    }
  }, [supprimerDepenseMutation, depense?.id, handleClose]);

  if (!depense) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <DialogTitle className="text-lg font-medium text-gray-900">
                    Supprimer la dépense
                  </DialogTitle>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">
                    Êtes-vous sûr de vouloir supprimer cette dépense ?
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">
                        {depense.description || "Aucune description"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-medium text-green-600">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XAF'
                        }).format(depense.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-medium">{depense.category.name}</span>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mt-3">
                    Cette action est irréversible.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isPending}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isPending ? "Suppression..." : "Supprimer"}
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
