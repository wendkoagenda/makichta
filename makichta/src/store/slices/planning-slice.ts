import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlannedExpense {
  id: string;
  label: string;
  estimatedAmount: number;
  dueDate: string;
  isRecurring: boolean;
  recurrenceInterval: "MONTHLY" | "YEARLY" | null;
  isDone: boolean;
}

interface PlanningState {
  plannedExpenses: PlannedExpense[];
  isLoading: boolean;
}

const initialState: PlanningState = {
  plannedExpenses: [],
  isLoading: false,
};

export const planningSlice = createSlice({
  name: "planning",
  initialState,
  reducers: {
    setPlannedExpenses(state, action: PayloadAction<PlannedExpense[]>) {
      state.plannedExpenses = action.payload;
    },
    addPlannedExpense(state, action: PayloadAction<PlannedExpense>) {
      state.plannedExpenses.push(action.payload);
    },
    updatePlannedExpense(state, action: PayloadAction<PlannedExpense>) {
      const index = state.plannedExpenses.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) state.plannedExpenses[index] = action.payload;
    },
    removePlannedExpense(state, action: PayloadAction<string>) {
      state.plannedExpenses = state.plannedExpenses.filter(
        (p) => p.id !== action.payload
      );
    },
    markAsDone(state, action: PayloadAction<string>) {
      const item = state.plannedExpenses.find(
        (p) => p.id === action.payload
      );
      if (item) item.isDone = true;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setPlannedExpenses,
  addPlannedExpense,
  updatePlannedExpense,
  removePlannedExpense,
  markAsDone,
  setLoading,
} = planningSlice.actions;
