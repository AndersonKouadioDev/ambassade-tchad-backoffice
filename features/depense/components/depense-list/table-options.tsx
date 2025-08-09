"use client";
import { Input } from "@/components/ui/input";
import { useDepenseListTable } from "../../hooks/depenseListTable";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Calendar, DollarSign } from "lucide-react";

export function TableOptions({
  handleTextFilterChange,
  modalHandlers,
  filters,
}: Pick<
  ReturnType<typeof useDepenseListTable>,
  | "handleTextFilterChange"
  | "handleEnumFilterChange"
  | "modalHandlers"
  | "filters"
>) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          {/* Filtre par description */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Filtrer par description..."
              value={filters.title}
              onChange={(e) => handleTextFilterChange("title", e.target.value)}
              className="w-full pl-10"
            />
          </div>

          {/* Filtre par nom de catégorie */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Filtrer par catégorie..."
              value={filters.category}
              onChange={(e) => handleTextFilterChange("category", e.target.value)}
              className="w-full pl-10"
            />
          </div>

          {/* Filtre par montant minimum */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="date"
              placeholder="Date de dépense..."
              value={filters.expenseDate}
              onChange={(e) => handleTextFilterChange("expenseDate", e.target.value)}
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
