"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-medium text-gray-900">
              Supprimer la dépense
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="my-4">
          <DialogDescription className="text-sm text-gray-500 mb-3">
            Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est
            irréversible.
          </DialogDescription>
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
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                }).format(depense.amount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Catégorie:</span>
              <span className="font-medium">{depense.category.name}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
