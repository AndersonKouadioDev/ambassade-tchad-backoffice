import { api } from "@/lib/api";
import {
    FinancialReportResponse,
    FilterOptions,
} from "../types/rapport-financier.type";

export interface IFinancialReportAPI {
    getFinancialReport(params: FilterOptions): Promise<FinancialReportResponse>;
    getTotalRevenue(params: FilterOptions): Promise<number>;
    getTotalDepenses(params: FilterOptions): Promise<number>;
}

export const financialReportAPI: IFinancialReportAPI = {
    async getFinancialReport(params: FilterOptions): Promise<FinancialReportResponse> {
        return await api.request<FinancialReportResponse>({
            endpoint: `/financial-reports`,
            method: "GET",
            searchParams: params,
        });
    },

    async getTotalRevenue(params: FilterOptions): Promise<number> {
        const response = await api.request<number>({
            endpoint: `/financial-reports/revenue/total`,
            method: "GET",
            searchParams: params,
        });
        return response;
    },

    async getTotalDepenses(params: FilterOptions): Promise<number> {
        const response = await api.request<number>({
            endpoint: `/financial-reports/expenses/total`,
            method: "GET",
            searchParams: params,
        });
        return response;
    },
};