"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IUtilisateur } from "../../types/utilisateur.type";
import {
  useActiverUtilisateurMutation,
  useDesactiverUtilisateurMutation,
} from "../../queries/utilisateur.mutation";

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
  const { mutateAsync: activerMutation, isPending: isActivating } =
    useActiverUtilisateurMutation();
  const { mutateAsync: desactiverMutation, isPending: isDeactivating } =
    useDesactiverUtilisateurMutation();

  const isPending = isActivating || isDeactivating;

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
    ? "Cet utilisateur pourra se connecter à nouveau."
    : "Cet utilisateur ne pourra plus se connecter.";
  const toastSuccessMessage = isLocked
    ? "Utilisateur activé avec succès."
    : "Utilisateur verrouillé avec succès.";
  const toastErrorMessage = isLocked
    ? "Erreur lors de l'activation de l'utilisateur"
    : "Erreur lors du verrouillage de l'utilisateur";

  const handleLockUnlock = useCallback(async () => {
    try {
      if (isLocked) {
        await activerMutation(utilisateur?.id || "");
      } else {
        await desactiverMutation(utilisateur?.id || "");
      }
      handleClose();
      toast.success(toastSuccessMessage);
    } catch (error) {
      toast.error(toastErrorMessage, {
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  }, [
    utilisateur,
    isLocked,
    activerMutation,
    desactiverMutation,
    handleClose,
    toastSuccessMessage,
    toastErrorMessage,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {`${actionText} ${utilisateur?.firstName} ${utilisateur?.lastName}`}
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir {actionText.toLowerCase()} cet utilisateur
            ? {actionMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
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
            variant={isLocked ? "default" : "destructive"}
            onClick={handleLockUnlock}
            disabled={isPending}
          >
            {isPending
              ? isLocked
                ? "Activation..."
                : "Verrouillage..."
              : actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
