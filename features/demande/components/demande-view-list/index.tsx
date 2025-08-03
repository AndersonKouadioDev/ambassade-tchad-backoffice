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
import { useDemandeListTable } from "../../hooks/useDemandeListTable";
import { TableOptions } from "./table-options";
import { Loader2 } from "lucide-react";
import { TableIndicatorFetching } from "./table-indicator-fetching";
import { columns } from "./column";

export function DemandeList() {
  const {
    table,
    isLoading,
    isError,
    error,
    isFetching,
    handleTextFilterChange,
    handleEnumFilterChange,
    handleDateFilterChange,
    modalStates,
    modalHandlers,
    currentDemande,
    filters,
  } = useDemandeListTable({ columns });

  return (
    <div className="w-full">
      <TableOptions
        handleTextFilterChange={handleTextFilterChange}
        handleEnumFilterChange={handleEnumFilterChange}
        handleDateFilterChange={handleDateFilterChange}
        modalHandlers={modalHandlers}
        filters={filters}
      />

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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Chargement des demandes...
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-destructive">
                    Erreur lors du chargement des demandes
                    {error?.message && `: ${error.message}`}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucune demande trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
