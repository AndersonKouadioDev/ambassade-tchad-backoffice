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
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-3 w-full">
          <Input
            placeholder="Filtrer par N° Ticket..."
            value={filters.ticketNumber || ""}
            onChange={(e) =>
              handleTextFilterChange("ticketNumber", e.target.value)
            }
          />

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

          <Input
            type="date"
            placeholder="Date de début (Du)"
            value={filters.fromDate || ""}
            onChange={(e) => handleDateFilterChange("fromDate", e.target.value)}
          />
          <Input
            type="date"
            placeholder="Date de fin (Au)"
            value={filters.toDate || ""}
            onChange={(e) => handleDateFilterChange("toDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
