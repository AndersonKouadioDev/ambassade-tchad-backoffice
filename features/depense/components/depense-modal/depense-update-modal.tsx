"use client";

import { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModifierDepenseMutation } from "../../queries/depense.mutation";
import {
  DepenseUpdateSchema,
  DepenseUpdateDTO,
} from "../../schemas/depense.schema";
import { IDepense } from "../../types/depense.type";
import { useCategorieDepensesListQuery } from "../../queries/category/categorie-depense.query";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  depense: IDepense | null;
};

export function DepenseUpdateModal({ isOpen, setIsOpen, depense }: Props) {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategorieDepensesListQuery();

  const { mutateAsync: modifierDepenseMutation, isPending } =
    useModifierDepenseMutation();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<DepenseUpdateDTO>({
    resolver: zodResolver(DepenseUpdateSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      description: "",
      categoryName: "",
      expenseDate: new Date(),
    },
  });

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(() => reset(), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (data: DepenseUpdateDTO) => {
      if (depense?.id) {
        await modifierDepenseMutation({ id: depense.id, data });
        handleClose();
      }
    },
    [modifierDepenseMutation, handleClose, depense]
  );

  useEffect(() => {
    if (!isOpen || !depense) return;

    // Formater la date en string au format "YYYY-MM-DD"
    const formattedDate = new Date(depense.expenseDate);

    const formValues = {
      amount: depense.amount,
      description: depense.description || "",
      categoryName: depense.category.name,
      expenseDate: formattedDate,
    };

    reset(formValues);
  }, [isOpen, depense, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Modifier la dépense</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              {...register("description")}
              placeholder="Description"
              type="text"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Input
              {...register("amount", { valueAsNumber: true })}
              placeholder="Montant"
              type="number"
              className={errors.amount ? "border-red-500" : ""}
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
              className={errors.expenseDate ? "border-red-500" : ""}
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
              <SelectTrigger
                className={`w-full ${
                  errors.categoryName ? "border-red-500" : ""
                }`}
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
                  categories.data.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                      {cat.description && (
                        <span className="text-gray-500 text-xs ml-2">
                          - {cat.description}
                        </span>
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

          <DialogFooter className="flex justify-end gap-3 pt-4">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
