import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SavingGoal {
  id: string;
  label: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface SavingContribution {
  id: string;
  savingGoalId: string;
  amount: number;
  date: string;
  isAutomatic: boolean;
}

interface SavingsState {
  goals: SavingGoal[];
  contributions: SavingContribution[];
  isLoading: boolean;
}

const initialState: SavingsState = {
  goals: [],
  contributions: [],
  isLoading: false,
};

export const savingsSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {
    setGoals(state, action: PayloadAction<SavingGoal[]>) {
      state.goals = action.payload;
    },
    addGoal(state, action: PayloadAction<SavingGoal>) {
      state.goals.push(action.payload);
    },
    updateGoal(state, action: PayloadAction<SavingGoal>) {
      const index = state.goals.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) state.goals[index] = action.payload;
    },
    removeGoal(state, action: PayloadAction<string>) {
      state.goals = state.goals.filter((g) => g.id !== action.payload);
    },
    setContributions(state, action: PayloadAction<SavingContribution[]>) {
      state.contributions = action.payload;
    },
    addContribution(state, action: PayloadAction<SavingContribution>) {
      state.contributions.push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setGoals,
  addGoal,
  updateGoal,
  removeGoal,
  setContributions,
  addContribution,
  setLoading,
} = savingsSlice.actions;
