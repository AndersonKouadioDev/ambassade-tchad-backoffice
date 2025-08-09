"use client";

import { Fragment, useEffect, useCallback } from "react";
import {
  Dialog,
  Transition,
  DialogTitle,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModifierDepenseMutation } from "../../queries/depense.mutation";
import { depenseUpdateSchema, IDepenseUpdateDTO } from "../../schemas/depense.schema";
import { IDepense } from "../../types/depense.type";
import { useCategorieDepensesListQuery } from "../../queries/category/categorieDepense.query";
type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  depense: IDepense | null;
};

export function DepenseUpdateModal({
  isOpen,
  setIsOpen,
  depense,
}: Props) {
  // Récupération des catégories depuis la base de données
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategorieDepensesListQuery({});

  // Utiliser les données de l'API si disponibles, sinon les données de l'API

  const { mutateAsync: modifierDepenseMutation, isPending } =
    useModifierDepenseMutation();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<IDepenseUpdateDTO>({
    resolver: zodResolver(depenseUpdateSchema),
    mode: "onChange",
  });

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(() => reset(), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (data: IDepenseUpdateDTO) => {
      if (depense?.id) {
        await modifierDepenseMutation({ id: depense.id, data });
        handleClose();
      }
    },
    [modifierDepenseMutation, handleClose, depense]
  );

  useEffect(() => {
    if (!isOpen || !depense) return;

    const formValues = {
      amount: depense.amount,
      description: depense.description || "",
      categoryName: depense.category.name, // Récupérer le nom de la catégorie
      expenseDate: new Date(depense.expenseDate),
    };

    reset(formValues);
  }, [isOpen, depense, reset]);

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
                  Modifier la dépense
                </DialogTitle>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <Input
                      {...register("description")}
                      placeholder="Description"
                      type="text"
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register("amount")}
                      placeholder="Montant"
                      type="number"
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      {...register("expenseDate")}
                      placeholder="Date de dépense"
                      type="date"
                    />
                    {errors.expenseDate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.expenseDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Select
                      value={watch("categoryName") || ""}
                      onValueChange={(value) => setValue("categoryName", value)}
                      disabled={isPending || categoriesLoading}
                    >
                      <SelectTrigger className={`w-full ${errors.categoryName ? "border-red-500" : ""}`}>
                        <SelectValue placeholder={
                          categoriesLoading 
                            ? "Chargement des catégories..." 
                            : categoriesError 
                            ? "Erreur de chargement" 
                            : "Choisir une catégorie"
                        } />
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
                      <p className="text-sm text-red-500 mt-1">
                        {errors.categoryName.message}
                      </p>
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
                      {isPending ? "Modification..." : "Modifier"}
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
