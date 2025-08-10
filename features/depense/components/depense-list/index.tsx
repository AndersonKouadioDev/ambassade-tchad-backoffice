"use client";

import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./table-pagination";
import { columnsDepenses } from "./column";
import { useDepenseListTable } from "../../hooks/depenseListTable";
import { TableOptions } from "./table-options";
import { Loader2 } from "lucide-react";
import { TableIndicatorFetching } from "./table-indicator-fetching";
import { DepenseAddModal } from "../depense-modal/depense-add-modal";

export function DepenseList() {
  const columns = columnsDepenses;
  const {
    table,
    isLoading,
    isError,
    error,
    isFetching,
    handleTextFilterChange,
    handleEnumFilterChange,
    modalStates,
    modalHandlers,
    filters,
  } = useDepenseListTable({ columns });

  return (
    <div className="w-full">
      <TableOptions
        handleTextFilterChange={handleTextFilterChange}
        handleEnumFilterChange={handleEnumFilterChange}
        modalHandlers={modalHandlers}
        filters={filters}
      />

      {/* Indicateur de chargement global */}
      <div className="relative">
        <TableIndicatorFetching isFetching={isFetching} />

        <Table>
          <TableHeader className="bg-default-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // État de chargement initial
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Chargement des données...
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              // État d'erreur
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-destructive">
                    Erreur lors du chargement des données
                    {error?.message && `: ${error.message}`}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              // Données chargées
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={isFetching ? "opacity-70" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Aucun résultat
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />

      {/* Modales */}
      <DepenseAddModal
        isOpen={modalStates.addOpen}
        setIsOpen={modalHandlers.setAddOpen}
      />

      {/* {currentDepense && (
        <>
          <DepenseUpdateModal
            isOpen={modalStates.editOpen}
            setIsOpen={modalHandlers.setEditOpen}
            depense={currentDepense}
          />
          <DepenseDeleteModal
            isOpen={modalStates.deleteOpen}
            setIsOpen={modalHandlers.setDeleteOpen}
            depense={currentDepense}
          />
        </>
      )} */}
    </div>
  );
}
