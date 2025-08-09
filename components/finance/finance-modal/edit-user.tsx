"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditUserModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: {
    user: { name: string; image: string };
    service: string;
    post: string;
    role: string;
    [key: string]: any;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function EditUserModal({
  isOpen,
  setIsOpen,
  user,
  onChange,
  onSubmit,
}: EditUserModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
        </DialogHeader>
        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              placeholder="Nom"
              value={user.user.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <Input
              id="service"
              placeholder="Service"
              value={user.service}
              onChange={(e) => onChange("service", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="post">Poste</Label>
            <Input
              id="post"
              placeholder="Poste"
              value={user.post}
              onChange={(e) => onChange("post", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Rôle</Label>
            <Input
              id="role"
              placeholder="Rôle"
              value={user.role}
              onChange={(e) => onChange("role", e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
