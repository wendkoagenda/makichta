"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpenseCategories } from "@/models/expense-categories/hooks/use-expense-categories";
import type { AllocationRule } from "../types/allocation-rule";

export interface AllocationRuleFormData {
  label: string;
  percentage: number;
  expenseCategoryIds?: string[];
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
  const [label, setLabel] = useState(rule?.label ?? "");
  const [percentage, setPercentage] = useState(
    rule?.percentage != null ? String(rule.percentage) : "0"
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    rule?.categoryIds ?? rule?.categories?.map((c) => c.id) ?? []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories(monthId);
  }, [monthId, fetchCategories]);

  useEffect(() => {
    if (rule) {
      setSelectedCategoryIds(rule.categoryIds ?? rule.categories?.map((c) => c.id) ?? []);
    }
  }, [rule?.id, rule?.categoryIds, rule?.categories]);

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
    const pct = parseFloat(percentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setError("Le pourcentage doit être entre 0 et 100");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        label: trimmed,
        percentage: pct,
        expenseCategoryIds: selectedCategoryIds,
      });
      if (ok && !rule) {
        setLabel("");
        setPercentage("0");
        setSelectedCategoryIds([]);
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
