import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Asset {
  id: string;
  label: string;
  purchaseValue: number;
  depreciationDurationMonths: number;
  acquisitionDate: string;
}

interface DepreciationState {
  assets: Asset[];
  isLoading: boolean;
}

const initialState: DepreciationState = {
  assets: [],
  isLoading: false,
};

export const depreciationSlice = createSlice({
  name: "depreciation",
  initialState,
  reducers: {
    setAssets(state, action: PayloadAction<Asset[]>) {
      state.assets = action.payload;
    },
    addAsset(state, action: PayloadAction<Asset>) {
      state.assets.push(action.payload);
    },
    updateAsset(state, action: PayloadAction<Asset>) {
      const index = state.assets.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) state.assets[index] = action.payload;
    },
    removeAsset(state, action: PayloadAction<string>) {
      state.assets = state.assets.filter((a) => a.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setAssets,
  addAsset,
  updateAsset,
  removeAsset,
  setLoading,
} = depreciationSlice.actions;
