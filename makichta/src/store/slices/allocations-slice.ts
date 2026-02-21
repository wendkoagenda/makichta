import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AllocationRuleCategory {
  id: string;
  label: string;
}

export interface AllocationRuleSavingGoal {
  id: string;
  label: string;
}

export type AllocationRuleType = "PERCENT" | "AMOUNT";

export interface AllocationRule {
  id: string;
  label: string;
  allocationType: AllocationRuleType;
  percentage: number;
  amount: number | null;
  monthId: string;
  calculatedAmount?: number;
  savingGoalId?: string | null;
  savingGoal?: AllocationRuleSavingGoal | null;
  categoryIds?: string[];
  categories?: AllocationRuleCategory[];
}

export interface Allocation {
  id: string;
  revenueId: string;
  ruleId: string;
  amount: number;
}

interface AllocationsState {
  rules: AllocationRule[];
  allocations: Allocation[];
  isLoading: boolean;
}

const initialState: AllocationsState = {
  rules: [],
  allocations: [],
  isLoading: false,
};

export const allocationsSlice = createSlice({
  name: "allocations",
  initialState,
  reducers: {
    setRules(state, action: PayloadAction<AllocationRule[]>) {
      state.rules = action.payload;
    },
    addRule(state, action: PayloadAction<AllocationRule>) {
      state.rules.push(action.payload);
    },
    updateRule(state, action: PayloadAction<AllocationRule>) {
      const index = state.rules.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) state.rules[index] = action.payload;
    },
    removeRule(state, action: PayloadAction<string>) {
      state.rules = state.rules.filter((r) => r.id !== action.payload);
    },
    setAllocations(state, action: PayloadAction<Allocation[]>) {
      state.allocations = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setRules,
  addRule,
  updateRule,
  removeRule,
  setAllocations,
  setLoading,
} = allocationsSlice.actions;
