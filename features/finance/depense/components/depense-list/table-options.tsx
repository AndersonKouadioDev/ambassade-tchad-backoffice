"use client";

import { Input } from "@/components/ui/input";
import { useDepenseList } from "../../hooks/use-depense-list";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Filter, RefreshCcw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { fr, enGB, ar } from "react-day-picker/locale";
import { useLocale } from "next-intl";

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
  const locale = useLocale();

  const safeDate = (
    dateString: string | null | undefined
  ): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  // Get locale for date-fns
  const getDateFnsLocale = () => {
    switch (locale) {
      case "fr":
        return fr;
      case "ar":
        return ar;
      default:
        return enGB;
    }
  };

  const expenseDate = safeDate(filters.expenseDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span>Filtrages</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-3 w-full">
          <div className="space-y-2">
            <Label htmlFor="period-select">Description</Label>
            <Input
              placeholder="Filtrer par description..."
              value={filters.description}
              onChange={(e) =>
                handleTextFilterChange("description", e.target.value)
              }
              className="w-full pl-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-select">Catégorie</Label>
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

          <div className="space-y-2">
            <div className="flex items-center gap-2 min-h-[24px]">
              <Label>Date de dépense</Label>
              <RefreshCcw
                size={16}
                className="text-muted-foreground/80 hover:text-foreground shrink-0 transition-colors cursor-pointer"
                aria-hidden="true"
                onClick={() => handleTextFilterChange("expenseDate", "")}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                >
                  <span
                    className={cn(
                      "truncate",
                      !expenseDate && "text-muted-foreground"
                    )}
                  >
                    {expenseDate ? (
                      <>
                        {format(expenseDate, "dd LLL, y", {
                          locale: getDateFnsLocale(),
                        })}
                      </>
                    ) : (
                      "Choisir une date"
                    )}
                  </span>
                  <CalendarIcon
                    size={16}
                    className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <Calendar
                  mode="single"
                  locale={getDateFnsLocale()}
                  selected={expenseDate ? expenseDate : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleTextFilterChange(
                        "expenseDate",
                        format(date, "yyyy-MM-dd")
                      );
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period-select">Montant minimum</Label>
            <Input
              type="number"
              placeholder="Montant minimum..."
              value={filters.amount || ""}
              onChange={(e) => handleTextFilterChange("amount", e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
