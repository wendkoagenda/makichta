"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ContributionFormMode = "contribution" | "withdrawal";

interface ContributionFormProps {
  savingGoalId: string;
  onSubmit: () => void;
  onCancel?: () => void;
  /** "withdrawal" = retrait (montant saisi positif, envoyé en négatif) */
  mode?: ContributionFormMode;
}

export function ContributionForm({
  savingGoalId,
  onSubmit,
  onCancel,
  mode = "contribution",
}: ContributionFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isWithdrawal = mode === "withdrawal";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Montant invalide");
      return;
    }
    const payloadAmount = isWithdrawal ? -numAmount : numAmount;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/saving-goals/${savingGoalId}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: payloadAmount, date, isAutomatic: false }),
      });
      if (!res.ok) throw new Error("Erreur");
      onSubmit();
    } catch {
      setError(isWithdrawal ? "Erreur lors du retrait" : "Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contrib-amount">
          {isWithdrawal ? "Montant du retrait (USDT)" : "Montant (USDT)"}
        </Label>
        <Input
          id="contrib-amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contrib-date">Date</Label>
        <Input
          id="contrib-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isWithdrawal ? "Retirer" : "Ajouter"}
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
