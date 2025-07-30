"use client";

import { flexRender } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./table-pagination";
import { columns } from "./column";
import { useUtilisateurListTable } from "../../hooks/useUtilisateurListTable";

import {
  UtilisateurRole,
  UtilisateurStatus,
  UtilisateurType,
} from "../../types/utilisateur.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Uncomment these once your modal components are ready
// import AddUserModal from "../user-modal/add-user"
// import { ViewUserModal } from "../user-modal/view-user"
// import { EditUserModal } from "../user-modal/edit-user"
// import { DeleteUserModal } from "../user-modal/delete-user"

export default function UserListTable() {
  const {
    table,
    isLoading,
    isError,
    error,
    handleTextFilterChange,
    handleEnumFilterChange,
    modalStates,
    modalHandlers,
    currentUser,
    filters,
  } = useUtilisateurListTable(columns);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-5">
        <div className="flex flex-wrap gap-3">
          {/* <Input
            placeholder="Filtrer par prénom..."
            value={filters.firstName}
            onChange={(e) =>
              handleTextFilterChange("firstName", e.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder="Filtrer par nom..."
            value={filters.lastName}
            onChange={(e) => handleTextFilterChange("lastName", e.target.value)}
            className="max-w-sm"
          /> */}
          <Input
            placeholder="Filtrer par email..."
            value={filters.email}
            onChange={(e) => handleTextFilterChange("email", e.target.value)}
            className="max-w-sm"
          />
          <Input
            placeholder="Filtrer par téléphone..."
            value={filters.phoneNumber}
            onChange={(e) =>
              handleTextFilterChange("phoneNumber", e.target.value)
            }
            className="max-w-sm"
          />
          <Select
            onValueChange={(value) => handleEnumFilterChange("type", value)}
            value={filters.type}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all_">Tous les types</SelectItem>
              {Object.values(UtilisateurType).map((typeValue) => (
                <SelectItem key={typeValue} value={typeValue}>
                  {typeValue.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleEnumFilterChange("status", value)}
            value={filters.status}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all_">Tous les statuts</SelectItem>
              {Object.values(UtilisateurStatus).map((statusValue) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {statusValue.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleEnumFilterChange("role", value)}
            value={filters.role || "_all_"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all_">Tous les rôles</SelectItem>
              {Object.values(UtilisateurRole).map((roleValue) => (
                <SelectItem key={roleValue} value={roleValue}>
                  {roleValue.replace(/_/g, " ").toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => modalHandlers.setAddOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm"
          >
            Ajouter un utilisateur
          </button>
        </div>
      </div>

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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination table={table} />

      {/* <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        // You'll need to adjust formData and onSubmit props based on your modal's needs
        // formData={formData}
        // setFormData={setFormData}
        // onSubmit={handleAddUser}
      />

      {currentUser && (
        <>
          <ViewUserModal isOpen={viewOpen} setIsOpen={setViewOpen} user={currentUser} />
          <EditUserModal
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            user={currentUser}
            onChange={() => {}} // Implement this
            onSubmit={() => {}} // Implement this
          />
          <DeleteUserModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            user={currentUser}
            onDelete={() => {}} // Implement this
          />
        </>
      )}  */}
    </div>
  );
}
