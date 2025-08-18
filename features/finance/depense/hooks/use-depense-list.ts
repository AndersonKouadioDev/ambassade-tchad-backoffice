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
import { depenseFiltersClient } from '../filters/depense.filter';
import { useDepensesListQuery } from "../queries/depense-list.query";
import { IDepense, IDepensesParams } from "../types/depense.type";

export interface IDepenseListTableProps {
    columns: ColumnDef<IDepense>[];
}

export function useDepenseList({ columns }: IDepenseListTableProps) {
    // États pour le tri et la visibilité des colonnes et la sélection des lignes
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Gestion des paramètres d'URL via Nuqs
    const [filters, setFilters] = useQueryStates(depenseFiltersClient.filter, depenseFiltersClient.option);

    // Construction des paramètres de recherche
    const currentSearchParams: IDepensesParams = useMemo(() => {
        return {
            page: filters.page,
            limit: filters.limit,
            category: filters.category,
            description: filters.description,
            amount: filters.amount,
            expenseDate: filters.expenseDate,
        };
    }, [filters]);

    // Récupération des données avec options React Query optimisées
    const { data, isLoading, isError, error, isFetching } = useDepensesListQuery(currentSearchParams);

    const users = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;

    // États et gestionnaires pour les modales
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [lockUnlockOpen, setLockUnlockOpen] = useState(false);
    const [currentDepense, setCurrentDepense] = useState<IDepense | null>(null);

    const handleEditDepense = useCallback((depense: IDepense) => {
        setCurrentDepense(() => depense);
        setAddOpen(true);
    }, []);

    const handleDeleteDepense = useCallback((depense: IDepense) => {
        setCurrentDepense(() => depense);
        setDeleteOpen(true);
    }, []);

    /**
     * Gère les changements pour les champs de filtre textuels
     * Nuqs throttle automatiquement les mises à jour URL/serveur
     */
    const handleTextFilterChange = useCallback((
        filterName: 'description' | 'category' | 'amount' | 'expenseDate',
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
        filterName: 'category',
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
            onEdit: handleEditDepense,
            onDelete: handleDeleteDepense,
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
            lockUnlockOpen,
            deleteOpen,
        },
        modalHandlers: {
            setAddOpen,
            setLockUnlockOpen,
            setDeleteOpen,
        },
        currentDepense,
        filters,
    };
}