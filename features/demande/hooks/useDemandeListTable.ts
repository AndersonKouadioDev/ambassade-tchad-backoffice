"use client";
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

import { demandeFiltersClient } from '../filters/demande.filters';
import { IDemande, IDemandeRechercheParams, DemandeStatus } from "../types/demande.type";
import { useDemandesFilteredListQuery } from "../queries/demande-list.query";
import { ServiceType } from "@/features/service/types/service.type";
import { useRouter } from "next/navigation";

export interface IDemandeListTableProps {
    columns: ColumnDef<IDemande>[];
}

export function useDemandeListTable({ columns }: IDemandeListTableProps) {
    const router = useRouter();
    // States for sorting, column visibility, and row selection (common to any table)
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // --- Nuqs state management for URL query parameters ---
    const [filters, setFilters] = useQueryStates(demandeFiltersClient.filter, demandeFiltersClient.option);

    // --- Memoized search parameters for the API query ---
    const currentSearchParams: IDemandeRechercheParams = useMemo(() => {
        // Construct search parameters based on URL filters
        return {
            page: filters.page,
            limit: filters.limit,
            ticketNumber: filters.ticketNumber || undefined,
            status: filters.status || undefined,
            serviceType: filters.serviceType || undefined,
            userId: filters.userId || undefined,
            fromDate: filters.fromDate || undefined,
            toDate: filters.toDate || undefined,
        };
    }, [filters]);

    const { data, isLoading, isError, error, isFetching } = useDemandesFilteredListQuery(currentSearchParams);

    const demandes = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;

    const handleViewDemande = useCallback((demande: IDemande) => {
        router.push(`/demande/${demande.ticketNumber}`);
    }, [router]);

    /**
     * Handles changes for textual filter fields.
     * Nuqs automatically throttles URL/server updates.
     */
    const handleTextFilterChange = useCallback((
        filterName: 'ticketNumber' | 'userId',
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value,
            page: 1,
        }));
    }, [setFilters]);

    /**
     * Handles changes for enum filter fields.
     * No throttling needed for these filters (less frequent changes).
     */
    const handleEnumFilterChange = useCallback((
        filterName: 'status' | 'serviceType',
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value === "_all_" ? "" : (value as DemandeStatus | ServiceType),
            page: 1,
        }));
    }, [setFilters]);

    /**
     * Handles changes for date filter fields.
     */
    const handleDateFilterChange = useCallback((
        filterName: 'fromDate' | 'toDate',
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value || undefined,
            page: 1,
        }));
    }, [setFilters]);

    const table = useReactTable({
        data: demandes,
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
            onView: handleViewDemande,
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
        handleDateFilterChange,
        filters,
    };
}