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
import {IEvenement} from "@/features/evenement/types/evenement.type";
import {useEvenementSupprimerMutation} from "@/features/evenement/queries/evenement.mutation";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  evenement: IEvenement | null;
};

export function EvenementDeleteModal({
  isOpen,
  setIsOpen,
  evenement,
}: Props) {
  const { mutateAsync: supprimerEvenementMutation, isPending } =
    useEvenementSupprimerMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const handleDelete = useCallback(async () => {
    try {
      await supprimerEvenementMutation(evenement?.id || "");
      handleClose();
      toast.success("Actualité supprimée avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'actualité", {
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  }, [supprimerEvenementMutation, handleClose, evenement]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {`Supprimer ${evenement?.title} ?`}
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
