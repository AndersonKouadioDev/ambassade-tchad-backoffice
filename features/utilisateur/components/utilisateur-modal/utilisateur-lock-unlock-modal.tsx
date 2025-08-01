"use client";

import { Fragment, useTransition, useCallback } from "react";
import {
  Dialog,
  Transition,
  DialogTitle,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { toast } from "sonner";
import { Button } from "@heroui/react";
import { IUtilisateur } from "../../types/utilisateur.type";
import {
  activerUtilisateurAction,
  desactiverUtilisateurAction,
} from "../../actions/utilisateur.action";
import { useInvalidateUtilisateurQuery } from "../../queries/index.query";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  utilisateur: IUtilisateur | null;
};

export function UtilisateurLockUnlockModal({
  isOpen,
  setIsOpen,
  utilisateur,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const isLocked =
    utilisateur?.status === "INACTIVE" ||
    utilisateur?.status === "DELETED" ||
    false;
  const actionText = isLocked ? "Activer" : "Verrouiller";
  const actionMessage = isLocked
    ? "Cet utilisateur pourra se connecter à nouveau"
    : "Cet utilisateur ne pourra plus se connecter";

  const handleLockUnlock = useCallback(() => {
    if (!utilisateur?.id) return;

    startTransition(async () => {
      try {
        if (isLocked) {
          await activerUtilisateurAction(utilisateur.id);
        } else {
          await desactiverUtilisateurAction(utilisateur.id);
        }

        toast.success(
          isLocked
            ? "Utilisateur activé avec succès"
            : "Utilisateur verrouillé avec succès"
        );

        await invalidateUtilisateurQuery();
        handleClose();
      } catch (error) {
        toast.error("Une erreur inattendue s'est produite", {
          description:
            error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    });
  }, [utilisateur?.id, isLocked, invalidateUtilisateurQuery, handleClose]);

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
                  {`${actionText} ${utilisateur?.firstName} ${utilisateur?.lastName}`}
                </DialogTitle>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Êtes-vous sûr de vouloir {actionText.toLowerCase()} cet
                    utilisateur ?
                  </p>
                  <p className="text-sm text-gray-500">{actionMessage}</p>
                </div>

                <div className="flex justify-end gap-3">
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
                    onPress={handleLockUnlock}
                    disabled={isPending}
                    className={`px-4 py-2 text-sm text-white rounded-md disabled:opacity-50 ${
                      isLocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isPending
                      ? isLocked
                        ? "Activation..."
                        : "Verrouillage..."
                      : actionText}
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
