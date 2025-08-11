import { IUtilisateur } from "@/features/utilisateur/types/utilisateur.type";
import { ICategorieDepense } from "./categorie-depense.type";

export interface IDepense {
  id: string;
  amount: number;
  description?: string;
  categoryId: string;
  recordedById: string;
  category: ICategorieDepense;
  recordedBy?: Pick<IUtilisateur, "id" | "firstName" | "lastName">;
  expenseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepensesParams {
  page?: number;
  limit?: number;
  recordedBy?: string;
  category?: string;
  amount?: number;
  expenseDate?: string;
}

export interface IDepenseStatsResponse {
  global: {
    totalExpenses: number;
    totalAmount: number;
    totalCategories: number;
    activeCategories: number;
    categoriesWithExpenses: number;
    categoriesWithoutExpenses: number;
  };

  byCategory: {
    categoryId: string;
    categoryName: string;
    categoryDescription: string;
    isActive: boolean;
    expenseCount: number;
    totalAmount: number;
    percentage: string; // ex: "66.67"
  }[];

  byAuthor: {
    userId: string;
    userName: string;
    count: number;
    totalAmount: number;
    percentage: string; // ex: "100.00"
  }[];

  topCategories: {
    byExpenseCount: {
      categoryId: string;
      categoryName: string;
      categoryDescription: string;
      isActive: boolean;
      expenseCount: number;
      totalAmount: number;
      percentage: string;
    }[];

    byTotalAmount: {
      categoryId: string;
      categoryName: string;
      categoryDescription: string;
      isActive: boolean;
      expenseCount: number;
      totalAmount: number;
      percentage: string;
    }[];
  };
}


