"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@heroui/react";

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
  modalHandlers,
  filters,
}: Pick<
  ReturnType<typeof useDemandeListTable>,
  | "handleTextFilterChange"
  | "handleEnumFilterChange"
  | "handleDateFilterChange"
  | "modalHandlers"
  | "filters"
>) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
          <Input
            placeholder="Filtrer par N° Ticket..."
            value={filters.ticketNumber || ""}
            onChange={(e) =>
              handleTextFilterChange("ticketNumber", e.target.value)
            }
            className="w-full"
          />

          <Select
            onValueChange={(value) => handleEnumFilterChange("status", value)}
            value={filters.status || "_all_"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrer par type de service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all_">Tous les types de service</SelectItem>
              {getEnumValues(ServiceType).map((serviceValue) => (
                <SelectItem key={serviceValue} value={serviceValue}>
                  {getServiceTypeLabel(serviceValue as ServiceType).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filters */}
          <Input
            type="date"
            placeholder="Date de début (Du)"
            value={filters.fromDate || ""}
            onChange={(e) => handleDateFilterChange("fromDate", e.target.value)}
            className="w-full"
          />
          <Input
            type="date"
            placeholder="Date de fin (Au)"
            value={filters.toDate || ""}
            onChange={(e) => handleDateFilterChange("toDate", e.target.value)}
            className="w-full"
          />

          {/* userId filter, if applicable (e.g., for admin view to filter by specific demander) */}
          {/* <Input
                        placeholder="Filtrer par ID Utilisateur..."
                        value={filters.userId || ""}
                        onChange={(e) => handleTextFilterChange("userId", e.target.value)}
                        className="w-full"
                    /> */}
        </div>
        <div className="flex justify-end md:justify-start">
          {/* Add button for creating a new demand, if applicable */}
          {/* <Button
                        onPress={() => modalHandlers.setAddOpen(true)}
                        color="primary"
                    >
                        Créer une nouvelle demande
                    </Button> */}
        </div>
      </div>
    </div>
  );
}
