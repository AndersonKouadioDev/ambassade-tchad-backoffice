import { useMemo } from 'react';
import { useQueryStates } from 'nuqs';
import { financialReportFiltersClient } from '../filters/rapport-financier.filter';
import { useFinancialReportQuery } from '../queries/rapport-financier.query';
import { FinancialReportResponse, FilterOptions, KPIData } from '../types/rapport-financier.type';

export function useFinancialReport() {
    const [filters, setFilters] = useQueryStates(
        financialReportFiltersClient.filter, 
        financialReportFiltersClient.option
    );

    const currentSearchParams: FilterOptions = useMemo(() => {
        return {
            period: filters.period as "year" | "month" | "quarter",
            year: filters.year,
            month: filters.month,
            quarter: filters.quarter,
        };
    }, [filters]);

    const {
        data,
        isLoading,
        isError,
        error,
        isFetching
    } = useFinancialReportQuery(currentSearchParams);

    const kpiData: KPIData = useMemo(() => {
        if (!data) {
            return { totalRevenue: 0, totalExpenses: 0, surplusDeficit: 0 };
        }
        const totalRevenue = data.totalRevenue || 0;
        const totalExpenses = data.totalExpenses || 0;
        const surplusDeficit = totalRevenue - totalExpenses;
        return { totalRevenue, totalExpenses, surplusDeficit };
    }, [data]);

    // Fonction de mise à jour des filtres avec le bon typage
    const handleFilterChange = (key: keyof FilterOptions, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return {
        data: data as FinancialReportResponse | undefined,
        kpiData,
        isLoading,
        isError,
        error,
        isFetching,
        filters: currentSearchParams,
        handleFilterChange,
    };
}