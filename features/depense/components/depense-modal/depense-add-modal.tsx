"use client";

import { Fragment, useCallback } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAjouterDepenseMutation } from "../../queries/depense.mutation";
import { depenseCreateSchema, IDepenseCreateDTO } from "../../schemas/depense.schema";
import { useCategorieDepensesListQuery } from "../../queries/category/categorieDepense.query";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function DepenseAddModal({ isOpen, setIsOpen }: Props) {
  // Récupération des catégories depuis la base de données
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategorieDepensesListQuery({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<IDepenseCreateDTO>({
    resolver: zodResolver(depenseCreateSchema),
    mode: "onChange",
  });

  const { mutateAsync: ajouterDepenseMutation, isPending } = useAjouterDepenseMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(() => reset(), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (formdata: IDepenseCreateDTO) => {
      await ajouterDepenseMutation(formdata);
      handleClose();
    },
    [ajouterDepenseMutation, handleClose]
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
                  Ajouter une dépense
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input
                      {...register("description")}
                      placeholder="Description"
                      type="text"
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register("amount")}
                      placeholder="Montant"
                      type="number"
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register("expenseDate")}
                      placeholder="Date de dépense"
                      type="date"
                    />
                    {errors.expenseDate && (
                      <p className="text-sm text-red-500 mt-1">{errors.expenseDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Select
                      value={watch("categoryName") || ""}
                      onValueChange={(value) => setValue("categoryName", value)}
                      disabled={isPending || categoriesLoading}
                    >
                      <SelectTrigger
                        className={`w-full ${errors.categoryName ? "border-red-500" : ""}`}
                      >
                        <SelectValue
                          placeholder={
                            categoriesLoading
                              ? "Chargement des catégories..."
                              : categoriesError
                                ? "Erreur de chargement"
                                : "Choisir une catégorie"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories && categories.data && categories.data.length > 0 ? (
                          categories.data.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                              {cat.description && (
                                <span className="text-gray-500 text-xs ml-2">- {cat.description}</span>
                              )}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="none">
                            {categoriesLoading
                              ? "Chargement des catégories..."
                              : "Aucune catégorie disponible"}
                          </SelectItem>
                        )}
                      </SelectContent>

                    </Select>
                    {errors.categoryName && (
                      <p className="text-sm text-red-500 mt-1">{errors.categoryName.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isPending}
                      className="px-4 py-2"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !isValid}
                      className="px-4 py-2"
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
function useCategoriesActivesQuery(): { data: any; isLoading: any; error: any; } {
  throw new Error("Function not implemented.");
}

