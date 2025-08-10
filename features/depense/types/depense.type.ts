export interface IDepense {
    id: string;
    amount: number;
    description?: string;
    categoryId: string;
    recordedById: string;
    category: {
        id: string;
        name: string;
        description?: string;
        isActive: boolean;
    };
    recordedBy?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    expenseDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDepensesParams {
    page?: number;
    limit?: number;
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
  

export interface IDepenseAddUpdateResponse {
    id: string;
    amount: number;
    description?: string;
    categoryId: string;
    recordedById: string;
    category: {
        id: string;
        name: string;
        description?: string;
        isActive: boolean;
    };
    recordedBy?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    expenseDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

