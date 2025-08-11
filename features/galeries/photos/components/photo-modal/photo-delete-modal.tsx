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
import { IPhoto } from "../../types/photo.type";
import { useSupprimerPhotoMutation } from "../../queries/photo.mutation";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  photo: IPhoto | null;
};

export function PhotoDeleteModal({
  isOpen,
  setIsOpen,
  photo,
}: Props) {
  const { mutateAsync: supprimerPhotoMutation, isPending } =
    useSupprimerPhotoMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const handleDelete = useCallback(async () => {
    try {
      await supprimerPhotoMutation(photo?.id || "");
      handleClose();
      toast.success("Photo supprimée avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la photo", {
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    }
  }, [supprimerPhotoMutation, handleClose, photo]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {`Supprimer ${photo?.title} ?`}
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette photo ?
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
