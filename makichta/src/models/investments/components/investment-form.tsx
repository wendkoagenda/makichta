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
import { INVESTMENT_TYPES, INVESTMENT_TYPE_LABELS } from "../constants/investment-types";

interface InvestmentFormProps {
  onSubmit: (data: {
    type: string;
    amount: number;
    date: string;
    description?: string;
  }) => Promise<boolean>;
  onCancel?: () => void;
}

export function InvestmentForm({ onSubmit, onCancel }: InvestmentFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [type, setType] = useState<string>(INVESTMENT_TYPES[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Montant invalide");
      return;
    }
    if (!date) {
      setError("La date est requise");
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onSubmit({
        type,
        amount: numAmount,
        date,
        description: description.trim() || undefined,
      });
      if (ok) {
        setAmount("");
        setDate(today);
        setDescription("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="inv-type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="inv-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INVESTMENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {INVESTMENT_TYPE_LABELS[t] ?? t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inv-amount">Montant (USDT)</Label>
          <Input
            id="inv-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inv-date">Date</Label>
          <Input
            id="inv-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="inv-desc">Description (optionnel)</Label>
        <Input
          id="inv-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex. Achat Bitcoin"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          Ajouter
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
