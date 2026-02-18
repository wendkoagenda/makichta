"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AllocationRule } from "../types/allocation-rule";

interface AllocationRuleFormProps {
  rule?: AllocationRule | null;
  onSubmit: (data: { label: string; percentage: number }) => Promise<boolean>;
  onCancel?: () => void;
}

export function AllocationRuleForm({
  rule,
  onSubmit,
  onCancel,
}: AllocationRuleFormProps) {
  const [label, setLabel] = useState(rule?.label ?? "");
  const [percentage, setPercentage] = useState(
    rule?.percentage != null ? String(rule.percentage) : "0"
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
    const pct = parseFloat(percentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setError("Le pourcentage doit être entre 0 et 100");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({ label: trimmed, percentage: pct });
      if (ok && !rule) {
        setLabel("");
        setPercentage("0");
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
