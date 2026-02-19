import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExpenseCategory {
  id: string;
  label: string;
  type: "FIXED" | "VARIABLE";
  monthlyBudget: number;
  budgetPercent: number | null;
  monthId: string;
  allocationRules?: { id: string; label: string }[];
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  categoryLabel?: string;
}

interface ExpensesState {
  categories: ExpenseCategory[];
  expenses: Expense[];
  isLoading: boolean;
}

const initialState: ExpensesState = {
  categories: [],
  expenses: [],
  isLoading: false,
};

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<ExpenseCategory[]>) {
      state.categories = action.payload;
    },
    addCategory(state, action: PayloadAction<ExpenseCategory>) {
      state.categories.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<ExpenseCategory>) {
      const index = state.categories.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) state.categories[index] = action.payload;
    },
    removeCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload
      );
    },
    setExpenses(state, action: PayloadAction<Expense[]>) {
      state.expenses = action.payload;
    },
    addExpense(state, action: PayloadAction<Expense>) {
      state.expenses.push(action.payload);
    },
    updateExpense(state, action: PayloadAction<Expense>) {
      const index = state.expenses.findIndex(
        (e) => e.id === action.payload.id
      );
      if (index !== -1) state.expenses[index] = action.payload;
    },
    removeExpense(state, action: PayloadAction<string>) {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setExpenses,
  addExpense,
  updateExpense,
  removeExpense,
  setLoading,
} = expensesSlice.actions;
