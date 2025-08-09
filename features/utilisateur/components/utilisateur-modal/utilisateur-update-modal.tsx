"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  UtilisateurUpdateSchema,
  UtilisateurRoleDTO,
  UtilisateurRoleSchema,
} from "../../schema/utilisateur.schema";
import { IUtilisateur, UtilisateurRole } from "../../types/utilisateur.type";
import { getEnumValues } from "@/utils/getEnumValues";
import { Button } from "@/components/ui/button";
import { useModifierRoleMutation } from "../../queries/utilisateur.mutation";
import { getUtilisateurRole } from "../../utils/getUtilisateurRole";
import { Label } from "@/components/ui/label";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  utilisateur: IUtilisateur | null;
};

export function UtilisateurUpdateModal({
  isOpen,
  setIsOpen,
  utilisateur,
}: Props) {
  const { mutateAsync: modifierRoleMutation, isPending } =
    useModifierRoleMutation();

  const roleOptions = useMemo(() => getEnumValues(UtilisateurRole), []);

  const {
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<UtilisateurRoleDTO>({
    resolver: zodResolver(UtilisateurRoleSchema),
    mode: "onChange",
  });

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(() => reset({ role: undefined }), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (data: UtilisateurRoleDTO) => {
      try {
        await modifierRoleMutation({ id: utilisateur?.id || "", data });
        handleClose();
        toast.success("Rôle de l'utilisateur modifié avec succès.");
      } catch (error) {
        toast.error("Erreur lors de la modification du rôle", {
          description:
            error instanceof Error ? error.message : "Une erreur est survenue",
        });
      }
    },
    [modifierRoleMutation, handleClose, utilisateur]
  );

  useEffect(() => {
    if (!isOpen || !utilisateur) return;

    reset({
      role: utilisateur.role,
    });
  }, [isOpen, utilisateur, reset]);

  const handleRoleChange = useCallback(
    (value: string) => {
      setValue("role", value as UtilisateurRole, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {`Modifier le rôle de ${utilisateur?.firstName} ${utilisateur?.lastName}`}
          </DialogTitle>
          <DialogDescription>
            Rôle actuel : {getUtilisateurRole(utilisateur?.role!)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="role">Nouveau rôle</Label>
            <Select
              value={watch("role")?.toString() || ""}
              onValueChange={handleRoleChange}
              disabled={isPending}
            >
              <SelectTrigger
                className={`w-full ${errors.role ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Choisir un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role.toString()}>
                    {getUtilisateurRole(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
