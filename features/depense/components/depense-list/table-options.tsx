"use client";

import { Input } from "@/components/ui/input";
import { useDepenseList } from "../../hooks/use-depense-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoriesDepensesActivesListQuery } from "../../queries/category/categorie-depense-active.query";

export function TableOptions({
  handleTextFilterChange,
  handleEnumFilterChange,
  modalHandlers,
  filters,
}: Pick<
  ReturnType<typeof useDepenseList>,
  | "handleTextFilterChange"
  | "handleEnumFilterChange"
  | "modalHandlers"
  | "filters"
>) {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoriesDepensesActivesListQuery({ params: {} });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-3 w-full">
          {/* Filtre par description */}
          <div className="relative">
            <Input
              placeholder="Filtrer par description..."
              value={filters.description}
              onChange={(e) =>
                handleTextFilterChange("description", e.target.value)
              }
              className="w-full pl-10"
            />
          </div>

          {/* Filtre par nom de catégorie */}

          <div className="relative">
            <Select
              onValueChange={(value) =>
                handleEnumFilterChange("category", value)
              }
              value={filters.category}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? "Chargement des catégories..."
                      : categoriesError
                      ? "Erreur de chargement"
                      : "Filtrer par catégorie"
                  }
                />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="_all_">Toutes les catégories</SelectItem>
                {categories && categories.length > 0 ? (
                  categories.map((cat: any) => (
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
          </div>

          {/* Filtre par montant minimum */}
          <div className="relative">
            <Input
              type="number"
              placeholder="Montant minimum..."
              value={filters.amount || ""}
              onChange={(e) => handleTextFilterChange("amount", e.target.value)}
              className="w-full pl-10"
            />
          </div>

          {/* Filtre par date de dépense */}
          <div className="relative">
            <Input
              type="date"
              placeholder="Date de dépense..."
              value={filters.expenseDate}
              onChange={(e) =>
                handleTextFilterChange("expenseDate", e.target.value)
              }
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Bouton d'ajout */}
        <div className="flex gap-2">
          <Button
            onClick={() => modalHandlers.setAddOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une dépense
          </Button>
        </div>
      </div>
    </div>
  );
}
