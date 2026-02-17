"use client";

import { useSettings } from "../hooks/use-settings";
import {
  AVAILABLE_CURRENCIES,
  AVAILABLE_PERIODS,
} from "../types/user-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SettingsForm() {
  const { settings, setCurrency, setPeriodReference } = useSettings();

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Général</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currency">Devise d&apos;affichage</Label>
          <Select value={settings.currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Choisir une devise" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_CURRENCIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Les montants sont saisis en USDT et convertis pour l&apos;affichage
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Période de référence</Label>
          <Select
            value={settings.periodReference}
            onValueChange={setPeriodReference}
          >
            <SelectTrigger id="period">
              <SelectValue placeholder="Choisir une période" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
