import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RevenueSource {
  id: string;
  label: string;
  frequency: "RECURRING" | "ONE_TIME";
  recurrenceInterval: "MONTHLY" | "WEEKLY" | "YEARLY" | null;
}

export interface Revenue {
  id: string;
  sourceId: string;
  amount: number;
  date: string;
  description: string;
}

interface RevenuesState {
  sources: RevenueSource[];
  revenues: Revenue[];
  isLoading: boolean;
}

const initialState: RevenuesState = {
  sources: [],
  revenues: [],
  isLoading: false,
};

export const revenuesSlice = createSlice({
  name: "revenues",
  initialState,
  reducers: {
    setSources(state, action: PayloadAction<RevenueSource[]>) {
      state.sources = action.payload;
    },
    addSource(state, action: PayloadAction<RevenueSource>) {
      state.sources.push(action.payload);
    },
    updateSource(state, action: PayloadAction<RevenueSource>) {
      const i = state.sources.findIndex((s) => s.id === action.payload.id);
      if (i >= 0) state.sources[i] = action.payload;
    },
    removeSource(state, action: PayloadAction<string>) {
      state.sources = state.sources.filter((s) => s.id !== action.payload);
    },
    setRevenues(state, action: PayloadAction<Revenue[]>) {
      state.revenues = action.payload;
    },
    addRevenue(state, action: PayloadAction<Revenue>) {
      state.revenues.push(action.payload);
    },
    updateRevenue(state, action: PayloadAction<Revenue>) {
      const i = state.revenues.findIndex((r) => r.id === action.payload.id);
      if (i >= 0) state.revenues[i] = action.payload;
    },
    removeRevenue(state, action: PayloadAction<string>) {
      state.revenues = state.revenues.filter((r) => r.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSources,
  addSource,
  updateSource,
  removeSource,
  setRevenues,
  addRevenue,
  updateRevenue,
  removeRevenue,
  setLoading,
} = revenuesSlice.actions;
