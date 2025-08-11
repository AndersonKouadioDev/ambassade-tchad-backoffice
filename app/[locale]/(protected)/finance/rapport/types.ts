export interface Transaction {
    id: string;
    date: string;
    description: string;
    type: 'revenue' | 'expense';
    category: string;
    amount: number;
}

export interface RevenueByService {
    service: string;
    amount: number;
    count: number;
}

export interface ExpenseByCategory {
    category: string;
    amount: number;
    percentage: number;
}

export interface MonthlyData {
    month: string;
    revenue: number;
    expenses: number;
}

export interface KPIData {
    totalRevenue: number;
    totalExpenses: number;
    surplusDeficit: number;
}

export interface FilterOptions {
    period: 'month' | 'quarter' | 'year';
    year: number;
    month?: number;
    quarter?: number;
}