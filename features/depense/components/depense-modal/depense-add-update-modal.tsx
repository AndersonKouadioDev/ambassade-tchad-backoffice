"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  useAjouterDepenseMutation,
  useModifierDepenseMutation,
} from "../../queries/depense.mutation";
import {
  DepenseCreateSchema,
  DepenseCreateDTO,
  DepenseUpdateDTO,
  DepenseUpdateSchema,
} from "../../schemas/depense.schema";
import { useCategoriesDepensesActivesListQuery } from "../../queries/category/categorie-depense-active.query";
import { IDepense } from "../../types/depense.type";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  depense?: IDepense | null;
};

export function DepenseAddUpdateModal({ isOpen, setIsOpen, depense }: Props) {
  const isUpdate = !!depense?.id;

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategoriesDepensesActivesListQuery({ params: {} });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
    watch,
    register,
  } = useForm<DepenseCreateDTO | DepenseUpdateDTO>({
    resolver: zodResolver(isUpdate ? DepenseUpdateSchema : DepenseCreateSchema),
    mode: "onChange",
    defaultValues: {
      amount: depense?.amount!,
      description: depense?.description!,
      categoryName: depense?.category.name!,
      expenseDate: depense?.expenseDate
        ? new Date(depense.expenseDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
  });

  const { mutateAsync: ajouterDepenseMutation, isPending: isAdding } =
    useAjouterDepenseMutation();
  const { mutateAsync: updateDepenseMutation, isPending: isUpdating } =
    useModifierDepenseMutation();

  const isPending = isAdding || isUpdating;

  useEffect(() => {
    if (depense) {
      reset({
        amount: depense.amount,
        description: depense.description,
        categoryName: depense.category.name,
        expenseDate: new Date(depense.expenseDate).toISOString().split("T")[0],
      });
    } else {
      reset({
        amount: 0,
        description: "",
        categoryName: "",
        expenseDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [depense, reset]);

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
    }
  }, [isPending, setIsOpen]);

  const onSubmit = useCallback(
    async (formdata: DepenseCreateDTO | DepenseUpdateDTO) => {
      try {
        if (isUpdate) {
          await updateDepenseMutation({
            id: depense.id,
            data: formdata,
          });
        } else {
          await ajouterDepenseMutation(formdata as DepenseCreateDTO);
        }
        handleClose();
      } catch (error) {
        console.error("Erreur lors de la soumission :", error);
      }
    },
    [
      ajouterDepenseMutation,
      updateDepenseMutation,
      handleClose,
      isUpdate,
      depense,
    ]
  );

  const [openCombobox, setOpenCombobox] = useState(false);
  const selectedCategory = watch("categoryName");

  const dialogTitle = isUpdate ? "Modifier une dépense" : "Ajouter une dépense";
  const submitButtonText = isUpdate ? "Modifier" : "Ajouter";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className={cn(
                    "w-full justify-between",
                    errors.categoryName ? "border-red-500" : ""
                  )}
                  disabled={isPending || categoriesLoading || categoriesError}
                >
                  {selectedCategory
                    ? categories?.find(
                        (category) => category.name === selectedCategory
                      )?.name
                    : categoriesLoading
                    ? "Chargement..."
                    : categoriesError
                    ? "Erreur de chargement"
                    : "Choisir une catégorie"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Rechercher une catégorie..."
                    className="h-9"
                  />
                  <CommandList>
                    {categoriesLoading && (
                      <CommandEmpty>Chargement des catégories...</CommandEmpty>
                    )}
                    {categoriesError && (
                      <CommandEmpty>Erreur de chargement.</CommandEmpty>
                    )}
                    {!categoriesLoading && !categoriesError && (
                      <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {categories &&
                        categories.map((category: any) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={(currentValue) => {
                              setValue(
                                "categoryName",
                                currentValue === selectedCategory
                                  ? ""
                                  : currentValue
                              );
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategory === category.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.categoryName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("amount", { valueAsNumber: true })}
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

          <DialogFooter className="mt-4 sm:justify-end">
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
              {isPending ? "Traitement..." : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
