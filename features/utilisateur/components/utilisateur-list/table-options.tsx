"use client";
import { Input } from "@/components/ui/input";
import {
  UtilisateurRole,
  UtilisateurStatus,
} from "../../types/utilisateur.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUtilisateurListTable } from "../../hooks/useUtilisateurListTable";
import { Button } from "@heroui/react";
import { getEnumValues } from "@/utils/getEnumValues";
import { getUtilisateurRole } from "../../utils/getUtilisateurRole";
import { getUtilisateurStatus } from "../../utils/getUtilisateurStatus";

export function TableOptions({
  handleTextFilterChange,
  handleEnumFilterChange,
  modalHandlers,
  filters,
  type,
}: Pick<
  ReturnType<typeof useUtilisateurListTable>,
  | "handleTextFilterChange"
  | "handleEnumFilterChange"
  | "modalHandlers"
  | "filters"
> & {
  type: "personnel" | "demandeur";
}) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          <Input
            placeholder="Filtrer par email..."
            value={filters.email}
            onChange={(e) => handleTextFilterChange("email", e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Filtrer par téléphone..."
            value={filters.phoneNumber}
            onChange={(e) =>
              handleTextFilterChange("phoneNumber", e.target.value)
            }
            className="w-full"
          />
          <Select
            onValueChange={(value) => handleEnumFilterChange("status", value)}
            value={filters.status}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all_">Tous les statuts</SelectItem>
              {getEnumValues(UtilisateurStatus).map((statusValue) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {getUtilisateurStatus(statusValue)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {type === "personnel" && (
            <Select
              onValueChange={(value) => handleEnumFilterChange("role", value)}
              value={filters.role || "_all_"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all_">Tous les rôles</SelectItem>
                {getEnumValues(UtilisateurRole).map((roleValue) => (
                  <SelectItem key={roleValue} value={roleValue}>
                    {getUtilisateurRole(roleValue)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex justify-end md:justify-start">
          {type === "personnel" && (
            <Button
              onPress={() => modalHandlers.setAddOpen(true)}
              color="primary"
            >
              Ajouter un utilisateur
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
