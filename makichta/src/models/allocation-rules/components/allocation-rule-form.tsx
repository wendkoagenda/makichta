"use client";

import { useState, useEffect } from "react";
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
import { useExpenseCategories } from "@/models/expense-categories/hooks/use-expense-categories";
import { useSavingGoals } from "@/models/saving-goals/hooks/use-saving-goals";
import type { AllocationRule, AllocationRuleType } from "../types/allocation-rule";

const NONE_GOAL = "__none__";

export interface AllocationRuleFormData {
  label: string;
  allocationType: AllocationRuleType;
  percentage: number;
  amount: number | null;
  expenseCategoryIds?: string[];
  savingGoalId?: string | null;
}

interface AllocationRuleFormProps {
  monthId: string;
  rule?: AllocationRule | null;
  onSubmit: (data: AllocationRuleFormData) => Promise<boolean>;
  onCancel?: () => void;
}

export function AllocationRuleForm({
  monthId,
  rule,
  onSubmit,
  onCancel,
}: AllocationRuleFormProps) {
  const { categories, fetchCategories } = useExpenseCategories();
  const { goals, fetchGoals } = useSavingGoals();
  const [label, setLabel] = useState(rule?.label ?? "");
  const [allocationType, setAllocationType] = useState<AllocationRuleType>(
    rule?.allocationType === "AMOUNT" ? "AMOUNT" : "PERCENT"
  );
  const [percentage, setPercentage] = useState(
    rule?.percentage != null ? String(rule.percentage) : "0"
  );
  const [amount, setAmount] = useState(
    rule?.amount != null ? String(rule.amount) : ""
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    rule?.categoryIds ?? rule?.categories?.map((c) => c.id) ?? []
  );
  const [savingGoalId, setSavingGoalId] = useState<string>(
    rule?.savingGoalId ?? NONE_GOAL
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories(monthId);
  }, [monthId, fetchCategories]);

  useEffect(() => {
    fetchGoals(null);
  }, [fetchGoals]);

  useEffect(() => {
    if (rule) {
      setAllocationType(rule.allocationType === "AMOUNT" ? "AMOUNT" : "PERCENT");
      setPercentage(rule.percentage != null ? String(rule.percentage) : "0");
      setAmount(rule.amount != null ? String(rule.amount) : "");
      setSelectedCategoryIds(rule.categoryIds ?? rule.categories?.map((c) => c.id) ?? []);
      setSavingGoalId(rule.savingGoalId ?? NONE_GOAL);
    }
  }, [rule?.id, rule?.allocationType, rule?.percentage, rule?.amount, rule?.categoryIds, rule?.categories, rule?.savingGoalId]);

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = label.trim();
    if (!trimmed) {
      setError("Le libellé est requis");
      return;
    }
    if (allocationType === "PERCENT") {
      const pct = parseFloat(percentage);
      if (isNaN(pct) || pct < 0 || pct > 100) {
        setError("Le pourcentage doit être entre 0 et 100");
        return;
      }
    } else {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt < 0) {
        setError("Le montant doit être un nombre positif ou zéro");
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const pct = allocationType === "PERCENT" ? parseFloat(percentage) : 0;
      const amt = allocationType === "AMOUNT" ? parseFloat(amount) : null;
      const ok = await onSubmit({
        label: trimmed,
        allocationType,
        percentage: allocationType === "PERCENT" ? pct : 0,
        amount: allocationType === "AMOUNT" && amt != null && !Number.isNaN(amt) ? amt : null,
        expenseCategoryIds: selectedCategoryIds,
        savingGoalId: savingGoalId === NONE_GOAL ? null : savingGoalId,
      });
      if (ok && !rule) {
        setLabel("");
        setAllocationType("PERCENT");
        setPercentage("0");
        setAmount("");
        setSelectedCategoryIds([]);
        setSavingGoalId(NONE_GOAL);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rule-label">Poste (ex. Épargne, Charges fixes)</Label>
        <Input
          id="rule-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex. Épargne, Loisirs, Investissement..."
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label>Type de répartition</Label>
        <Select
          value={allocationType}
          onValueChange={(v) => setAllocationType(v as AllocationRuleType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENT">Pourcentage des revenus</SelectItem>
            <SelectItem value="AMOUNT">Montant fixe (par mois)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {allocationType === "PERCENT" ? (
        <div className="space-y-2">
          <Label htmlFor="rule-percentage">Pourcentage (%)</Label>
          <Input
            id="rule-percentage"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            La somme des pourcentages devrait idéalement faire 100 %
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="rule-amount">Montant fixe (par mois)</Label>
          <Input
            id="rule-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">
            Ce poste recevra ce montant au total sur le mois, réparti au prorata des revenus enregistrés.
          </p>
        </div>
      )}
      {goals.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="rule-saving-goal">Verser vers un objectif d&apos;épargne (optionnel)</Label>
          <Select
            value={savingGoalId}
            onValueChange={setSavingGoalId}
          >
            <SelectTrigger id="rule-saving-goal">
              <SelectValue placeholder="Aucun objectif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_GOAL}>Aucun objectif</SelectItem>
              {goals.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Quand un revenu est enregistré, ce pourcentage sera versé automatiquement sur cet objectif.
          </p>
        </div>
      )}
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>Lier aux catégories de dépenses (optionnel)</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent/50"
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={() => handleToggleCategory(cat.id)}
                  className="rounded border-input"
                />
                <span>{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {rule ? "Enregistrer" : "Ajouter"}
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
