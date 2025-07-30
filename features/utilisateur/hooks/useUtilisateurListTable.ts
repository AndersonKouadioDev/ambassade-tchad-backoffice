import { useState, useMemo, useCallback } from "react";
import {
    SortingState,
    VisibilityState,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    ColumnDef,
} from "@tanstack/react-table";
import { useQueryStates } from 'nuqs';
import { utilisateurFiltersClient } from '../filters/utilisateur.filters';
import { useUtilisateursListQuery } from "../queries/utilisateur-list.query";
import { DataProps } from '../components/user-list-table/column';
import { UtilisateursParamsDTO } from "../schema/utilisateur-params.schema";
import { IUtilisateur } from "../types/utilisateur.type";

export interface IUtilisateurListTableProps {
    columns: ColumnDef<IUtilisateur>[];
}

export function useUtilisateurListTable({ columns }: IUtilisateurListTableProps) {
    // États pour le tri et la visibilité des colonnes et la sélection des lignes
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Gestion des paramètres d'URL via Nuqs avec throttling
    const [filters, setFilters] = useQueryStates(utilisateurFiltersClient, {
        clearOnDefault: true,
        throttleMs: 500, // 500ms de délai pour les filtres textuels
    });

    // Construction des paramètres de recherche
    const currentSearchParams: UtilisateursParamsDTO = useMemo(() => {
        return {
            page: filters.page,
            limit: filters.limit,
            firstName: filters.firstName || undefined,
            lastName: filters.lastName || undefined,
            email: filters.email || undefined,
            phoneNumber: filters.phoneNumber || undefined,
            type: filters.type,
            status: filters.status,
            role: filters.role || undefined,
        };
    }, [filters]);

    // Récupération des données avec options React Query optimisées
    const { data, isLoading, isError, error, isFetching } = useUtilisateursListQuery(currentSearchParams);

    const users = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;

    // États et gestionnaires pour les modales
    const [addOpen, setAddOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<DataProps | null>(null);

    const handleViewUser = useCallback((user: DataProps) => {
        setCurrentUser(user);
        setViewOpen(true);
    }, []);

    const handleEditUser = useCallback((user: DataProps) => {
        setCurrentUser(user);
        setEditOpen(true);
    }, []);

    const handleDeleteUser = useCallback((user: DataProps) => {
        setCurrentUser(user);
        setDeleteOpen(true);
    }, []);

    /**
     * Gère les changements pour les champs de filtre textuels
     * Nuqs throttle automatiquement les mises à jour URL/serveur
     */
    const handleTextFilterChange = useCallback((
        filterName: 'firstName' | 'lastName' | 'email' | 'phoneNumber',
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value,
            page: 1, // Réinitialise à la première page
        }));
    }, [setFilters]);

    /**
     * Gère les changements pour les champs de filtre d'enum
     * Pas de throttling nécessaire pour ces filtres (changements moins fréquents)
     */
    const handleEnumFilterChange = useCallback((
        filterName: 'type' | 'status' | 'role',
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value === "_all_" ? "" : value,
            page: 1,
        }));
    }, [setFilters]);

    // Configuration de TanStack Table
    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        pageCount: totalPages,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: (filters.page || 1) - 1,
                pageSize: filters.limit || 10,
            },
        },
        onPaginationChange: (updater) => {
            const newState = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
            setFilters(prev => ({
                ...prev,
                page: newState.pageIndex + 1,
                limit: newState.pageSize,
            }));
        },
        meta: {
            onView: handleViewUser,
            onEdit: handleEditUser,
            onDelete: handleDeleteUser,
        },
    });

    return {
        table,
        isLoading,
        isError,
        error,
        isFetching,
        handleTextFilterChange,
        handleEnumFilterChange,
        modalStates: {
            addOpen,
            viewOpen,
            editOpen,
            deleteOpen,
        },
        modalHandlers: {
            setAddOpen,
            setViewOpen,
            setEditOpen,
            setDeleteOpen,
        },
        currentUser,
        filters,
    };
}