import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserSettings {
  currency: string;
  periodReference: string;
}

interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
}

const initialState: SettingsState = {
  settings: {
    currency: "USDT",
    periodReference: "MONTHLY",
  },
  isLoading: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<UserSettings>) {
      state.settings = action.payload;
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.settings.currency = action.payload;
    },
    setPeriodReference(state, action: PayloadAction<string>) {
      state.settings.periodReference = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setSettings,
  setCurrency,
  setPeriodReference,
  setLoading,
} = settingsSlice.actions;
