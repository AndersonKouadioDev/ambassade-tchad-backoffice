"use client";

import { Fragment, useCallback, useMemo } from "react";
import {
  Dialog,
  Transition,
  DialogTitle,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UtilisateurAddDTO,
  UtilisateurAddSchema,
} from "../../schema/utilisateur.schema";
import { UtilisateurRole } from "../../types/utilisateur.type";
import { getEnumValues } from "@/utils/getEnumValues";
import { Button } from "@heroui/react";
import { getUtilisateurRole } from "../../utils/getUtilisateurRole";
import { useAjouterUtilisateurMutation } from "../../queries/utilisateur.mutation";
import { processAndValidateFormData } from "ak-zod-form-kit";
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
      setTimeout(() => reset({ role: undefined }), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (formdata: UtilisateurAddDTO) => {
      try {
        // Validation des données
        const result = processAndValidateFormData(
          UtilisateurAddSchema,
          formdata,
          {
            outputFormat: "object",
          }
        );

        if (!result.success) {
          throw new Error(
            result.errorsInString ||
              "Une erreur est survenue lors de la validation des données."
          );
        }

        // Ajout de l'utilisateur
        await ajouterUtilisateurMutation(result.data as UtilisateurAddDTO);

        // Fermeture de la modal
        handleClose();
      } catch (error) {
        // Gestion des erreurs de la requête depuis le hook de mutation

        // Surcharge des erreurs de la requête
        toast.error("Erreur :", {
          description:
            error instanceof Error ? error.message : "Erreur inconnue",
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="text-lg font-medium text-gray-900 mb-4">
                  Ajouter un utilisateur
                </DialogTitle>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    {...register("firstName")}
                    placeholder="Prénom"
                    type="text"
                  />
                  <Input
                    {...register("lastName")}
                    placeholder="Nom"
                    type="text"
                  />
                  <Input
                    {...register("email")}
                    placeholder="Email"
                    type="email"
                  />
                  <Input
                    {...register("phoneNumber")}
                    placeholder="Téléphone"
                    type="tel"
                  />
                  <div>
                    <Select
                      value={watch("role")?.toString() || ""}
                      onValueChange={handleRoleChange}
                      disabled={isPending}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          errors.role ? "border-red-500" : ""
                        }`}
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
                      <p className="text-sm text-red-500 mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="bordered"
                      onPress={handleClose}
                      disabled={isPending}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !isValid}
                      className="px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isPending ? "Ajout..." : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
