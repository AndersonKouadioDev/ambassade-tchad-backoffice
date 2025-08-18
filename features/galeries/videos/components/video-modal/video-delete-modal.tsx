"use client";

import {useCallback} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {IVideo} from "../../types/video.type";
import {useSupprimerVideoMutation} from "../../queries/video.mutation";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  video: IVideo | null;
};

export function VideoDeleteModal({
  isOpen,
  setIsOpen,
  video,
}: Props) {
  const { mutateAsync: supprimerVideoMutation, isPending } =
    useSupprimerVideoMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const handleDelete = useCallback(async () => {
    try {
      await supprimerVideoMutation(video?.id || "");
      handleClose();
      // toast.success("Video supprimée avec succès.");
    } catch (error) {
      // toast.error("Erreur lors de la suppression de la video", {
      //   description:
      //     error instanceof Error ? error.message : "Une erreur est survenue",
      // });
    }
  }, [supprimerVideoMutation, handleClose, video]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {`Supprimer ${video?.title} ?`}
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette video ?
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
