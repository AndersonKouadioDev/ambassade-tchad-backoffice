"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewUserModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: {
    name?: string;
    service?: string;
    post?: string;
    role?: string;
  } | null;
}

export function ViewUserModal({ isOpen, setIsOpen, user }: ViewUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de l&apos;utilisateur</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <p>
            <strong>Nom :</strong> {user?.name}
          </p>
          <p>
            <strong>Service :</strong> {user?.service}
          </p>
          <p>
            <strong>Poste :</strong> {user?.post}
          </p>
          <p>
            <strong>Rôle :</strong> {user?.role}
          </p>
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setIsOpen(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
