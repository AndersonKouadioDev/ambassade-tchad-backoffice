import { api } from "@/lib/api";
import { IStatistiqueOptions, IStatistiqueResponse } from "../types/statistique.type";

export interface IStatistiqueAPI {
    getStatistiques(params: IStatistiqueOptions): Promise<IStatistiqueResponse>;
}

export const statistiqueAPI: IStatistiqueAPI = {
    async getStatistiques(params: IStatistiqueOptions): Promise<IStatistiqueResponse> {
        return await api.request<IStatistiqueResponse>({
            endpoint: `/statistiques`,
            method: "GET",
            searchParams: params,
        });
    },
};