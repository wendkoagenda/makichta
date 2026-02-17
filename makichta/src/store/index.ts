import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { revenuesSlice } from "./slices/revenues-slice";
import { allocationsSlice } from "./slices/allocations-slice";
import { expensesSlice } from "./slices/expenses-slice";
import { savingsSlice } from "./slices/savings-slice";
import { investmentsSlice } from "./slices/investments-slice";
import { planningSlice } from "./slices/planning-slice";
import { wishlistSlice } from "./slices/wishlist-slice";
import { depreciationSlice } from "./slices/depreciation-slice";
import { settingsSlice } from "./slices/settings-slice";

export const store = configureStore({
  reducer: {
    revenues: revenuesSlice.reducer,
    allocations: allocationsSlice.reducer,
    expenses: expensesSlice.reducer,
    savings: savingsSlice.reducer,
    investments: investmentsSlice.reducer,
    planning: planningSlice.reducer,
    wishlist: wishlistSlice.reducer,
    depreciation: depreciationSlice.reducer,
    settings: settingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
