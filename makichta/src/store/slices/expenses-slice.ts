import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExpenseCategory {
  id: string;
  label: string;
  type: "FIXED" | "VARIABLE";
  monthlyBudget: number;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
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
  removeExpense,
  setLoading,
} = expensesSlice.actions;
