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
    try {
      await supprimerUtilisateurMutation(utilisateur?.id || "");
      handleClose();
      toast.success("Utilisateur supprimé avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur", {
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  }, [supprimerUtilisateurMutation, handleClose, utilisateur]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {`Supprimer ${utilisateur?.firstName} ${utilisateur?.lastName} ?`}
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cet utilisateur
            sera banni de l&apos;application.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 sm:justify-end">
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
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
