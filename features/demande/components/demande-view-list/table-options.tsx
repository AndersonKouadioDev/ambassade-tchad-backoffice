"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getEnumValues } from "@/utils/getEnumValues";
import { DemandeStatus } from "../../types/demande.type";

import { getDemandeStatusLabel } from "../../utils/getDemandeStatusLabel";
import { getServiceTypeLabel } from "../../utils/getServiceTypeLabel";
import { ServiceType } from "@/features/service/types/service.type";
import { useDemandeListTable } from "../../hooks/useDemandeListTable";
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

export function TableOptions({
  handleTextFilterChange,
  handleEnumFilterChange,
  handleDateFilterChange,
  filters,
}: Pick<
  ReturnType<typeof useDemandeListTable>,
  | "handleTextFilterChange"
  | "handleEnumFilterChange"
  | "handleDateFilterChange"
  | "filters"
>) {
  const locale = useLocale();

  // Helper function to safely create Date objects
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

  const fromDate = safeDate(filters.fromDate);
  const toDate = safeDate(filters.toDate);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span>Filtrages</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-3 w-full">
          <div className="space-y-2">
            <Label htmlFor="period-select">N° Ticket</Label>
            <Input
              placeholder="Filtrer par N° Ticket..."
              value={filters.ticketNumber || ""}
              onChange={(e) =>
                handleTextFilterChange("ticketNumber", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-select">Statut</Label>
            <Select
              onValueChange={(value) => handleEnumFilterChange("status", value)}
              value={filters.status || "_all_"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="_all_">Tous les statuts</SelectItem>
                {getEnumValues(DemandeStatus).map((statusValue) => (
                  <SelectItem key={statusValue} value={statusValue}>
                    {getDemandeStatusLabel(statusValue as DemandeStatus).label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-select">Type de service</Label>
            <Select
              onValueChange={(value) =>
                handleEnumFilterChange("serviceType", value)
              }
              value={filters.serviceType || "_all_"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par type de service" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="_all_">Tous les types de service</SelectItem>
                {getEnumValues(ServiceType).map((serviceValue) => (
                  <SelectItem key={serviceValue} value={serviceValue}>
                    {getServiceTypeLabel(serviceValue as ServiceType).label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between min-h-[24px]">
              <Label>Date de début</Label>
              <RefreshCcw
                size={16}
                className="text-muted-foreground/80 hover:text-foreground shrink-0 transition-colors cursor-pointer"
                aria-hidden="true"
                onClick={() => handleDateFilterChange("fromDate", "")}
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
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    {fromDate ? (
                      <>
                        {format(fromDate, "dd LLL, y", {
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
                  selected={fromDate ? fromDate : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleDateFilterChange(
                        "fromDate",
                        format(date, "yyyy-MM-dd")
                      );
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 min-h-[24px]">
              <Label>Date de fin</Label>
              <RefreshCcw
                size={16}
                className="text-muted-foreground/80 hover:text-foreground shrink-0 transition-colors cursor-pointer"
                aria-hidden="true"
                onClick={() => handleDateFilterChange("toDate", "")}
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
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    {toDate ? (
                      <>
                        {format(toDate, "dd LLL, y", {
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
                  selected={toDate ? toDate : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleDateFilterChange(
                        "toDate",
                        format(date, "yyyy-MM-dd")
                      );
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
