"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  UtilisateurAddDTO,
  UtilisateurAddSchema,
} from "../../schema/utilisateur.schema";
import { UtilisateurRole } from "../../types/utilisateur.type";
import { getEnumValues } from "@/utils/getEnumValues";
import { getUtilisateurRole } from "../../utils/getUtilisateurRole";
import { useAjouterUtilisateurMutation } from "../../queries/utilisateur.mutation";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function UtilisateurAddModal({ isOpen, setIsOpen }: Props) {
  const roleOptions = useMemo(() => getEnumValues(UtilisateurRole), []);

  const { mutateAsync: ajouterUtilisateurMutation, isPending } =
    useAjouterUtilisateurMutation();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<UtilisateurAddDTO>({
    resolver: zodResolver(UtilisateurAddSchema),
    mode: "onChange",
  });

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(
        () =>
          reset({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            role: undefined,
          }),
        200
      );
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (formdata: UtilisateurAddDTO) => {
      try {
        await ajouterUtilisateurMutation(formdata);
        toast.success("Utilisateur ajouté avec succès.");
        handleClose();
      } catch (error) {
        toast.error("Erreur lors de l'ajout de l'utilisateur", {
          description:
            error instanceof Error ? error.message : "Une erreur est survenue",
        });
      }
    },
    [ajouterUtilisateurMutation, handleClose]
  );

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
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Prénom"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Nom"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              placeholder="Email"
              type="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Téléphone</Label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              placeholder="Téléphone"
              type="tel"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Rôle</Label>
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
              {isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}