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
import { EXPENSE_TYPES } from "@/lib/constants";
import { EXPENSE_TYPE_LABELS } from "../constants/type-labels";
import type { ExpenseCategory } from "../types/expense-category";
import type { BudgetMode } from "../types/expense-category";

interface ExpenseCategoryFormProps {
  category?: ExpenseCategory | null;
  onSubmit: (data: {
    label: string;
    type: "FIXED" | "VARIABLE";
    monthlyBudget: number;
    budgetPercent: number | null;
  }) => Promise<boolean>;
  onCancel?: () => void;
}

export function ExpenseCategoryForm({
  category,
  onSubmit,
  onCancel,
}: ExpenseCategoryFormProps) {
  const budgetMode: BudgetMode =
    category?.budgetPercent != null ? "PERCENT" : "AMOUNT";
  const [label, setLabel] = useState(category?.label ?? "");
  const [type, setType] = useState<"FIXED" | "VARIABLE">(
    category?.type ?? "VARIABLE"
  );
  const [mode, setMode] = useState<BudgetMode>(budgetMode);
  const [monthlyBudget, setMonthlyBudget] = useState(
    category?.budgetPercent == null && category?.monthlyBudget != null
      ? String(category.monthlyBudget)
      : "0"
  );
  const [budgetPercent, setBudgetPercent] = useState(
    category?.budgetPercent != null ? String(category.budgetPercent) : "0"
  );
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
    if (mode === "AMOUNT") {
      const budget = parseFloat(monthlyBudget);
      if (isNaN(budget) || budget < 0) {
        setError("Le budget doit être un nombre positif ou zéro");
        return;
      }
    } else {
      const pct = parseFloat(budgetPercent);
      if (isNaN(pct) || pct < 0 || pct > 100) {
        setError("Le pourcentage doit être entre 0 et 100");
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        type,
        monthlyBudget: mode === "AMOUNT" ? parseFloat(monthlyBudget) : 0,
        budgetPercent: mode === "PERCENT" ? parseFloat(budgetPercent) : null,
      });
      if (ok && !category) {
        setLabel("");
        setType("VARIABLE");
        setMode("AMOUNT");
        setMonthlyBudget("0");
        setBudgetPercent("0");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-label">Libellé</Label>
        <Input
          id="category-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. Loyer, Alimentation, Transport..."
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-type">Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as "FIXED" | "VARIABLE")}>
          <SelectTrigger id="category-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EXPENSE_TYPES.FIXED}>
              {EXPENSE_TYPE_LABELS[EXPENSE_TYPES.FIXED]}
            </SelectItem>
            <SelectItem value={EXPENSE_TYPES.VARIABLE}>
              {EXPENSE_TYPE_LABELS[EXPENSE_TYPES.VARIABLE]}
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Fixe : charges récurrentes (loyer, abonnements). Variable : dépenses
          fluctuantes (alimentation, loisirs).
        </p>
      </div>

      <div className="space-y-2">
        <Label>Budget mensuel</Label>
        <Select
          value={mode}
          onValueChange={(v) => setMode(v as BudgetMode)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AMOUNT">Montant fixe (USDT)</SelectItem>
            <SelectItem value="PERCENT">% des revenus</SelectItem>
          </SelectContent>
        </Select>
        {mode === "AMOUNT" ? (
          <Input
            id="category-budget"
            type="number"
            step="0.01"
            min="0"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            placeholder="0"
          />
        ) : (
          <div className="flex items-center gap-2">
            <Input
              id="category-budget-percent"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={budgetPercent}
              onChange={(e) => setBudgetPercent(e.target.value)}
              placeholder="0"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {category ? "Enregistrer" : "Ajouter"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
