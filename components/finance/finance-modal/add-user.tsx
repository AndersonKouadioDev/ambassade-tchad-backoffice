"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FormData = {
  user: { name: string; image: string };
  service: string;
  post: string;
  role: string;
};

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
};

export default function AddUserModal({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  onSubmit,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>
        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              placeholder="Nom complet"
              value={formData.user.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  user: { ...prev.user, name: e.target.value },
                }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="Image URL"
              value={formData.user.image}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  user: { ...prev.user, image: e.target.value },
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <Input
              id="service"
              placeholder="Service"
              value={formData.service}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, service: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="post">Poste</Label>
            <Input
              id="post"
              placeholder="Poste"
              value={formData.post}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, post: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Rôle</Label>
            <Input
              id="role"
              placeholder="Rôle"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}