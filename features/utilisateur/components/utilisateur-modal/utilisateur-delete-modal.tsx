"use client";

import { Fragment, useCallback } from "react";
import {
  Dialog,
  Transition,
  DialogTitle,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { toast } from "sonner";
import { IUtilisateur } from "../../types/utilisateur.type";
import { Button } from "@heroui/react";
import { useSupprimerUtilisateurMutation } from "../../queries/utilisateur.mutation";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  utilisateur: IUtilisateur | null;
};

export function UtilisateurDeleteModal({
  isOpen,
  setIsOpen,
  utilisateur,
}: Props) {
  const { mutateAsync: supprimerUtilisateurMutation, isPending } =
    useSupprimerUtilisateurMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const handleDelete = useCallback(async () => {
    await supprimerUtilisateurMutation(utilisateur?.id || "");
    handleClose();
  }, [supprimerUtilisateurMutation, handleClose, utilisateur]);

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
                <DialogTitle className="text-lg font-medium text-gray-900 mb-4">
                  {`Supprimer ${utilisateur?.firstName} ${utilisateur?.lastName} ?`}
                </DialogTitle>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cet
                    utilisateur sera banni de l&apos;application.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="bordered"
                    onPress={handleClose}
                    disabled={isPending}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    onPress={handleDelete}
                    disabled={isPending}
                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
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
