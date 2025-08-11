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
import { IActualite } from "../../types/actualites.type";
import { useSupprimerActualiteMutation } from "../../queries/actualite.mutation";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  actualite: IActualite | null;
};

export function ActualiteDeleteModal({
  isOpen,
  setIsOpen,
  actualite,
}: Props) {
  const { mutateAsync: supprimerActualiteMutation, isPending } =
    useSupprimerActualiteMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const handleDelete = useCallback(async () => {
    try {
      await supprimerActualiteMutation(actualite?.id || "");
      handleClose();
      toast.success("Actualité supprimée avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'actualité", {
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  }, [supprimerActualiteMutation, handleClose, actualite]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {`Supprimer ${actualite?.title} ?`}
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette actualité ?
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
