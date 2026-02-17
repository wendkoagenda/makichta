import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Investment {
  id: string;
  type: string;
  amount: number;
  date: string;
  description: string;
}

interface InvestmentsState {
  investments: Investment[];
  isLoading: boolean;
}

const initialState: InvestmentsState = {
  investments: [],
  isLoading: false,
};

export const investmentsSlice = createSlice({
  name: "investments",
  initialState,
  reducers: {
    setInvestments(state, action: PayloadAction<Investment[]>) {
      state.investments = action.payload;
    },
    addInvestment(state, action: PayloadAction<Investment>) {
      state.investments.push(action.payload);
    },
    removeInvestment(state, action: PayloadAction<string>) {
      state.investments = state.investments.filter(
        (i) => i.id !== action.payload
      );
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setInvestments,
  addInvestment,
  removeInvestment,
  setLoading,
} = investmentsSlice.actions;
