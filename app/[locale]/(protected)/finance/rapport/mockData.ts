import { Transaction, RevenueByService, ExpenseByCategory, MonthlyData } from './types';

export const transactions: Transaction[] = [
  { id: '1', date: '2024-01-15', description: 'Visa Application Fee - Tourist', type: 'revenue', category: 'Visa Services', amount: 150 },
  { id: '2', date: '2024-01-15', description: 'Passport Renewal Fee', type: 'revenue', category: 'Passport Services', amount: 110 },
  { id: '3', date: '2024-01-14', description: 'Office Rent - January', type: 'expense', category: 'Rent', amount: -8500 },
  { id: '4', date: '2024-01-14', description: 'Staff Salary - Consular Officer', type: 'expense', category: 'Salaries', amount: -5200 },
  { id: '5', date: '2024-01-13', description: 'Business Visa Fee', type: 'revenue', category: 'Visa Services', amount: 200 },
  { id: '6', date: '2024-01-13', description: 'Office Supplies', type: 'expense', category: 'Supplies', amount: -320 },
  { id: '7', date: '2024-01-12', description: 'Notarization Service', type: 'revenue', category: 'Legal Services', amount: 75 },
  { id: '8', date: '2024-01-12', description: 'Utilities Bill', type: 'expense', category: 'Utilities', amount: -1200 },
  { id: '9', date: '2024-01-11', description: 'Emergency Passport Fee', type: 'revenue', category: 'Passport Services', amount: 185 },
  { id: '10', date: '2024-01-11', description: 'Security Services', type: 'expense', category: 'Security', amount: -2800 },
];

export const revenueByService: RevenueByService[] = [
  { service: 'Visa Services', amount: 45750, count: 183 },
  { service: 'Passport Services', amount: 28940, count: 157 },
  { service: 'Legal Services', amount: 12350, count: 98 },
  { service: 'Authentication Services', amount: 8420, count: 67 },
  { service: 'Emergency Services', amount: 5680, count: 24 },
];

export const expensesByCategory: ExpenseByCategory[] = [
  { category: 'Salaries', amount: 62400, percentage: 45.2 },
  { category: 'Rent', amount: 25500, percentage: 18.5 },
  { category: 'Utilities', amount: 14400, percentage: 10.4 },
  { category: 'Security', amount: 16800, percentage: 12.2 },
  { category: 'Supplies', amount: 9600, percentage: 7.0 },
  { category: 'Maintenance', amount: 5520, percentage: 4.0 },
  { category: 'Other', amount: 3780, percentage: 2.7 },
];

export const monthlyData: MonthlyData[] = [
  { month: 'Jan', revenue: 101140, expenses: 138000 },
  { month: 'Feb', revenue: 89650, expenses: 135200 },
  { month: 'Mar', revenue: 112340, expenses: 142800 },
  { month: 'Apr', revenue: 95780, expenses: 139600 },
  { month: 'May', revenue: 108920, expenses: 141200 },
  { month: 'Jun', revenue: 86450, expenses: 137800 },
  { month: 'Jul', revenue: 99870, expenses: 144000 },
  { month: 'Aug', revenue: 115680, expenses: 146200 },
  { month: 'Sep', revenue: 92340, expenses: 140800 },
  { month: 'Oct', revenue: 107250, expenses: 143600 },
  { month: 'Nov', revenue: 98760, expenses: 141800 },
  { month: 'Dec', revenue: 104820, expenses: 148000 },
];