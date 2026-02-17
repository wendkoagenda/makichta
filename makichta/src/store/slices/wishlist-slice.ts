import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: string;
  label: string;
  estimatedCost: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  url: string | null;
  savingGoalId: string | null;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<WishlistItem>) {
      state.items.push(action.payload);
    },
    updateItem(state, action: PayloadAction<WishlistItem>) {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    linkToSavingGoal(
      state,
      action: PayloadAction<{ itemId: string; savingGoalId: string }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.itemId);
      if (item) item.savingGoalId = action.payload.savingGoalId;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setItems,
  addItem,
  updateItem,
  removeItem,
  linkToSavingGoal,
  setLoading,
} = wishlistSlice.actions;
