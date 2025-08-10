"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAjouterDepenseMutation } from "../../queries/depense.mutation";
import {
  DepenseCreateSchema,
  DepenseCreateDTO,
} from "../../schemas/depense.schema";
import { useCategorieDepensesListQuery } from "../../queries/category/categorie-depense.query";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function DepenseAddModal({ isOpen, setIsOpen }: Props) {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategorieDepensesListQuery();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<DepenseCreateDTO>({
    resolver: zodResolver(DepenseCreateSchema),
    mode: "onChange",
    defaultValues: {
      amount: 0,
      description: "",
      categoryName: "",
      expenseDate: new Date(),
    },
  });

  const { mutateAsync: ajouterDepenseMutation, isPending } =
    useAjouterDepenseMutation();

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(() => reset(), 200);
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (formdata: DepenseCreateDTO) => {
      await ajouterDepenseMutation(formdata);
      handleClose();
    },
    [ajouterDepenseMutation, handleClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
