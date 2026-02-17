"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSettings,
  setCurrency,
  setPeriodReference,
} from "@/store/slices/settings-slice";
import type { UserSettings } from "../types/user-settings";

export function useSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.settings);
  const isLoading = useAppSelector((state) => state.settings.isLoading);

  const handleSetSettings = (newSettings: UserSettings) => {
    dispatch(setSettings(newSettings));
  };

  const handleSetCurrency = (currency: string) => {
    dispatch(setCurrency(currency));
  };

  const handleSetPeriodReference = (period: string) => {
    dispatch(setPeriodReference(period));
  };

  return {
    settings,
    isLoading,
    setSettings: handleSetSettings,
    setCurrency: handleSetCurrency,
    setPeriodReference: handleSetPeriodReference,
  };
}
