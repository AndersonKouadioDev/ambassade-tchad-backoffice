
// Représente une transaction financière (revenu ou dépense)
export interface Transaction {
  id: string;
  date: string; // Format 'YYYY-MM-DD'
  description: string;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
}

// Représente les revenus agrégés par type de service
export interface RevenueByService {
  service: string;
  amount: number;
  count: number;
}

// Représente les dépenses agrégées par catégorie
export interface ExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

// Représente les données agrégées pour un mois spécifique
export interface MonthlyData {
  month: string; // Ex: 'Jan', 'Feb', etc.
  revenue: number;
  expenses: number;
}

// L'interface principale pour la réponse complète de l'API
export interface FinancialReportResponse {
  totalRevenue: number;
  totalExpenses: number;
  transactions: Transaction[];
  revenueByService: RevenueByService[];
  expensesByCategory: ExpenseByCategory[];
  monthlyData: MonthlyData[];
}

// Options de filtre pour l'API de rapport financier
export interface FilterOptions {
  period: 'month' | 'quarter' | 'year';
  year: number;
  month?: number;
  quarter?: number;
}

export interface KPIData {
  totalRevenue: number;
  totalExpenses: number;
  surplusDeficit: number;
}