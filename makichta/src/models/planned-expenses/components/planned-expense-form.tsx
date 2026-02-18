"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RECURRENCE_INTERVALS, RECURRENCE_LABELS } from "../constants/recurrence-labels";
import type { CreatePlannedExpenseInput } from "../types/planned-expense";

interface PlannedExpenseFormProps {
  onSubmit: (data: CreatePlannedExpenseInput) => Promise<boolean>;
  onCancel?: () => void;
}

export function PlannedExpenseForm({ onSubmit, onCancel }: PlannedExpenseFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [label, setLabel] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState("MONTHLY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = label.trim();
    if (!trimmed) {
      setError("Le libellé est requis");
      return;
    }
    const amount = parseFloat(estimatedAmount);
    if (isNaN(amount) || amount < 0) {
      setError("Montant invalide");
      return;
    }
    if (!dueDate) {
      setError("La date est requise");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        estimatedAmount: amount,
        dueDate,
        isRecurring,
        recurrenceInterval: isRecurring ? recurrenceInterval : null,
      });
      if (ok) {
        setLabel("");
        setEstimatedAmount("");
        setDueDate(today);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pe-label">Libellé</Label>
        <Input
          id="pe-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. Vacances, Nouvelle voiture"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pe-amount">Montant estimé (USDT)</Label>
          <Input
            id="pe-amount"
            type="number"
            step="0.01"
            min="0"
            value={estimatedAmount}
            onChange={(e) => setEstimatedAmount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pe-date">Date prévue</Label>
          <Input
            id="pe-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="pe-recurring"
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
        />
        <Label htmlFor="pe-recurring">Dépense récurrente</Label>
      </div>
      {isRecurring && (
        <div className="space-y-2">
          <Label>Fréquence</Label>
          <Select value={recurrenceInterval} onValueChange={setRecurrenceInterval}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECURRENCE_INTERVALS.map((r) => (
                <SelectItem key={r} value={r}>
                  {RECURRENCE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>Créer</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        )}
      </div>
    </form>
  );
}
